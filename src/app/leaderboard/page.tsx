import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, Badge, PageShell } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { getLeaderboard } from "@/lib/betting-service";
import { Trophy, Flame, TrendingUp, Crown, Medal, Users, Zap, Target, ArrowRight } from "lucide-react";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(50);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <AppLayout>
      <PageShell
        title="Leaderboard"
        subtitle="Class point standings — bragging rights only, no real money."
        action={
          <Link href="/dashboard" className="btn-secondary px-4 py-2 text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Live Bets
          </Link>
        }
      >
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="default" padding="md" className="text-center">
            <Trophy className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{leaderboard.length}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Active Players</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Zap className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {formatNumber(leaderboard.reduce((a, b) => a + b.totalWagered, 0))}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Wagered</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Target className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {formatNumber(leaderboard.reduce((a, b) => a + b.betsPlaced, 0))}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Bets Placed</p>
          </Card>
          <Card variant="default" padding="md" className="text-center">
            <Flame className="w-6 h-6 mx-auto text-[var(--color-gold)] mb-2" />
            <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
              {formatNumber(leaderboard.reduce((a, b) => a + b.wins, 0))}
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Total Wins</p>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {/* Podium - Top 3 */}
            <Card variant="gradient" padding="lg">
              <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-gold)]" />
                The Podium
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {top3.map((entry, index) => {
                  const podiumData = {
                    0: { height: "h-56 md:h-64", color: "from-[var(--color-gold)]/20 to-[var(--color-gold)]/5", border: "border-[var(--color-gold)]/50", icon: Crown, iconColor: "text-[var(--color-gold)]", badgeColor: "bg-[var(--color-gold)]/20 text-[var(--color-gold)] border-[var(--color-gold)]/30" },
                    1: { height: "h-48 md:h-52", color: "from-[var(--color-muted)]/20 to-[var(--color-muted)]/5", border: "border-[var(--color-muted)]/30", icon: Medal, iconColor: "text-[var(--color-muted)]", badgeColor: "bg-[var(--color-muted)]/20 text-[var(--color-muted)] border-[var(--color-muted)]/30" },
                    2: { height: "h-40 md:h-44", color: "from-amber-700/20 to-amber-700/5", border: "border-amber-700/30", icon: Trophy, iconColor: "text-amber-400", badgeColor: "bg-amber-700/20 text-amber-300 border-amber-700/30" },
                  };
                  const data = podiumData[index as 0 | 1 | 2];

                  return (
                    <div key={entry.id} className="relative group">
                      <div className={`${data.height} rounded-t-2xl bg-gradient-to-t ${data.color} border ${data.border} flex items-end justify-center p-6 relative overflow-hidden`}>
                        {index === 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-gold)]/20 to-transparent animate-pulse-gold" />
                        )}

                        <div className="relative z-10 text-center w-full px-4">
                          <div className="mb-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${data.badgeColor}`}>
                              #{entry.rank}
                            </span>
                          </div>
                          <Link href={`/profile/${entry.id}`} className="block">
                            <p className="font-display font-bold text-xl md:text-2xl text-[var(--color-cream)] truncate group-hover:text-[var(--color-gold)] transition-colors">
                              {entry.name}
                            </p>
                          </Link>
                          <p className="font-display font-bold text-3xl md:text-4xl text-[var(--color-gold-light)] mt-1">
                            {formatNumber(entry.pointBalance)}
                          </p>
                          <p className="text-xs text-[var(--color-muted)] mt-1">PTS</p>
                        </div>
                      </div>

                      <div className={`h-10 rounded-b-2xl flex items-center justify-center gap-4 text-xs ${
                        index === 0 ? "bg-[var(--color-gold)]/30" :
                        index === 1 ? "bg-[var(--color-muted)]/20" :
                        "bg-amber-700/20"
                      }`}>
                        <span className="flex items-center gap-1 text-[var(--color-muted)]">
                          <TrendingUp className="w-3 h-3" />
                          {formatNumber(entry.betsPlaced)} bets
                        </span>
                        <span className="flex items-center gap-1 text-[var(--color-gold)]">
                          <Trophy className="w-3 h-3" />
                          {entry.wins} wins
                        </span>
                        <span className={entry.streak > 0 ? "text-[var(--color-gold)]" : entry.streak < 0 ? "text-[var(--color-crimson-light)]" : "text-[var(--color-muted)]"}>
                          {entry.streak > 0 && <Flame className="w-3 h-3 mr-1" />}
                          {entry.streak !== 0 ? (entry.streak > 0 ? `+${entry.streak}` : entry.streak) : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Full Leaderboard Table */}
            <Card variant="glass" padding="lg">
              <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-gold)]" />
                Full Standings
              </h2>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-card-border)] text-[var(--color-muted)] font-medium">
                      <th className="px-4 py-4">RANK</th>
                      <th className="px-4 py-4">PLAYER</th>
                      <th className="px-4 py-4 text-right">POINTS</th>
                      <th className="px-4 py-4 text-center">BETS</th>
                      <th className="px-4 py-4 text-center">WINS</th>
                      <th className="px-4 py-4 text-center">WAGERED</th>
                      <th className="px-4 py-4 text-center">STREAK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-[var(--color-card-border)]/50 hover:bg-[var(--color-bg-elevated)]/50 transition-colors"
                      >
                        <td className="px-4 py-4 font-display font-bold text-[var(--color-muted)]">#{entry.rank}</td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/profile/${entry.id}`}
                            className="font-medium text-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors"
                          >
                            {entry.name}
                          </Link>
                        </td>
                        <td className="px-4 py-4 font-display font-bold text-[var(--color-gold-light)] text-right">
                          {formatNumber(entry.pointBalance)}
                        </td>
                        <td className="px-4 py-4 text-center text-[var(--color-muted)]">{entry.betsPlaced}</td>
                        <td className="px-4 py-4 text-center text-[var(--color-muted)]">{entry.wins}</td>
                        <td className="px-4 py-4 text-center text-[var(--color-muted)] font-mono">
                          {formatNumber(entry.totalWagered)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {entry.streak > 0 && (
                            <Badge variant="emerald" size="sm">
                              <Flame className="w-3 h-3 mr-1" />
                              +{entry.streak}
                            </Badge>
                          )}
                          {entry.streak < 0 && (
                            <Badge variant="crimson" size="sm">
                              <TrendingUp className="w-3 h-3 rotate-180 mr-1" />
                              {entry.streak}
                            </Badge>
                          )}
                          {entry.streak === 0 && <span className="text-[var(--color-muted)]">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {rest.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/profile/${entry.id}`}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)] transition-all"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl font-display font-bold bg-[var(--color-bg-card)] text-[var(--color-muted)]">
                      #{entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-cream)] truncate group-hover:text-[var(--color-gold)] transition-colors">{entry.name}</p>
                      <p className="text-xs text-[var(--color-muted)] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {entry.betsPlaced} bets
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {entry.wins} wins
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-[var(--color-gold-light)]">{formatNumber(entry.pointBalance)}</p>
                      <p className="text-xs text-[var(--color-muted)]">PTS</p>
                    </div>
                    <div className="w-24 text-right">
                      {entry.streak > 0 && (
                        <Badge variant="emerald" size="sm">
                          <Flame className="w-3 h-3 mr-1" />
                          +{entry.streak}
                        </Badge>
                      )}
                      {entry.streak < 0 && (
                        <Badge variant="crimson" size="sm">
                          <TrendingUp className="w-3 h-3 rotate-180 mr-1" />
                          {entry.streak}
                        </Badge>
                      )}
                      {entry.streak === 0 && <span className="text-[var(--color-muted)] text-sm">—</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Top Player Profile */}
          <div className="space-y-6">
            {leaderboard[0] && (
              <Card variant="gradient" padding="lg" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--color-gold)]/20 to-transparent rounded-bl-3xl" />
                <div className="relative z-10 text-center">
                  <Badge variant="gold" size="md" className="mb-4 inline-flex">
                    <Crown className="w-4 h-4 mr-2" />
                    CLASS CHAMPION
                  </Badge>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-cream)] mb-2">{leaderboard[0].name}</h3>
                  <p className="font-display font-bold text-4xl text-[var(--color-gold-light)] mb-2">{formatNumber(leaderboard[0].pointBalance)} PTS</p>
                  <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-muted)] mb-4">
                    <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> {leaderboard[0].betsPlaced} bets</span>
                    <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {leaderboard[0].wins} wins</span>
                    <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> {leaderboard[0].streak > 0 ? `+${leaderboard[0].streak}` : leaderboard[0].streak}</span>
                  </div>
                  <Link href={`/profile/${leaderboard[0].id}`} className="btn-secondary inline-flex items-center gap-2">
                    View Profile
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            )}

            {/* Your Rank (placeholder for logged in user) */}
            <Card variant="default" padding="lg" className="text-center">
              <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-4">Your Standing</h3>
              <p className="text-[var(--color-muted)] mb-4">Log in to see your rank, streak, and personalized stats.</p>
              <Link href="/login">
                <span className="btn-primary inline-flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Log In to View
                </span>
              </Link>
            </Card>

            {/* Achievements Preview */}
            <Card variant="default" padding="lg">
              <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[var(--color-gold)]" />
                Achievements
              </h3>
              <div className="space-y-3">
                {[
                  { name: "First Blood", desc: "Place your first bet", icon: Zap, earned: false },
                  { name: "Hot Streak", desc: "Win 5 bets in a row", icon: Flame, earned: false },
                  { name: "High Roller", desc: "Wager 10,000+ points total", icon: Target, earned: false },
                  { name: "Contrarian", desc: "Win as the underdog (5x+ odds)", icon: Trophy, earned: false },
                  { name: "Market Maker", desc: "Create an approved market", icon: Users, earned: false },
                  { name: "Legend", desc: "Reach #1 on leaderboard", icon: Crown, earned: false },
                ].map((achievement) => (
                  <div key={achievement.name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-elevated)]/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${achievement.earned ? "bg-[var(--color-gold)]/20" : "bg-[var(--color-bg-card)]"}`}>
                      <achievement.icon className={`w-5 h-5 ${achievement.earned ? "text-[var(--color-gold)]" : "text-[var(--color-muted)]"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${achievement.earned ? "text-[var(--color-cream)]" : "text-[var(--color-muted)]"}`}>{achievement.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">{achievement.desc}</p>
                    </div>
                    {achievement.earned && <Badge variant="emerald" size="sm">UNLOCKED</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageShell>
    </AppLayout>
  );
}