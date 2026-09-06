import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { Card, Badge } from "@/components/ui";
import { Zap, Crown, Users, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-bg-deep)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[var(--color-gold)]/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-[var(--color-crimson)]/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md relative z-10">
          {/* Brand Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 mb-6">
              <Zap className="w-5 h-5 text-[var(--color-gold)]" />
              <span className="font-display font-bold text-[var(--color-gold)] text-sm">CLASSBET</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-[var(--color-cream)] mb-2">Welcome Back</h1>
            <p className="text-[var(--color-muted)]">Your seat at the table is waiting</p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Badge variant="gold" size="sm" className="gap-1">
              <Shield className="w-3 h-3" />
              Zero Risk
            </Badge>
            <Badge variant="muted" size="sm" className="gap-1">
              <Users className="w-3 h-3" />
              Invite Only
            </Badge>
            <Badge variant="muted" size="sm" className="gap-1">
              <Crown className="w-3 h-3" />
              Real Glory
            </Badge>
          </div>

          <Suspense fallback={
            <Card variant="gradient" padding="xl" className="text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
                <span className="text-[var(--color-muted)]">Loading...</span>
              </div>
            </Card>
          }>
            <AuthForm />
          </Suspense>

          {/* Footer note */}
          <p className="text-center text-xs text-[var(--color-muted)] mt-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Don&apos;t have an invite code? Ask your class admin or TA.
          </p>
        </div>
      </div>
    </div>
  );
}