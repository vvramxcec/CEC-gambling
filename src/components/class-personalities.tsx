"use client";

import { Card, Badge, Button } from "@/components/ui";
import { Brain, Heart, Zap, TrendingUp, Shield, Smile, Ghost, ArrowRight } from "lucide-react";

const personalities = [
  {
    name: "The Analyst",
    emoji: "🧠",
    icon: Brain,
    tagline: "Spreadsheets > Gut Feelings",
    description: "Calculates EV before breakfast. Has a Notion database for every market. Wins quietly.",
    style: "Data-driven, patient, high EV hunter",
    badge: "Highest ROI",
    badgeVariant: "gold" as const,
    color: "from-[var(--color-gold)]/20 to-[var(--color-gold-dim)]/10",
    borderColor: "border-[var(--color-gold)]/30",
    stats: { winRate: "73%", avgBet: "247", biggestWin: "12.4k" },
  },
  {
    name: "The YOLO King",
    emoji: "🎲",
    icon: Zap,
    tagline: "ALL IN. Every. Single. Time.",
    description: "Sees a 5% edge and bets the farm. Legend says they once 50x'd on a longshot. Or went bust. Nobody knows.",
    style: "High variance, adrenaline junkie",
    badge: "Biggest Single Win",
    badgeVariant: "crimson" as const,
    color: "from-[var(--color-crimson)]/20 to-[var(--color-crimson-light)]/10",
    borderColor: "border-[var(--color-crimson)]/30",
    stats: { winRate: "31%", avgBet: "892", biggestWin: "47.8k" },
  },
  {
    name: "The Insider",
    emoji: "🤫",
    icon: Ghost,
    tagline: "I know a guy who knows a guy",
    description: "Always has the scoop before markets open. Professor's TA? Janitor's cousin? Their sources are classified.",
    style: "Information advantage, early mover",
    badge: "Best Timing",
    badgeVariant: "emerald" as const,
    color: "from-emerald-500/20 to-emerald-700/10",
    borderColor: "border-emerald-500/30",
    stats: { winRate: "68%", avgBet: "412", biggestWin: "28.1k" },
  },
  {
    name: "The Heart Better",
    emoji: "❤️",
    icon: Heart,
    tagline: "Loyalty pays... eventually",
    description: "Bets on their friends, their section, their TA. Loses points but gains karma. The class mascot.",
    style: "Emotional, loyal, community builder",
    badge: "Most Bets Placed",
    badgeVariant: "gold" as const,
    color: "from-rose-500/20 to-rose-700/10",
    borderColor: "border-rose-500/30",
    stats: { winRate: "42%", avgBet: "156", biggestWin: "8.3k" },
  },
  {
    name: "The Contrarian",
    emoji: "📉",
    icon: TrendingUp,
    tagline: "Public money is dumb money",
    description: "Fades the favorite every time. When the herd zigs, they zag. Slowly grinding up the leaderboard while everyone else busts.",
    style: "Contrarian, value hunter, disciplined",
    badge: "Longest Streak",
    badgeVariant: "emerald" as const,
    color: "from-sky-500/20 to-sky-700/10",
    borderColor: "border-sky-500/30",
    stats: { winRate: "58%", avgBet: "334", biggestWin: "19.7k" },
  },
  {
    name: "The Guardian",
    emoji: "🛡️",
    icon: Shield,
    tagline: "Protect the bankroll at all costs",
    description: "Never bets more than 5%. Kelly criterion tattooed on their soul. Boring? Yes. At the top? Always.",
    style: "Risk management, bankroll preservation",
    badge: "Most Consistent",
    badgeVariant: "muted" as const,
    color: "from-[var(--color-muted)]/20 to-transparent",
    borderColor: "border-[var(--color-muted)]/30",
    stats: { winRate: "54%", avgBet: "187", biggestWin: "15.2k" },
  },
];

export function ClassPersonalities() {
  return (
    <section id="personalities" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[var(--color-gold)]/5 via-transparent to-[var(--color-crimson)]/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="gold" size="lg" className="mb-4">
            <Smile className="w-4 h-4 mr-2" />
            Class Personalities
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-cream)] mb-4">
            Which <span className="gold-gradient">Bettor</span> Are You?
          </h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
            Every class has its characters. Meet the archetypes dominating the leaderboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalities.map((personality, index) => (
            <Card
              key={personality.name}
              variant="gradient"
              padding="lg"
              className={`relative overflow-hidden group ${personality.borderColor} bg-gradient-to-br ${personality.color} animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge variant={personality.badgeVariant} size="sm">
                  {personality.badge}
                </Badge>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-elevated)]/50 backdrop-blur flex items-center justify-center text-3xl">
                    {personality.emoji}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[var(--color-cream)]">{personality.name}</h3>
                    <p className="text-sm text-[var(--color-gold-light)] font-medium">{personality.tagline}</p>
                  </div>
                </div>

                <p className="text-[var(--color-muted)] text-sm mb-6 leading-relaxed">{personality.description}</p>

                <div className="mb-6 p-4 rounded-xl bg-[var(--color-bg-elevated)]/50">
                  <p className="text-xs text-[var(--color-muted)] mb-2">PLAYSTYLE</p>
                  <p className="text-sm text-[var(--color-cream)] font-medium">{personality.style}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-card-border)]">
                  {Object.entries(personality.stats).map(([label, value]) => (
                    <div key={label} className="text-center">
                      <p className="font-display font-bold text-xl text-[var(--color-cream)]">{value}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quiz CTA */}
        <div className="mt-16 text-center animate-fade-in">
          <Card variant="glass" padding="xl" className="max-w-2xl mx-auto">
            <p className="text-[var(--color-muted)] mb-4">Not sure which one you are?</p>
            <h3 className="font-display text-2xl font-bold text-[var(--color-cream)] mb-4">Take the 30-second quiz</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">Find your betting spirit animal and get personalized strategy tips.</p>
            <Button variant="gold-outline" size="lg" className="group">
              <Brain className="w-5 h-5" />
              Discover My Style
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}