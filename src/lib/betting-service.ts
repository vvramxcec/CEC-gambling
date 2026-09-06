import { db } from "@/lib/db";
import {
  buildMarketOdds,
  calculatePayout,
  sumAmounts,
} from "@/lib/betting";
import { LedgerReason, MarketStatus } from "@/lib/constants";

export class BettingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export async function placeWager(
  userId: string,
  marketId: string,
  outcomeId: string,
  amount: number,
) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new BettingError("Stake must be a positive whole number");
  }

  const market = await db.market.findUnique({
    where: { id: marketId },
    include: { outcomes: true },
  });

  if (!market) throw new BettingError("Market not found", 404);
  if (market.status !== MarketStatus.OPEN) {
    throw new BettingError("Market is not open for betting");
  }
  if (market.closesAt && market.closesAt <= new Date()) {
    throw new BettingError("Market has closed");
  }

  const outcome = market.outcomes.find((item) => item.id === outcomeId);
  if (!outcome) throw new BettingError("Invalid outcome");

  return db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new BettingError("User not found", 404);
    if (user.pointBalance < amount) {
      throw new BettingError("Insufficient point balance");
    }

    await tx.user.update({
      where: { id: userId },
      data: { pointBalance: { decrement: amount } },
    });

    const wager = await tx.wager.create({
      data: { userId, marketId, outcomeId, amount },
    });

    await tx.pointLedger.create({
      data: {
        userId,
        delta: -amount,
        reason: LedgerReason.WAGER,
        marketId,
        note: `Wager on ${outcome.label}`,
      },
    });

    return wager;
  });
}

export async function resolveMarket(
  marketId: string,
  winningOutcomeId: string,
) {
  const market = await db.market.findUnique({
    where: { id: marketId },
    include: { outcomes: true },
  });

  if (!market) throw new BettingError("Market not found", 404);
  if (market.status !== MarketStatus.LOCKED && market.status !== MarketStatus.OPEN) {
    throw new BettingError("Market cannot be resolved in its current state");
  }

  const winningOutcome = market.outcomes.find(
    (outcome) => outcome.id === winningOutcomeId,
  );
  if (!winningOutcome) throw new BettingError("Invalid winning outcome");

  return db.$transaction(async (tx) => {
    const wagers = await tx.wager.findMany({ where: { marketId } });
    const totalPool = sumAmounts(wagers.map((wager) => wager.amount));

    if (totalPool === 0) {
      await tx.market.update({
        where: { id: marketId },
        data: {
          status: MarketStatus.RESOLVED,
          resolvedOutcomeId: winningOutcomeId,
        },
      });
      return { payouts: 0, winners: 0 };
    }

    const winners = wagers.filter((wager) => wager.outcomeId === winningOutcomeId);
    const winningSidePool = sumAmounts(winners.map((wager) => wager.amount));

    if (winningSidePool === 0) {
      throw new BettingError("Winning outcome has no wagers");
    }

    for (const wager of winners) {
      const payout = calculatePayout(wager.amount, winningSidePool, totalPool);
      await tx.user.update({
        where: { id: wager.userId },
        data: { pointBalance: { increment: payout } },
      });
      await tx.pointLedger.create({
        data: {
          userId: wager.userId,
          delta: payout - wager.amount,
          reason: LedgerReason.PAYOUT,
          marketId,
          note: `Won on ${winningOutcome.label}`,
        },
      });
    }

    await tx.market.update({
      where: { id: marketId },
      data: {
        status: MarketStatus.RESOLVED,
        resolvedOutcomeId: winningOutcomeId,
      },
    });

    return { payouts: winners.length, winners: winners.length };
  });
}

export async function voidMarket(marketId: string) {
  const market = await db.market.findUnique({ where: { id: marketId } });
  if (!market) throw new BettingError("Market not found", 404);
  if (market.status === MarketStatus.RESOLVED) {
    throw new BettingError("Resolved markets cannot be voided");
  }

  return db.$transaction(async (tx) => {
    const wagers = await tx.wager.findMany({ where: { marketId } });

    for (const wager of wagers) {
      await tx.user.update({
        where: { id: wager.userId },
        data: { pointBalance: { increment: wager.amount } },
      });
      await tx.pointLedger.create({
        data: {
          userId: wager.userId,
          delta: wager.amount,
          reason: LedgerReason.REFUND,
          marketId,
          note: "Market voided — stake refunded",
        },
      });
    }

    await tx.market.update({
      where: { id: marketId },
      data: { status: MarketStatus.VOID },
    });
  });
}

export async function getMarketOdds(marketId: string) {
  const market = await db.market.findUnique({
    where: { id: marketId },
    include: {
      outcomes: { orderBy: { label: "asc" } },
      wagers: true,
    },
  });

  if (!market) throw new BettingError("Market not found", 404);

  return buildMarketOdds(market.outcomes, market.wagers);
}

export async function getLeaderboard(limit = 50) {
  const users = await db.user.findMany({
    orderBy: { pointBalance: "desc" },
    take: limit,
    include: {
      wagers: {
        include: {
          market: { select: { status: true, resolvedOutcomeId: true } },
          outcome: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      ledger: {
        where: { reason: LedgerReason.PAYOUT },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return users.map((user, index) => {
    const totalWagered = sumAmounts(user.wagers.map((wager) => wager.amount));
    const wins = user.ledger.filter((entry) => entry.delta > 0).length;

    // Calculate streak: consecutive wins/losses from most recent resolved bets
    let streak = 0;
    const resolvedWagers = user.wagers.filter(
      (w) => w.market.status === "RESOLVED" && w.market.resolvedOutcomeId
    );
    for (const wager of resolvedWagers) {
      const isWin = wager.outcomeId === wager.market.resolvedOutcomeId;
      if (streak === 0) {
        streak = isWin ? 1 : -1;
      } else if ((streak > 0 && isWin) || (streak < 0 && !isWin)) {
        streak += isWin ? 1 : -1;
      } else {
        break;
      }
    }

    return {
      rank: index + 1,
      id: user.id,
      name: user.name,
      pointBalance: user.pointBalance,
      totalWagered,
      wins,
      betsPlaced: user.wagers.length,
      streak,
    };
  });
}
