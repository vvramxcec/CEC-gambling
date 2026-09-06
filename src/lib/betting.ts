export type OutcomePool = {
  outcomeId: string;
  label: string;
  sidePool: number;
  displayOdds: number | null;
};

export type MarketOdds = {
  totalPool: number;
  outcomes: OutcomePool[];
};

export function sumAmounts(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

export function calculateDisplayOdds(
  totalPool: number,
  sidePool: number,
): number | null {
  if (sidePool <= 0) return null;
  if (totalPool <= 0) return 1;
  return Math.round((totalPool / sidePool) * 100) / 100;
}

export function calculatePotentialReturn(
  stake: number,
  totalPool: number,
  sidePool: number,
): number {
  if (stake <= 0) return 0;
  const nextTotal = totalPool + stake;
  const nextSide = sidePool + stake;
  if (nextSide <= 0) return stake;
  return Math.floor((stake * nextTotal) / nextSide);
}

export function calculatePayout(
  userStake: number,
  winningSidePool: number,
  totalPool: number,
): number {
  if (userStake <= 0 || winningSidePool <= 0 || totalPool <= 0) return 0;
  return Math.floor((userStake / winningSidePool) * totalPool);
}

export function calculateImpliedProbability(
  totalPool: number,
  sidePool: number,
): number | null {
  if (sidePool <= 0 || totalPool <= 0) return null;
  return Math.round((sidePool / totalPool) * 10000) / 100;
}

export function buildMarketOdds(
  outcomes: { id: string; label: string }[],
  wagers: { outcomeId: string; amount: number }[],
): MarketOdds {
  const totalPool = sumAmounts(wagers.map((wager) => wager.amount));

  const outcomesWithPools = outcomes.map((outcome) => {
    const sidePool = sumAmounts(
      wagers
        .filter((wager) => wager.outcomeId === outcome.id)
        .map((wager) => wager.amount),
    );

    return {
      outcomeId: outcome.id,
      label: outcome.label,
      sidePool,
      displayOdds: calculateDisplayOdds(totalPool, sidePool),
    };
  });

  return {
    totalPool,
    outcomes: outcomesWithPools,
  };
}
