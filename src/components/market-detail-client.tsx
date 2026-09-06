"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { calculatePotentialReturn, calculateImpliedProbability } from "@/lib/betting";
import { Badge, Button, Card, CardSkeleton, Input, QuickBetChips, statusTone, ConfirmDialog } from "@/components/ui";
import { useToast } from "@/components/toast";
import { Zap, Clock, Users, ArrowLeft, ChevronRight, AlertCircle } from "lucide-react";

type OutcomeOdds = {
  outcomeId: string;
  label: string;
  sidePool: number;
  displayOdds: number | null;
};

type MarketDetailClientProps = {
  marketId: string;
  initialStatus: string;
  userBalance: number;
};

export function MarketDetailClient({
  marketId,
  initialStatus,
  userBalance,
}: MarketDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [market, setMarket] = useState<{
    title: string;
    description: string | null;
    status: string;
    closesAt: string | null;
    outcomes: { id: string; label: string }[];
    wagers: {
      id: string;
      amount: number;
      createdAt: string;
      user: { name: string };
      outcome: { label: string };
    }[];
  } | null>(null);
  const [odds, setOdds] = useState<{
    totalPool: number;
    outcomes: OutcomeOdds[];
  } | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string>("");
  const [amount, setAmount] = useState("50");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [optimisticOdds, setOptimisticOdds] = useState<{
    totalPool: number;
    outcomes: OutcomeOdds[];
  } | null>(null);
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMarket = useCallback(async () => {
    const response = await fetch(`/api/markets/${marketId}/wager`);
    if (!response.ok) return;
    const data = await response.json();
    setMarket(data.market);
    setOdds(data.odds);
    if (!selectedOutcome && data.market.outcomes[0]) {
      setSelectedOutcome(data.market.outcomes[0].id);
    }
  }, [marketId, selectedOutcome]);

  // Initial fetch + polling for open markets
  // Use setTimeout to avoid synchronous setState in effect
  useEffect(() => {
    setTimeout(() => {
      fetchMarket();
    }, 0);
    if (initialStatus === "OPEN") {
      fetchTimerRef.current = setInterval(fetchMarket, 5000);
    }
    return () => {
      if (fetchTimerRef.current) clearInterval(fetchTimerRef.current);
    };
  }, [marketId, initialStatus, fetchMarket]);

  const applyOptimisticUpdate = useCallback((outcomeId: string, stake: number) => {
    setOptimisticOdds((prev) => {
      if (!prev) return prev;
      const newTotalPool = prev.totalPool + stake;
      return {
        ...prev,
        totalPool: newTotalPool,
        outcomes: prev.outcomes.map((o) =>
          o.outcomeId === outcomeId
            ? {
                ...o,
                sidePool: o.sidePool + stake,
                displayOdds:
                  o.sidePool + stake > 0
                    ? newTotalPool / (o.sidePool + stake)
                    : null,
              }
            : {
                ...o,
                displayOdds: o.sidePool > 0 ? newTotalPool / o.sidePool : null,
              }
        ),
      };
    });
  }, []);

  const revertOptimisticUpdate = useCallback(() => {
    setOptimisticOdds(null);
  }, []);

  async function placeBet() {
    if (Number(amount) > userBalance) {
      setError("Insufficient balance");
      toast("Not enough points!", "error");
      return;
    }
    setLoading(true);
    setError(null);
    setShowConfirm(false);

    // Optimistic update
    applyOptimisticUpdate(selectedOutcome, Number(amount));

    const response = await fetch(`/api/markets/${marketId}/wager`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outcomeId: selectedOutcome,
        amount: Number(amount),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Could not place bet");
      revertOptimisticUpdate();
      toast(data.error || "Could not place bet", "error");
      return;
    }

    toast("Bet placed!", "success");
    await fetchMarket();
    router.refresh();
  }

  const handleConfirmBet = () => {
    setShowConfirm(true);
  };

  if (!market || !odds) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const displayOdds = optimisticOdds ?? odds;
  const selectedPool =
    displayOdds.outcomes.find((outcome) => outcome.outcomeId === selectedOutcome)
      ?.sidePool ?? 0;
  const potentialReturn = calculatePotentialReturn(
    Number(amount) || 0,
    displayOdds.totalPool,
    selectedPool,
  );
  const impliedProb = calculateImpliedProbability(displayOdds.totalPool, selectedPool);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <Card variant="gradient" padding="lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="font-display text-2xl font-bold text-[var(--color-cream)]">{market.title}</h2>
            <Badge variant={statusTone(market.status)}>{market.status}</Badge>
          </div>
          {market.description && (
            <p className="text-[var(--color-muted)] mb-4">{market.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)] mb-6">
            {market.closesAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Closes: {new Date(market.closesAt).toLocaleString()}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {market.wagers.length} bets
            </span>
          </div>
          <p className="font-display font-bold text-xl text-[var(--color-gold-light)] flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Total pool: {displayOdds.totalPool.toLocaleString()} pts
          </p>
          <div className="mt-6 space-y-5">
            {displayOdds.outcomes.map((outcome) => {
              const share =
                displayOdds.totalPool > 0
                  ? Math.round((outcome.sidePool / displayOdds.totalPool) * 100)
                  : 0;
              const implied = calculateImpliedProbability(displayOdds.totalPool, outcome.sidePool);
              const isSelected = selectedOutcome === outcome.outcomeId;
              return (
                <div
                  key={outcome.outcomeId}
                  className={`group relative overflow-hidden rounded-xl p-4 transition-all ${
                    isSelected
                      ? "bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/30"
                      : "bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full border-2 transition-all ${
                          isSelected
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)]"
                            : "border-[var(--color-muted)]"
                        }`}
                      />
                      <span className="font-medium text-[var(--color-cream)]">{outcome.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[var(--color-gold-light)]">
                        {outcome.displayOdds ? `${outcome.displayOdds.toFixed(2)}x` : "—"}
                      </span>
                      {implied !== null && (
                        <span className="text-[var(--color-muted)]">~{implied}%</span>
                      )}
                      <span className="text-[var(--color-muted)]">
                        {outcome.sidePool.toLocaleString()} pts ({share}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-bg-deep)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dim)] transition-all duration-500"
                      style={{ width: `${Math.max(share, isSelected ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-gold)]" />
            Recent wagers
          </h3>
          {market.wagers.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-10 h-10 mx-auto text-[var(--color-muted)]/50 mb-3" />
              <p className="text-[var(--color-muted)]">No bets yet — be the first!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {market.wagers.map((wager) => (
                <li
                  key={wager.id}
                  className="group flex items-center justify-between gap-4 p-3 rounded-xl bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-gold)]/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-[var(--color-gold)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-cream)] truncate">{wager.user.name}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate">
                        on {wager.outcome.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-display font-bold text-[var(--color-gold-light)]">
                      {wager.amount.toLocaleString()} pts
                    </span>
                    <Badge variant={statusTone(wager.market.status)} size="xs">
                      {wager.market.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card variant="gradient" padding="lg" className="h-fit sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--color-gold)]" />
            Bet slip
          </h3>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[var(--color-bg-elevated)]/50 border border-[var(--color-card-border)]">
          <p className="text-sm text-[var(--color-muted)]">Your balance</p>
          <p className="font-display font-bold text-2xl text-[var(--color-gold-light)] mt-1">{userBalance.toLocaleString()} pts</p>
        </div>

        {market.status === "OPEN" ? (
          <div className="space-y-5">
            <div className="space-y-3">
              {market.outcomes.map((outcome) => (
                <label
                  key={outcome.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                    selectedOutcome === outcome.id
                      ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5"
                      : "border-[var(--color-card-border)] hover:border-[var(--color-gold)]/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === outcome.id}
                    onChange={() => setSelectedOutcome(outcome.id)}
                    className="w-4 h-4 accent-[var(--color-gold)]"
                  />
                  <span className="font-medium text-[var(--color-cream)]">{outcome.label}</span>
                  {selectedOutcome === outcome.id && (
                    <ChevronRight className="w-4 h-4 text-[var(--color-gold)] ml-auto" />
                  )}
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">Stake amount</label>
              <Input
                type="number"
                min={1}
                max={userBalance}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter stake"
                className="text-lg"
              />
            </div>

            <QuickBetChips amount={amount} setAmount={setAmount} balance={userBalance} />

            <div className="rounded-xl bg-[var(--color-bg-elevated)] p-4 border border-[var(--color-card-border)]" aria-live="polite">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--color-muted)]">Potential return</span>
                <Badge variant="gold" size="xs">LIVE</Badge>
              </div>
              <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
                {potentialReturn.toLocaleString()} pts
              </p>
              {impliedProb !== null && (
                <p className="text-xs text-[var(--color-muted)] mt-1">~{impliedProb}% implied chance</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-[var(--color-crimson)]/10 border border-[var(--color-crimson)]/20 px-4 py-3 text-sm text-[var(--color-crimson-light)] flex items-center gap-2 animate-slide-up">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              className="w-full py-3 text-base"
              disabled={loading || !selectedOutcome || Number(amount) > userBalance}
              onClick={handleConfirmBet}
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[var(--color-bg-deep)] border-t-transparent rounded-full animate-spin" />
                  Placing bet...
                </span>
              ) : (
                "Place bet"
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 mx-auto text-[var(--color-muted)]/50 mb-3" />
            <p className="text-[var(--color-muted)]">This market is not open for betting.</p>
            {market.status === "LOCKED" && (
              <Badge variant="muted" size="md" className="mt-3 inline-flex">
                Locked — awaiting result
              </Badge>
            )}
          </div>
        )}

        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={placeBet}
          title="Confirm bet"
          description={
            <>
              You&apos;re betting <strong>{amount}</strong> pts on{" "}
              <strong>{market.outcomes.find((o) => o.id === selectedOutcome)?.label}</strong>.
              Potential return: <strong>{potentialReturn.toLocaleString()}</strong> pts.
            </>
          }
          confirmText="Confirm bet"
          variant="primary"
          loading={loading}
        />

        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </Card>
    </div>
  );
}