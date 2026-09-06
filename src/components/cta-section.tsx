"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { Zap, ArrowRight, Shield, Users, Star, Trophy } from "lucide-react";

export function CTASection() {
  const features = [
    { icon: Zap, title: "Instant Action", desc: "Bet in seconds, watch odds move live" },
    { icon: Shield, title: "Zero Risk", desc: "Points only — no real money ever" },
    { icon: Users, title: "Your Class", desc: "Invite-only, inside jokes included" },
    { icon: Trophy, title: "Real Glory", desc: "Leaderboard, streaks, hall of fame" },
  ];

  return (
    <section className="py-20 sm:py-28 lg:py-32 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-deep)] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--color-gold)]/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <Card variant="gradient" padding="xl" className="relative overflow-hidden group max-w-4xl mx-auto mb-16">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)]/5 via-transparent to-[var(--color-crimson)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

          <div className="relative z-10 text-center">
            <Badge variant="gold" size="lg" className="mb-6 inline-flex">
              <Star className="w-4 h-4 mr-2" />
              Ready to Play?
            </Badge>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-cream)] mb-6 leading-tight">
              Your Seat at the <span className="gold-gradient">Table</span> Awaits
            </h2>

            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
              1,000 free points. Zero deposit. Pure skill. Join hundreds of classmates already betting on the action.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/login?mode=signup">
                <Button size="xl" className="group min-w-[220px]">
                  <Zap className="w-5 h-5" />
                  Join CLASSBET
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="gold-outline" size="xl" className="min-w-[220px]">
                  Already Have a Code? Log In
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[var(--color-gold)]" />
                No Real Money
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[var(--color-gold)]" />
                Invite Only
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[var(--color-gold)]" />
                1,000 Free Points
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[var(--color-gold)]" />
                Instant Payouts
              </span>
            </div>
          </div>
        </Card>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="default"
              padding="lg"
              className="text-center group hover:border-[var(--color-gold)]/30 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-crimson)]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[var(--color-gold)]" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{feature.desc}</p>
            </Card>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center animate-fade-in">
          <p className="text-[var(--color-muted)] mb-4">Questions? Need an invite code?</p>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            Ask your class admin or TA for the invite code. Then click &ldquo;Join Class&rdquo; above.
          </p>
          <Link href="/login?mode=signup">
            <Button variant="gold-outline" size="lg" className="group">
              <Zap className="w-5 h-5" />
              Get Started &mdash; It&apos;s Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}