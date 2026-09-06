import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { MarketStatus } from "@/lib/constants";

const suggestSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().max(500).optional(),
  outcomes: z.array(z.string().min(1).max(60)).min(2).max(4),
  closesAt: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const body = await request.json();
  const parsed = suggestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, outcomes, closesAt } = parsed.data;

  const market = await db.market.create({
    data: {
      title,
      description,
      status: MarketStatus.PENDING,
      createdById: authResult.session.user.id,
      closesAt: closesAt ? new Date(closesAt) : null,
      outcomes: {
        create: outcomes.map((label) => ({ label })),
      },
    },
    include: { outcomes: true },
  });

  return NextResponse.json(market, { status: 201 });
}

export async function GET() {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const markets = await db.market.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      outcomes: true,
      createdBy: { select: { id: true, name: true } },
      _count: { select: { wagers: true } },
    },
  });

  return NextResponse.json(markets);
}
