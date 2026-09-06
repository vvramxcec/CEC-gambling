import {
  buildMarketOdds,
  calculateDisplayOdds,
  calculatePayout,
  calculatePotentialReturn,
} from "@/lib/betting";
import { describe, expect, it } from "vitest";

describe("calculateDisplayOdds", () => {
  it("returns null when side pool is zero", () => {
    expect(calculateDisplayOdds(1000, 0)).toBeNull();
  });

  it("calculates decimal odds from pool share", () => {
    expect(calculateDisplayOdds(1000, 200)).toBe(5);
    expect(calculateDisplayOdds(1000, 800)).toBe(1.25);
  });
});

describe("calculatePotentialReturn", () => {
  it("estimates payout for a new stake", () => {
    // stake=100, totalPool=900, sidePool=200
    // nextTotal=1000, nextSide=300
    // floor(100 * 1000 / 300) = floor(333.33) = 333
    expect(calculatePotentialReturn(100, 900, 200)).toBe(333);
  });
});

describe("calculatePayout", () => {
  it("splits pool proportionally among winners", () => {
    expect(calculatePayout(200, 200, 1000)).toBe(1000);
    expect(calculatePayout(100, 300, 1000)).toBe(333);
  });

  it("returns zero for invalid inputs", () => {
    expect(calculatePayout(0, 100, 1000)).toBe(0);
  });
});

describe("buildMarketOdds", () => {
  it("builds odds for uneven pools", () => {
    const odds = buildMarketOdds(
      [
        { id: "early", label: "Early" },
        { id: "late", label: "Late" },
      ],
      [
        { outcomeId: "early", amount: 200 },
        { outcomeId: "late", amount: 800 },
      ],
    );

    expect(odds.totalPool).toBe(1000);
    expect(odds.outcomes[0].displayOdds).toBe(5);
    expect(odds.outcomes[1].displayOdds).toBe(1.25);
  });
});
