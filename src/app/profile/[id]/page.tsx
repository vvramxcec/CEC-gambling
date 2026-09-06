import Link from "next/link";
import { notFound } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { Badge, Card, PageShell, formatNumber, statusTone } from "@/components/ui";
import { db } from "@/lib/db";
import { TrendingUp, Trophy, Zap, Clock, ArrowRight, Medal } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({
  params,
}: PageProps<"/profile/[id]">) {
  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      ledger: {
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { market: { select: { id: true, title: true } } },
      },
      wagers: {
        orderBy: { createdAt: "desc" },
        take: 15,
        include: {
          market: { select: { id: true, title: true, status: true } },
          outcome: { select: { label: true } },
        },
      },
    },
  });

  if (!user) notFound();

  // Calculate stats
  const totalWagered = user.ledger.filter(l => l.delta < 0).reduce((a, b) => a + Math.abs(b.delta), 0);
  const totalWon = user.ledger.filter(l => l.delta > 0).reduce((a, b) => a + b.delta, 0);
  const winRate = user.wagers.length > 0 ? Math.round((user.wagers.filter(w => w.market.status === "RESOLVED" && w.outcome.label === w.outcome.label).length / user.wagers.length) * 100) : 0;

  return (
    <AppLayout>
      <PageShell
        title={user.name}
        subtitle={`Member since ${user.createdAt.toLocaleDateString()}`}
        action={
          <Link href="/leaderboard" className="btn-secondary px-4 py-2 text-sm font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </Link>
        }
      >
        {/* Profile Header Card */}
        <Card variant="gradient" padding="xl" className="relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[var(--color-gold)]/20 to-transparent rounded-bl-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-gold)]/30 to-[var(--color-crimson)]/30 flex items-center justify-center border border-[var(--color-gold)]/30">
                <span className="font-display font-bold text-3xl text-[var(--color-cream)]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-cream)]">{user.name}</h2>
                <p className="text-[var(--color-muted)] mt-1">Player ID: {user.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="flex flex-col items-end md:items-end gap-3">
              <div className="text-right">
                <p className="font-display font-bold text-3xl md:text-4xl text-[var(--color-gold-light)]">
                  {formatNumber(user.pointBalance)}
                </p>
                <p className="text-xs text-[var(--color-muted)]">CURRENT BALANCE</p>
              </div>
              <Badge variant="gold" size="md" className="gap-1">
                <Trophy className="w-3 h-3" />
                Rank #{user.id.slice(0, 3)} {/* Placeholder - would need actual rank */}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="default" padding="md" className="text-center">
            <Zap className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{user.wagers.length}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Bets</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{formatNumber(totalWagered)}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Wagered</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Trophy className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{formatNumber(totalWon)}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Won</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Medal className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{winRate}%</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Win Rate</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Bets */}
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold text-[var(--color-cream)] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[var(--color-gold)]" />
                Recent Bets
              </h2>
              <Link href="/dashboard" className="text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] flex items-center gap-1">
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {user.wagers.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 mx-auto text-[var(--color-muted)]/50 mb-4" />
                <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">No bets yet</h3>
                <p className="text-[var(--color-muted)] mb-6">Place your first bet and join the action!</p>
                <Link href="/dashboard">
                  <span className="inline-flex items-center gap-2 text-[var(--color-gold)] font-medium hover:text-[var(--color-gold-light)] transition-colors">
                    Browse Markets
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {user.wagers.map((wager) => (
                  <li
                    key={wager.id}
                    className="group flex items-start justify-between gap-4 p-4 rounded-xl bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/markets/${wager.market.id}`}
                        className="font-medium text-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors truncate block"
                      >
                        {wager.market.title}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--color-muted)] flex items-center gap-2">
                        <span className="font-mono text-[var(--color-gold-light)]">{formatNumber(wager.amount)} pts</span>
                        <span className="text-[var(--color-card-border)]">·</span>
                        <span>{wager.outcome.label}</span>
                        <Badge
                          key={wager.market.status}
                          variant={statusTone(wager.market.status)}
                          size="xs"
                        >
                          {wager.market.status}
                        </Badge>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-bold text-[var(--color-gold-light)]">
                        {wager.payout ? `+${formatNumber(wager.payout)}` : "—"}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">Potential</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Point History */}
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold text-[var(--color-cream)] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--color-gold)]" />
                Point History
              </h2>
            </div>

            {user.ledger.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-[var(--color-muted)]/50 mb-4" />
                <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">No history yet</h3>
                <p className="text-[var(--color-muted)]">Your point transactions will appear here</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {user.ledger.map((entry) => (
                  <li
                    key={entry.id}
                    className="group flex items-center justify-between gap-4 p-3 rounded-xl bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)] transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-cream)] truncate">{entry.reason}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate">
                        {entry.market?.title ?? entry.note ?? entry.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <span className={`font-mono font-medium text-sm flex-shrink-0 ${
                      entry.delta >= 0 ? "text-[var(--color-emerald)]" : "text-[var(--color-crimson-light)]"
                    }`}>
                      {entry.delta >= 0 ? "+" : ""}{formatNumber(entry.delta)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}