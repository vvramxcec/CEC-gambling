import Link from "next/link";
import { db } from "@/lib/db";
import { getMarketOdds } from "@/lib/betting-service";
import { Card, Badge, Button } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { Zap, TrendingUp, Clock, Users, ExternalLink, ArrowRight } from "lucide-react";

interface LiveBetCardProps {
  market: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    closesAt: Date | null;
    createdBy: { name: string };
    outcomes: { id: string; label: string }[];
    _count: { wagers: number };
  };
  odds: {
    totalPool: number;
    outcomes: { outcomeId: string; label: string; sidePool: number; displayOdds: number | null }[];
  };
  hoursLeft: number | null;
  minutesLeft: number | null;
}

function LiveBetCard({ market, odds, hoursLeft, minutesLeft }: LiveBetCardProps) {
  const isOpen = market.status === "OPEN";

  return (
    <Link href={`/markets/${market.id}`} className="group">
      <Card variant="gradient" padding="lg" className="relative overflow-hidden group-hover:border-[var(--color-gold)]/50 transition-all duration-300">
        {/* Status indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          {isOpen && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-gold)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-gold)]" />
            </span>
          )}
          <Badge variant={isOpen ? "emerald" : "gold"} size="sm">
            {market.status}
          </Badge>
        </div>

        {/* Gold accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-display text-xl font-bold text-[var(--color-cream)] mb-2 group-hover:text-[var(--color-gold)] transition-colors">
              {market.title}
            </h3>
            {market.description && (
              <p className="text-sm text-[var(--color-muted)] line-clamp-2">{market.description}</p>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)] mb-4">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              {market._count.wagers} bets
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              {formatNumber(odds.totalPool)} pts pool
            </span>
            {hoursLeft !== null && hoursLeft > 0 && (
              <span className="flex items-center gap-1 text-[var(--color-gold)]">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {hoursLeft}h left
              </span>
            )}
            {minutesLeft !== null && minutesLeft <= 60 && minutesLeft > 0 && (
              <span className="flex items-center gap-1 text-[var(--color-crimson-light)] animate-pulse">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {minutesLeft}m left
              </span>
            )}
          </div>

          {/* Outcomes with odds bars */}
          <div className="space-y-3 mb-4">
            {odds.outcomes.map((outcome) => {
              const share = odds.totalPool > 0 ? (outcome.sidePool / odds.totalPool) * 100 : 0;
              return (
                <div key={outcome.outcomeId} className="group/outcome">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-[var(--color-cream)] group-hover/outcome:text-[var(--color-gold)] transition-colors">
                      {outcome.label}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-[var(--color-gold)]">
                        {outcome.displayOdds ? `${outcome.displayOdds.toFixed(2)}x` : "—"}
                      </span>
                      <span className="text-[var(--color-muted)]">
                        {formatNumber(outcome.sidePool)} pts ({share.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dim)] transition-all duration-500 group-hover/outcome:shadow-[0_0_8px_rgba(201,162,39,0.6)]"
                      style={{ width: `${Math.max(share, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with creator and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-card-border)]">
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <span>By</span>
              <span className="font-medium text-[var(--color-cream)]">{market.createdBy.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-gold)] group-hover:gap-3 transition-all">
              <span>{isOpen ? "Place Bet" : "View Details"}</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export async function LiveBetsSection() {
  const markets = await db.market.findMany({
    where: { status: { in: ["OPEN", "LOCKED"] } },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      outcomes: true,
      createdBy: { select: { name: true } },
      _count: { select: { wagers: true } },
    },
  });

  // Get odds for each market
  const marketsWithOdds = await Promise.all(
    markets.map(async (market) => {
      const odds = await getMarketOdds(market.id);
      return { market, odds };
    })
  );

  const now = new Date().getTime();
  const openMarketsWithTime = marketsWithOdds
    .filter((m) => m.market.status === "OPEN")
    .map(({ market, odds }) => {
      const timeLeft = market.closesAt ? new Date(market.closesAt).getTime() - now : null;
      const hoursLeft = timeLeft && timeLeft > 0 ? Math.ceil(timeLeft / (1000 * 60 * 60)) : null;
      const minutesLeft = timeLeft && timeLeft > 0 ? Math.ceil(timeLeft / (1000 * 60)) : null;
      return { market, odds, hoursLeft, minutesLeft };
    });
  const lockedMarkets = marketsWithOdds.filter((m) => m.market.status === "LOCKED");

  return (
    <section id="live-bets" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--color-gold)]/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge variant="gold" size="lg" className="mb-4">
            <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
            Live Markets
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-cream)] mb-4">
            Bets Happening <span className="gold-gradient">Right Now</span>
          </h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
            Real pari-mutuel odds update every 5 seconds. No house edge — just classmates vs classmates.
          </p>
        </div>

        {openMarketsWithTime.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-semibold text-[var(--color-cream)]">
                Open for Betting ({openMarketsWithTime.length})
              </h3>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] flex items-center gap-1"
              >
                View All
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openMarketsWithTime.map(({ market, odds, hoursLeft, minutesLeft }) => (
                <LiveBetCard key={market.id} market={market} odds={odds} hoursLeft={hoursLeft} minutesLeft={minutesLeft} />
              ))}
            </div>
          </div>
        )}

        {lockedMarkets.length > 0 && (
          <div>
            <h3 className="font-display text-xl font-semibold text-[var(--color-cream)] mb-6">
              Locked — Awaiting Result ({lockedMarkets.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedMarkets.map(({ market, odds }) => (
                <LiveBetCard key={market.id} market={market} odds={odds} hoursLeft={null} minutesLeft={null} />
              ))}
            </div>
          </div>
        )}

        {(openMarketsWithTime.length === 0 && lockedMarkets.length === 0) && (
          <Card variant="glass" padding="xl" className="text-center max-w-xl mx-auto">
            <Zap className="w-16 h-16 mx-auto text-[var(--color-muted)]/50 mb-4" />
            <h3 className="font-display text-xl font-semibold text-[var(--color-cream)] mb-2">No Live Markets</h3>
            <p className="text-[var(--color-muted)] mb-6">Check back soon — new bets drop daily!</p>
            <Link href="/suggest">
              <span className="inline-flex items-center gap-2 text-[var(--color-gold)] font-medium hover:text-[var(--color-gold-light)] transition-colors">
                Suggest a Bet
                <TrendingUp className="w-4 h-4" />
              </span>
            </Link>
          </Card>
        )}

        {/* CTA for non-logged in users */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-[var(--color-muted)] mb-4">New to CLASSBET?</p>
          <Link href="/login?mode=signup">
            <Button size="lg" className="group">
              <Zap className="w-5 h-5" />
              Join the Action
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}