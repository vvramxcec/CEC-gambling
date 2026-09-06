import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Badge, Card, PageShell, formatNumber } from "@/components/ui";
import { db } from "@/lib/db";
import { getLeaderboard } from "@/lib/betting-service";
import { getMarketOdds } from "@/lib/betting-service";
import { Zap, Trophy, Clock, Users, ArrowRight, ExternalLink, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const [markets, leaderboard] = await Promise.all([
    db.market.findMany({
      where: { status: { in: ["OPEN", "PENDING", "LOCKED"] } },
      orderBy: { createdAt: "desc" },
      include: {
        outcomes: true,
        createdBy: { select: { name: true } },
        _count: { select: { wagers: true } },
      },
    }),
    getLeaderboard(5),
  ]);

  // Get odds for open markets
  const marketsWithOdds = await Promise.all(
    markets
      .filter((m) => m.status === "OPEN" || m.status === "LOCKED")
      .map(async (market) => {
        const odds = await getMarketOdds(market.id);
        return { market, odds };
      })
  );

  const openMarkets = marketsWithOdds.filter((m) => m.market.status === "OPEN");
  const lockedMarkets = marketsWithOdds.filter((m) => m.market.status === "LOCKED");
  const pendingMarkets = markets.filter((market) => market.status === "PENDING");

  // Compute hours left server-side (server component, Date.now() is fine here)
  const now = new Date().getTime();
  const openMarketsWithTime = openMarkets.map(({ market, odds }) => ({
    market,
    odds,
    hoursLeft: market.closesAt ? Math.max(0, Math.ceil((new Date(market.closesAt).getTime() - now) / (1000 * 60 * 60))) : null,
  }));

  return (
    <AppLayout>
      <PageShell
        title="Dashboard"
        subtitle="Live markets, pending suggestions, and the points race."
        action={
          <div className="flex gap-3">
            <Link href="/suggest">
              <span className="btn-secondary px-4 py-2 text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Suggest Bet
              </span>
            </Link>
            <Link href="/leaderboard">
              <span className="btn-primary px-4 py-2 text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </span>
            </Link>
          </div>
        }
      >
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="default" padding="md" className="text-center">
            <Zap className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {openMarkets.length + lockedMarkets.length}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Active Markets</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {formatNumber(marketsWithOdds.reduce((a, b) => a + b.odds.totalPool, 0))}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Pool</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Users className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {formatNumber(marketsWithOdds.reduce((a, b) => a + b.market._count.wagers, 0))}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Bets</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Trophy className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {leaderboard[0]?.pointBalance ? formatNumber(leaderboard[0].pointBalance) : "—"}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Top Score</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {/* Open Markets */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[var(--color-gold)]" />
                  Open for Betting ({openMarkets.length})
                </h2>
                {openMarkets.length > 0 && (
                  <Link href="/dashboard" className="text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] flex items-center gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {openMarkets.length === 0 ? (
                <Card variant="glass" padding="lg" className="text-center">
                  <Zap className="w-12 h-12 mx-auto text-[var(--color-muted)]/50 mb-4" />
                  <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">No Open Markets</h3>
                  <p className="text-[var(--color-muted)] mb-6">Check back soon — new bets drop daily!</p>
                  <Link href="/suggest">
                    <span className="inline-flex items-center gap-2 text-[var(--color-gold)] font-medium hover:text-[var(--color-gold-light)] transition-colors">
                      Suggest a Bet
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {openMarketsWithTime.map(({ market, odds, hoursLeft }) => (
                    <Link key={market.id} href={`/markets/${market.id}`} className="group">
                      <Card variant="gradient" padding="lg" className="relative overflow-hidden hover:border-[var(--color-gold)]/50 transition-all duration-300">
                        <div className="absolute top-3 right-3">
                          <Badge variant="emerald" size="sm">
                            <span className="relative flex h-1.5 w-1.5 mr-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-gold)] opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-gold)]" />
                            </span>
                            LIVE
                          </Badge>
                        </div>

                        <h3 className="font-display text-lg font-bold text-[var(--color-cream)] mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                          {market.title}
                        </h3>
                        {market.description && (
                          <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-1">{market.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {market._count.wagers} bets
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            {formatNumber(odds.totalPool)} pts
                          </span>
                          {market.closesAt && hoursLeft !== null && hoursLeft > 0 && (
                            <span className="flex items-center gap-1 text-[var(--color-gold)]">
                              <Clock className="w-3.5 h-3.5" />
                              {hoursLeft}h
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          {odds.outcomes.slice(0, 3).map((outcome) => {
                            const share = odds.totalPool > 0 ? (outcome.sidePool / odds.totalPool) * 100 : 0;
                            return (
                              <div key={outcome.outcomeId}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="font-medium text-[var(--color-cream)]">{outcome.label}</span>
                                  <span className="font-mono text-[var(--color-gold)] text-xs">
                                    {outcome.displayOdds ? `${outcome.displayOdds.toFixed(2)}x` : "—"}
                                  </span>
                                </div>
                                <div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dim)]"
                                    style={{ width: `${Math.max(share, 3)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-card-border)]">
                          <span className="text-xs text-[var(--color-muted)]">By {market.createdBy.name}</span>
                          <span className="text-sm font-medium text-[var(--color-gold)] flex items-center gap-1">
                            Place Bet
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Locked Markets */}
            {lockedMarkets.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--color-muted)]" />
                  Locked — Awaiting Result ({lockedMarkets.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedMarkets.map(({ market, odds }) => (
                    <Link key={market.id} href={`/markets/${market.id}`} className="group">
                      <Card variant="default" padding="lg" className="hover:border-[var(--color-gold)]/30 transition-all duration-300">
                        <div className="absolute top-3 right-3">
                          <Badge variant="muted" size="sm">LOCKED</Badge>
                        </div>

                        <h3 className="font-display text-lg font-bold text-[var(--color-cream)] mb-2">{market.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {market._count.wagers} bets
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5" />
                            {formatNumber(odds.totalPool)} pts
                          </span>
                        </div>
                        <div className="space-y-2">
                          {odds.outcomes.slice(0, 2).map((outcome) => {
                            const share = odds.totalPool > 0 ? (outcome.sidePool / odds.totalPool) * 100 : 0;
                            return (
                              <div key={outcome.outcomeId} className="flex items-center justify-between text-sm">
                                <span className="text-[var(--color-cream)]">{outcome.label}</span>
                                <span className="font-mono text-[var(--color-muted)]">{share.toFixed(1)}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Pending Markets */}
            {pendingMarkets.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--color-gold)]" />
                  Awaiting Approval ({pendingMarkets.length})
                </h2>
                <div className="space-y-4">
                  {pendingMarkets.map((market) => (
                    <Card key={market.id} variant="default" padding="lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-bold text-[var(--color-cream)]">{market.title}</h3>
                          <p className="mt-1 text-sm text-[var(--color-muted)]">Suggested by {market.createdBy.name}</p>
                          {market.description && (
                            <p className="mt-2 text-sm text-[var(--color-cream)]/80">{market.description}</p>
                          )}
                        </div>
                        <Badge variant="gold" size="md">PENDING</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <Card variant="glass" padding="lg" className="h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold text-[var(--color-cream)] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-gold)]" />
                Top Points
              </h2>
              <Link href="/leaderboard" className="text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] flex items-center gap-1">
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <Link key={entry.id} href={`/profile/${entry.id}`} className="group flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)] transition-all">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl font-display font-bold ${
                    index === 0 ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)]" :
                    index === 1 ? "bg-[var(--color-muted)]/20 text-[var(--color-muted)]" :
                    index === 2 ? "bg-amber-700/20 text-amber-300" :
                    "bg-[var(--color-bg-card)] text-[var(--color-muted)]"
                  }`}>
                    #{entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-cream)] truncate group-hover:text-[var(--color-gold)] transition-colors">{entry.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{entry.betsPlaced} bets · {entry.wins}W</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-[var(--color-gold-light)]">{formatNumber(entry.pointBalance)}</p>
                    <p className="text-xs text-[var(--color-muted)]">PTS</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}