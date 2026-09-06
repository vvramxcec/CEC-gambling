"use client";

import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { Target, Users, Zap, Calculator, Clock, Trophy, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Join the Class",
    description: "Get an invite code from your class admin. Sign up with your email and start with 1,000 free points.",
    icon: Users,
    details: [
      "Invite-only community",
      "1,000 starting points",
      "No real money ever",
    ],
  },
  {
    number: "02",
    title: "Browse Live Markets",
    description: "Check out open bets on the dashboard. See real-time pari-mutuel odds that update every 5 seconds.",
    icon: Target,
    details: [
      "Live odds updates",
      "Multiple outcomes per market",
      "See who's betting what",
    ],
  },
  {
    number: "03",
    title: "Place Your Bet",
    description: "Pick an outcome, choose your stake, and confirm. Quick-bet chips for 50, 100, 250, 500, or ALL IN.",
    icon: Zap,
    details: [
      "Instant confirmation",
      "Optimistic UI updates",
      "Balance protection",
    ],
  },
  {
    number: "04",
    title: "Watch Odds Shift",
    description: "As classmates bet, odds move in real-time. Early bets get better prices. Late money moves the line.",
    icon: Calculator,
    details: [
      "Pari-mutuel math",
      "No house edge",
      "True peer-to-peer odds",
    ],
  },
  {
    number: "05",
    title: "Market Resolves",
    description: "Admin locks betting and resolves the outcome. Winners split the total pool proportionally to their stake.",
    icon: Clock,
    details: [
      "Instant payouts",
      "Proportional splitting",
      "Full transaction history",
    ],
  },
  {
    number: "06",
    title: "Climb the Leaderboard",
    description: "Track your rank, win streak, and ROI. Earn bragging rights and unlock class personality badges.",
    icon: Trophy,
    details: [
      "Live rankings",
      "Streak tracking",
      "Personality profiles",
    ],
  },
];

const faqs = [
  {
    q: "Is this real money gambling?",
    a: "Absolutely not. CLASSBET uses points only — no cash deposits, no withdrawals, no house edge. It's purely for bragging rights and class fun.",
  },
  {
    q: "How are odds calculated?",
    a: "We use pari-mutuel (pool) betting. All stakes go into a pool. Winners split the pool proportionally. Odds = Total Pool / Winning Side Pool. No bookmaker margin.",
  },
  {
    q: "Can I lose all my points?",
    a: "Yes, points are real within the game. But admins can run events, give bonuses, or reset seasons. The goal is fun, not financial ruin.",
  },
  {
    q: "Who resolves markets?",
    a: "Class admins (your TA, professor, or elected student) resolve markets after the event occurs. They select the winning outcome and payouts are automatic.",
  },
  {
    q: "What if a market is voided?",
    a: "All stakes are refunded instantly. Voiding happens if an event is cancelled, ambiguous, or admin decides it's unfair.",
  },
  {
    q: "Can I suggest my own bets?",
    a: "Yes! Use 'Suggest Bet' to pitch a market. Admins review and approve. If approved, you get credit as the creator.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-[var(--color-gold)]/3 via-transparent to-[var(--color-crimson)]/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="gold" size="lg" className="mb-4">
            <Target className="w-4 h-4 mr-2" />
            How It Works
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-cream)] mb-4">
            From Zero to <span className="gold-gradient">Legend</span> in 6 Steps
          </h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-lg">
            No complicated rules. No hidden fees. Just pure skill and timing.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-20">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              variant={index % 2 === 0 ? "gradient" : "default"}
              padding="xl"
              className={`flex flex-col md:flex-row items-start md:items-center gap-8 group animate-slide-up ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-crimson)]/20 flex items-center justify-center text-2xl md:text-3xl">
                <step.icon className="w-8 h-8 text-[var(--color-gold)]" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display font-bold text-2xl text-[var(--color-gold)]">{step.number}</span>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-cream)]">{step.title}</h3>
                </div>
                <p className="text-[var(--color-muted)] mb-4 max-w-xl mx-auto md:mx-0">{step.description}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {step.details.map((detail, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--color-gold)]/70" />
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Math explanation */}
        <Card variant="gradient" padding="xl" className="mb-16 animate-fade-in">
          <div className="text-center mb-8">
            <Badge variant="gold" size="lg" className="mb-3">
              <Calculator className="w-4 h-4 mr-2" />
              The Math (It&apos;s Beautiful)
            </Badge>
            <h3 className="font-display text-2xl font-bold text-[var(--color-cream)]">
              Pari-Mutuel Formula
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-[var(--color-bg-elevated)]/50">
              <div className="font-mono text-4xl font-bold text-[var(--color-gold)] mb-2">Total Pool</div>
              <div className="text-[var(--color-muted)]">Sum of all bets on all outcomes</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-[var(--color-bg-elevated)]/50 relative flex items-center justify-center">
              <span className="text-4xl font-bold text-[var(--color-gold)]">÷</span>
            </div>
            <div className="text-center p-6 rounded-xl bg-[var(--color-bg-elevated)]/50">
              <div className="font-mono text-4xl font-bold text-[var(--color-gold)] mb-2">Winning Side Pool</div>
              <div className="text-[var(--color-muted)]">Total bets on the winning outcome</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="font-display text-xl font-bold text-[var(--color-cream)] mb-2">
              = Decimal Odds (e.g., 5.00x means 5× your stake back)
            </p>
            <p className="text-[var(--color-muted)]">
              Your Payout = Stake × (Total Pool / Winning Side Pool)
            </p>
          </div>

          <div className="mt-8 p-6 rounded-xl bg-[var(--color-bg-elevated)]/50 border border-[var(--color-gold)]/20">
            <p className="font-medium text-[var(--color-cream)] mb-2">Example:</p>
            <p className="text-[var(--color-muted)] text-sm">
              Pool: 1,000 pts | You bet 100 on Outcome A (200 pts total on A) | A wins
              <br />
              Payout = 100 × (1,000 / 200) = <span className="font-bold text-[var(--color-gold-light)]">500 pts</span> (your 100 + 400 profit)
            </p>
          </div>
        </Card>

        {/* FAQ */}
        <div className="animate-fade-in">
          <div className="text-center mb-10">
            <Badge variant="gold" size="lg" className="mb-3">
              <Zap className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h3 className="font-display text-2xl font-bold text-[var(--color-cream)]">
              Questions? We Got You.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={faq.q} variant="default" padding="lg" className="group hover:border-[var(--color-gold)]/30 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <h4 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] text-xs font-bold">{index + 1}</span>
                  {faq.q}
                </h4>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center animate-fade-in">
          <Card variant="glass" padding="xl" className="max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-[var(--color-cream)] mb-4">Ready to Play?</h3>
            <p className="text-[var(--color-muted)] mb-6">Join your class, grab your 1,000 starter points, and make your first prediction.</p>
            <Link href="/login?mode=signup">
              <Button size="xl" className="group min-w-[280px]">
                <Zap className="w-6 h-6" />
                Join CLASSBET Now
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
}

