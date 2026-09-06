"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Zap, ArrowRight, Users, Shield, Star, Target } from "lucide-react";

export function Hero() {
  const stats = [
    { value: "1,247", label: "Active Bettors" },
    { value: "89%", label: "Win Rate" },
    { value: "2.3M", label: "Points Wagered" },
    { value: "47", label: "Live Markets" },
  ];

  const features = [
    { icon: Zap, label: "Instant Payouts", desc: "Pari-mutuel math, zero house edge" },
    { icon: Users, label: "Class Only", desc: "Invite-code protected community" },
    { icon: Shield, label: "Points Only", desc: "Zero real money, pure bragging rights" },
    { icon: Target, label: "Live Odds", desc: "Real-time updates every 5 seconds" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[var(--color-gold)]/10 via-transparent to-[var(--color-crimson)]/10 blur-3xl animate-pulse-gold" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[var(--color-crimson)]/10 via-transparent to-[var(--color-gold)]/10 blur-3xl animate-pulse-gold" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[var(--color-gold)]/5 to-transparent blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-30" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,162,39,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,162,39,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Main hero content */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-elevated)]/80 backdrop-blur border border-[var(--color-gold)]/30 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-gold)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-gold)]" />
            </span>
            <span className="text-sm font-semibold text-[var(--color-gold)] tracking-wide uppercase">Live Now — Beta Season 3</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
            <span className="text-[var(--color-cream)]">Where </span>
            <span className="gold-gradient">Classroom</span>
            <span className="text-[var(--color-cream)]"> Meets </span>
            <span className="crimson-gradient">Casino</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-[var(--color-muted)] max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Bet points on class predictions. Pari-mutuel odds. Instant payouts. Zero house edge.
            <br />
            <span className="text-[var(--color-cream)]">Your classroom. Your casino. Your rules.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link href="/login?mode=signup">
              <Button size="xl" className="group min-w-[200px]">
                <Star className="w-5 h-5" aria-hidden="true" />
                <span>Join the Class</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="gold-outline" size="xl" className="min-w-[200px]">
                <span>Log In to Bet</span>
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-[var(--color-muted)] animate-fade-in" style={{ animationDelay: "300ms" }}>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[var(--color-gold)]" />
              No real money
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[var(--color-gold)]" />
              Invite only
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[var(--color-gold)]" />
              Instant settle
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative group card-base p-6 md:p-8 text-center hover:border-[var(--color-gold)]/50 transition-all duration-300"
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold gold-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--color-muted)] font-medium">{stat.label}</div>
              {/* Shimmer line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "600ms" }}>
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className="card-base p-6 group hover:border-[var(--color-gold)]/30 transition-all duration-300"
              style={{ animationDelay: `${700 + index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-crimson)]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[var(--color-gold)]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">{feature.label}</h3>
              <p className="text-sm text-[var(--color-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <div className="w-6 h-10 rounded-full border-2 border-[var(--color-muted)]/30 flex items-start justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-bounce" style={{ animationDelay: "0s", animationDuration: "1.5s" }} />
        </div>
      </div>
    </section>
  );
}