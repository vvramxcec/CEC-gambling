import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, requireAdmin } from "@/lib/api-auth";
import {
  BettingError,
  getMarketOdds,
  placeWager,
  resolveMarket,
  voidMarket,
} from "@/lib/betting-service";
import { db } from "@/lib/db";
import { MarketStatus } from "@/lib/constants";

const wagerSchema = z.object({
  outcomeId: z.string().min(1),
  amount: z.number().int().positive(),
});

const resolveSchema = z.object({
  winningOutcomeId: z.string().min(1),
});

function handleBettingError(error: unknown) {
  if (error instanceof BettingError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  throw error;
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/markets/[id]/wager">,
) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const { id } = await context.params;

  try {
    const market = await db.market.findUnique({
      where: { id },
      include: {
        outcomes: true,
        createdBy: { select: { id: true, name: true } },
        wagers: {
          include: {
            user: { select: { id: true, name: true } },
            outcome: { select: { label: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    const odds = await getMarketOdds(id);
    return NextResponse.json({ market, odds });
  } catch (error) {
    return handleBettingError(error);
  }
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/markets/[id]/wager">,
) {
  const authResult = await requireUser();
  if ("error" in authResult) return authResult.error;

  const { id } = await context.params;
  const body = await request.json();
  const parsed = wagerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid wager payload" }, { status: 400 });
  }

  try {
    const wager = await placeWager(
      authResult.session.user.id,
      id,
      parsed.data.outcomeId,
      parsed.data.amount,
    );
    const odds = await getMarketOdds(id);
    return NextResponse.json({ wager, odds }, { status: 201 });
  } catch (error) {
    return handleBettingError(error);
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/markets/[id]/wager">,
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) return authResult.error;

  const { id } = await context.params;
  const body = await request.json();
  const action = body.action as string;

  try {
    if (action === "lock") {
      const market = await db.market.update({
        where: { id },
        data: { status: MarketStatus.LOCKED },
      });
      return NextResponse.json(market);
    }

    if (action === "void") {
      await voidMarket(id);
      const market = await db.market.findUnique({ where: { id } });
      return NextResponse.json(market);
    }

    const parsed = resolveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid resolve payload" }, { status: 400 });
    }

    await resolveMarket(id, parsed.data.winningOutcomeId);
    const market = await db.market.findUnique({
      where: { id },
      include: { outcomes: true, resolvedOutcome: true },
    });
    return NextResponse.json(market);
  } catch (error) {
    return handleBettingError(error);
  }
}
