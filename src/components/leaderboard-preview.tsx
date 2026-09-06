"use client";

import Link from "next/link";
import { db } from "@/lib/db";
import { getLeaderboard } from "@/lib/betting-service";
import { Card, Badge, formatNumber } from "@/components/ui";
import { Trophy, Flame, TrendingUp, Crown, Medal, ArrowRight } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  pointBalance: number;
  totalWagered: number;
  wins: number;
  betsPlaced: number;
  streak: number;
}

function LeaderboardRow({ entry, isTop3 = false }: { entry: LeaderboardEntry; isTop3?: boolean }) {
  const rankIcons = {
    1: <Crown className="w-6 h-6 text-[var(--color-gold)]" />,
    2: <Medal className="w-6 h-6 text-[var(--color-muted)]" />,
    3: <Trophy className="w-6 h-6 text-amber-700" />,
  };

  const streakIcon = entry.streak > 0 ? (
    <span className="flex items-center gap-1 text-[var(--color-gold)]">
      <Flame className="w-3.5 h-3.5" />
      <span className="font-mono font-bold">+{entry.streak}</span>
    </span>
  ) : entry.streak < 0 ? (
    <span className="flex items-center gap-1 text-[var(--color-crimson-light)]">
      <TrendingUp className="w-3.5 h-3.5 rotate-180" />
      <span className="font-mono font-bold">{entry.streak}</span>
    </span>
  ) : (
    <span className="text-[var(--color-muted)] font-mono">—</span>
  );

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
      isTop3
        ? "bg-gradient-to-r from-[var(--color-gold)]/5 to-transparent border border-[var(--color-gold)]/20"
        : "bg-[var(--color-bg-elevated)]/50 hover:bg-[var(--color-bg-card)] hover:border-[var(--color-card-border)] border border-transparent"
    }`}>
      <div className={`flex items-center justify-center w-12 font-display font-bold ${
        entry.rank <= 3 ? "text-[var(--color-gold)] text-xl" : "text-[var(--color-muted)] text-lg"
      }`}>
        {entry.rank <= 3 ? rankIcons[entry.rank as 1 | 2 | 3] : `#${entry.rank}`}
      </div>

      <Link
        href={`/profile/${entry.id}`}
        className="flex-1 min-w-0 group-hover:text-[var(--color-gold)] transition-colors"
      >
        <p className="font-semibold text-[var(--color-cream)] truncate">{entry.name}</p>
        <p className="text-xs text-[var(--color-muted)] flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {formatNumber(entry.betsPlaced)} bets
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {entry.wins} wins
          </span>
        </p>
      </Link>

      <div className="text-right flex-1">
        <p className="font-display font-bold text-[var(--color-gold-light)] text-lg">
          {formatNumber(entry.pointBalance)}
        </p>
        <p className="text-xs text-[var(--color-muted)]">PTS</p>
      </div>

      <div className="w-24 text-right">
        {streakIcon}
      </div>
    </div>
  );
}

export async function LeaderboardPreview() {
  const leaderboard = await getLeaderboard(10);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);

  return (
    <section id="leaderboard" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--color-crimson)]/5 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="text-center sm:text-left">
            <Badge variant="gold" size="lg" className="mb-4 inline-flex">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-cream)]">
              Top of the <span className="gold-gradient">Class</span>
            </h2>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-secondary text-sm font-medium self-center"
          >
            View Full Leaderboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Podium - Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {top3.map((entry, index) => {
            const podiumHeights = { 0: "h-48", 1: "h-40", 2: "h-32" };
            const podiumColors = {
              0: "from-[var(--color-gold)]/20 to-[var(--color-gold)]/5",
              1: "from-[var(--color-muted)]/20 to-[var(--color-muted)]/5",
              2: "from-amber-700/20 to-amber-700/5",
            };
            const borderColors = {
              0: "border-[var(--color-gold)]/50",
              1: "border-[var(--color-muted)]/30",
              2: "border-amber-700/30",
            };

            return (
              <div key={entry.id} className="relative group">
                <div className={`${podiumHeights[index as 0 | 1 | 2]} rounded-t-2xl bg-gradient-to-t ${podiumColors[index as 0 | 1 | 2]} border ${borderColors[index as 0 | 1 | 2]} flex items-end justify-center p-6 relative overflow-hidden`}>
                  {/* Glow effect for #1 */}
                  {index === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-gold)]/20 to-transparent animate-pulse-gold" />
                  )}

                  <div className="relative z-10 text-center w-full px-4">
                    <div className="mb-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        index === 0 ? "bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/30" :
                        index === 1 ? "bg-[var(--color-muted)]/20 text-[var(--color-muted)] border border-[var(--color-muted)]/30" :
                        "bg-amber-700/20 text-amber-300 border border-amber-700/30"
                      }`}>
                        #{entry.rank}
                      </span>
                    </div>
                    <Link href={`/profile/${entry.id}`} className="block">
                      <p className="font-display font-bold text-xl sm:text-2xl text-[var(--color-cream)] truncate group-hover:text-[var(--color-gold)] transition-colors">
                        {entry.name}
                      </p>
                    </Link>
                    <p className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-gold-light)] mt-1">
                      {formatNumber(entry.pointBalance)}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mt-1">PTS</p>
                  </div>
                </div>

                {/* Base of podium */}
                <div className={`h-8 rounded-b-2xl flex items-center justify-center ${
                  index === 0 ? "bg-[var(--color-gold)]/30" :
                  index === 1 ? "bg-[var(--color-muted)]/20" :
                  "bg-amber-700/20"
                }`}>
                  <span className="text-xs font-medium text-[var(--color-muted)]">
                    {entry.wins}W · {entry.betsPlaced}B
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest of top 10 */}
        <Card variant="glass" padding="lg">
          <div className="hidden md:grid grid-cols-12 gap-4 px-2 pb-2 text-xs font-medium text-[var(--color-muted)] border-b border-[var(--color-card-border)] mb-4">
            <div className="col-span-1 text-center">RANK</div>
            <div className="col-span-5">PLAYER</div>
            <div className="col-span-2 text-right">POINTS</div>
            <div className="col-span-2 text-center">STREAK</div>
            <div className="col-span-2 text-center">RECORD</div>
          </div>

          <div className="space-y-1">
            {rest.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))}
          </div>
        </Card>

        {/* Stat highlights */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Points in Play", value: leaderboard.reduce((a, b) => a + b.pointBalance, 0), icon: Trophy },
            { label: "Total Bets Placed", value: leaderboard.reduce((a, b) => a + b.betsPlaced, 0), icon: TrendingUp },
            { label: "Total Wagered", value: leaderboard.reduce((a, b) => a + b.totalWagered, 0), icon: Flame },
            { label: "Active Players", value: leaderboard.length, icon: Crown },
          ].map((stat) => (
            <Card key={stat.label} variant="default" padding="md" className="text-center group hover:border-[var(--color-gold)]/30">
              <stat.icon className="w-6 h-6 mx-auto text-[var(--color-gold)]/70 mb-2 group-hover:text-[var(--color-gold)] group-hover:scale-110 transition-all" />
              <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{formatNumber(stat.value)}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}