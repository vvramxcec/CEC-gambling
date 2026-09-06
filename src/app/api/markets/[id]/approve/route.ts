import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { MarketStatus } from "@/lib/constants";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/markets/[id]/approve">,
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await context.params;

  const market = await db.market.update({
    where: { id },
    data: {
      status: MarketStatus.OPEN,
      approvedById: authResult.session.user.id,
    },
    include: { outcomes: true },
  });

  return NextResponse.json(market);
}
