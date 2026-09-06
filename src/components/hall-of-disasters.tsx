"use client";

import { Card, Badge } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { Skull, Flame, TrendingDown, AlertTriangle, Crown, Zap } from "lucide-react";

const disasters = [
  {
    id: "1",
    title: "The Great Friday Flop",
    market: "Will Prof. Sharma cancel Friday lecture?",
    outcome: "YES — 94% probability",
    result: "NO — Class happened",
    totalPool: 18470,
    winningPool: 1120,
    biggestLoser: "Arjun",
    biggestLoss: 4200,
    payout: "16.5x for the 6 believers",
    date: "2025-11-14",
    tag: "UPSET",
    tagVariant: "crimson" as const,
  },
  {
    id: "2",
    title: "Raj's Redemption Arc",
    market: "Will Raj show up before 9 AM?",
    outcome: "NO — Late as usual (87%)",
    result: "YES — 8:47 AM entry",
    totalPool: 12890,
    winningPool: 890,
    biggestLoser: "Priya",
    biggestLoss: 3100,
    payout: "14.5x for early birds",
    date: "2025-10-28",
    tag: "MIRACLE",
    tagVariant: "gold" as const,
  },
  {
    id: "3",
    title: "The Midterm Massacre",
    market: "Class average > 75% on Midterm 2?",
    outcome: "YES — We studied (72%)",
    result: "NO — 61.3% average",
    totalPool: 24560,
    winningPool: 2100,
    biggestLoser: "The Analyst",
    biggestLoss: 5600,
    payout: "11.7x for the cynics",
    date: "2025-10-15",
    tag: "BLOODBATH",
    tagVariant: "crimson" as const,
  },
  {
    id: "4",
    title: "Pizza Party Payday",
    market: "Will TA bring snacks to review session?",
    outcome: "NO — Never happens (91%)",
    result: "YES — Domino's arrived",
    totalPool: 8720,
    winningPool: 340,
    biggestLoser: "Skeptic",
    biggestLoss: 1800,
    payout: "25.6x — Highest multiplier ever",
    date: "2025-11-03",
    tag: "JACKPOT",
    tagVariant: "gold" as const,
  },
  {
    id: "5",
    title: "The Group Project Ghost",
    market: "Will all 5 members submit on time?",
    outcome: "YES — We're responsible (68%)",
    result: "NO — 2 ghosts, 3 submissions",
    totalPool: 15340,
    winningPool: 4200,
    biggestLoser: "Optimist",
    biggestLoss: 2900,
    payout: "3.7x for the realists",
    date: "2025-11-22",
    tag: "BETRAYAL",
    tagVariant: "crimson" as const,
  },
  {
    id: "6",
    title: "Final Exam Curve Miracle",
    market: "Will final be curved > 10 points?",
    outcome: "NO — Prof doesn't curve (83%)",
    result: "YES — 14 point curve",
    totalPool: 31200,
    winningPool: 1890,
    biggestLoser: "The Guardian",
    biggestLoss: 6800,
    payout: "16.5x — Season's largest pool",
    date: "2025-12-10",
    tag: "LEGENDARY",
    tagVariant: "gold" as const,
  },
];

export function HallOfDisasters() {
  return (
    <section id="hall-of-disasters" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-[var(--color-crimson)]/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[var(--color-gold)]/5 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Skull className="w-8 h-8 text-[var(--color-crimson)]" />
            <Badge variant="crimson" size="lg">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Hall of Disasters
            </Badge>
            <Skull className="w-8 h-8 text-[var(--color-crimson)] rotate-180" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-cream)] mb-4">
            Where Favorites <span className="crimson-gradient">Go to Die</span>
          </h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
            The upsets, the miracles, the bad beats that built legends. Study the fallen.
          </p>
        </div>

        {/* Disaster cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {disasters.map((disaster, index) => (
            <Card
              key={disaster.id}
              variant="gradient"
              padding="lg"
              className="relative overflow-hidden group animate-slide-up hover:border-[var(--color-crimson)]/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-4 right-4">
                <Badge variant={disaster.tagVariant} size="sm">
                  {disaster.tag}
                </Badge>
              </div>

              <div className="relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-crimson)]/20 flex items-center justify-center flex-shrink-0">
                    <Skull className="w-6 h-6 text-[var(--color-crimson-light)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-[var(--color-cream)] mb-1">{disaster.title}</h3>
                    <p className="text-xs text-[var(--color-muted)] font-mono">{new Date(disaster.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Market</span>
                    <span className="text-[var(--color-cream)] truncate max-w-[200px]">{disaster.market}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Consensus</span>
                    <span className="text-[var(--color-gold)] font-mono">{disaster.outcome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Reality</span>
                    <span className="text-[var(--color-crimson-light)] font-mono">{disaster.result}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-bg-elevated)]/50 border border-[var(--color-card-border)] mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-display font-bold text-xl text-[var(--color-gold-light)]">{formatNumber(disaster.totalPool)}</p>
                      <p className="text-xs text-[var(--color-muted)]">Total Pool</p>
                    </div>
                    <div className="border-l border-[var(--color-card-border)] border-r border-[var(--color-card-border)]">
                      <p className="font-display font-bold text-xl text-[var(--color-crimson-light)]">{formatNumber(disaster.winningPool)}</p>
                      <p className="text-xs text-[var(--color-muted)]">Winning Side</p>
                    </div>
                    <div>
                      <p className="font-display font-bold text-xl text-[var(--color-cream)]">{disaster.payout.split('x')[0]}x</p>
                      <p className="text-xs text-[var(--color-muted)]">Multiplier</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-card-border)]">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[var(--color-crimson)]" />
                    <span className="text-xs text-[var(--color-muted)]">Biggest victim:</span>
                    <span className="font-mono font-bold text-[var(--color-cream)]">{disaster.biggestLoser}</span>
                    <span className="text-[var(--color-crimson-light)] font-mono">−{formatNumber(disaster.biggestLoss)}</span>
                  </div>
                  <Zap className="w-5 h-5 text-[var(--color-gold)]/50 group-hover:text-[var(--color-gold)] transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Total Points Lost", value: disasters.reduce((a, b) => a + b.biggestLoss, 0), icon: TrendingDown, color: "crimson" },
            { label: "Largest Single Pool", value: Math.max(...disasters.map(d => d.totalPool)), icon: Crown, color: "gold" },
            { label: "Highest Multiplier", value: "25.6x", icon: Zap, color: "gold" },
            { label: "Upsets Recorded", value: disasters.length, icon: Skull, color: "crimson" },
          ].map((stat) => (
            <Card key={stat.label} variant="default" padding="md" className="text-center group hover:border-[var(--color-gold)]/30">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color === "gold" ? "text-[var(--color-gold)]" : "text-[var(--color-crimson)]"}`} />
              <p className="font-display font-bold text-2xl text-[var(--color-cream)]">{formatNumber(typeof stat.value === "number" ? stat.value : 0)}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Lesson box */}
        <Card variant="glass" padding="xl" className="max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-[var(--color-gold)]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[var(--color-cream)] mb-2">The Lesson</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                In pari-mutuel betting, the crowd is often wrong. The biggest payouts come from fading consensus.
                But remember: the contrarian only wins when they&apos;re right. Blindly fading is just another way to lose.
                <br /><br />
                <span className="font-medium text-[var(--color-gold)]">Respect the math. Trust your edge. Bet responsibly.</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}