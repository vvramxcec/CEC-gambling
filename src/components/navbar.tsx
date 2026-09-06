"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logout } from "@/lib/actions";
import { Button } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { Trophy, Settings, LogOut, Menu, X, Star, Zap } from "lucide-react";

interface NavbarProps {
  user?: {
    id: string;
    name: string | null | undefined;
    pointBalance: number;
    role: string;
  } | null;
  isLandingPage?: boolean;
}

export function Navbar({ user, isLandingPage = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Live Bets", icon: Zap },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/suggest", label: "Suggest Bet", icon: Settings },
  ];

  if (!user) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || !isLandingPage ? "bg-[var(--color-bg-elevated)]/95 backdrop-blur-xl border-b border-[var(--color-card-border)]" : "bg-transparent"
      }`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="CLASSBET Home">
              <span className="font-display text-xl font-bold gold-gradient">CLASSBET</span>
              <span className="hidden sm:inline-block w-px h-6 bg-gradient-to-t from-[var(--color-gold)] to-transparent" />
              <span className="hidden sm:inline text-xs font-semibold text-[var(--color-gold)] tracking-widest uppercase">β</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {isLandingPage && (
                <>
                  <a href="#live-bets" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-cream)] transition-colors">Live Bets</a>
                  <a href="#leaderboard" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-cream)] transition-colors">Leaderboard</a>
                  <a href="#how-it-works" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-cream)] transition-colors">How It Works</a>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/login?mode=signup">
                <Button size="sm">Join Class</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? "bg-[var(--color-bg-elevated)]/95 backdrop-blur-xl border-b border-[var(--color-card-border)]" : "bg-transparent"
    }`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="CLASSBET Dashboard">
            <span className="font-display text-xl font-bold gold-gradient">CLASSBET</span>
            <span className="hidden sm:inline-block w-px h-6 bg-gradient-to-t from-[var(--color-gold)] to-transparent" />
            <span className="hidden sm:inline text-xs font-semibold text-[var(--color-gold)] tracking-widest uppercase">β</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-cream)] hover:bg-[var(--color-bg-card)] transition-all duration-200"
              >
                <link.icon className="w-4 h-4" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            ))}
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] hover:bg-[rgba(201,162,39,0.1)] transition-all duration-200"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)]/10 to-[var(--color-crimson)]/10 border border-[var(--color-gold)]/20">
              <Star className="w-4 h-4 text-[var(--color-gold)]" aria-hidden="true" />
              <span className="font-mono font-semibold text-[var(--color-gold-light)]">{formatNumber(user.pointBalance)}</span>
              <span className="text-xs text-[var(--color-muted)]">PTS</span>
            </div>

            <Link
              href={`/profile/${user.id}`}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-card-border)] text-sm font-medium text-[var(--color-cream)] hover:border-[var(--color-gold)]/50 transition-all"
            >
              <span>{user.name}</span>
            </Link>

            <form action={logout}>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-1" />
                <span>Log Out</span>
              </Button>
            </form>

            <button
              className="md:hidden p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-cream)] hover:bg-[var(--color-bg-card)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden animate-slide-up border-t border-[var(--color-card-border)] bg-[var(--color-bg-elevated)]">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-cream)] hover:bg-[var(--color-bg-card)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-gold)] hover:text-[var(--color-gold-light)] hover:bg-[rgba(201,162,39,0.1)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
              <div className="pt-2 border-t border-[var(--color-card-border)] flex items-center gap-3 px-3 py-2.5">
                <Star className="w-5 h-5 text-[var(--color-gold)]" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[var(--color-muted)]">BALANCE</p>
                  <p className="font-mono font-semibold text-[var(--color-gold-light)]">{formatNumber(user.pointBalance)} PTS</p>
                </div>
              </div>
              <form action={logout}>
                <Button variant="secondary" className="w-full justify-start" type="submit">
                  <LogOut className="w-5 h-5 mr-2" />
                  Log Out
                </Button>
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}