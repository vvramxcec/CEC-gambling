import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { MarketStatus } from "@/lib/constants";

const rejectSchema = z.object({
  reason: z.string().max(200).optional(),
});

export async function POST(
  request: Request,
  context: RouteContext<"/api/markets/[id]/reject">,
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const parsed = rejectSchema.safeParse(body);

  const market = await db.market.update({
    where: { id },
    data: {
      status: MarketStatus.REJECTED,
      rejectReason: parsed.success ? parsed.data.reason : undefined,
    },
  });

  return NextResponse.json(market);
}
