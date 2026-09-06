"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";
import { Zap, Crown, Shield, Mail, Lock, User, Key } from "lucide-react";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: (formData.get("name") as string) || "",
      inviteCode: (formData.get("inviteCode") as string) || "",
      mode,
    };

    const result = await signIn("credentials", payload, { redirect: false });

    setLoading(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((result as any)?.error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((result as any).error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card variant="gradient" padding="xl" className="relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/5 via-transparent to-[var(--color-crimson)]/5" />

      {/* Mode tabs */}
      <div className="relative z-10 mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            mode === "login"
              ? "bg-[var(--color-gold)] text-[var(--color-bg-deep)] shadow-[var(--shadow-gold)]"
              : "bg-[var(--color-bg-elevated)]/50 text-[var(--color-muted)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-cream)]"
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            mode === "signup"
              ? "bg-[var(--color-gold)] text-[var(--color-bg-deep)] shadow-[var(--shadow-gold)]"
              : "bg-[var(--color-bg-elevated)]/50 text-[var(--color-muted)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-cream)]"
          }`}
        >
          <Crown className="w-4 h-4 inline mr-2" />
          Join class
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        {mode === "signup" && (
          <>
            <div>
              <Label htmlFor="name">Display name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                <Input
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={40}
                  placeholder="Your class name"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inviteCode">Class invite code</Label>
              <div className="relative mt-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
                <Input
                  id="inviteCode"
                  name="inviteCode"
                  required
                  placeholder="ABC123"
                  className="pl-10 uppercase tracking-wider"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@college.edu"
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="pl-10"
            />
          </div>
        </div>
        {error && (
          <div className="rounded-xl bg-[var(--color-crimson)]/10 border border-[var(--color-crimson)]/20 px-4 py-3 text-sm text-[var(--color-crimson-light)] flex items-center gap-2 animate-slide-up">
            <Shield className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
        <Button type="submit" className="w-full py-3 text-base" disabled={loading} size="lg">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[var(--color-bg-deep)] border-t-transparent rounded-full animate-spin" />
              Please wait...
            </span>
          ) : mode === "login" ? (
            "Log in"
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Bottom trust note */}
      <div className="relative z-10 mt-8 pt-6 border-t border-[var(--color-card-border)] text-center">
        <p className="text-xs text-[var(--color-muted)] flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[var(--color-gold)]" />
          No real money — just points and bragging rights
        </p>
      </div>
    </Card>
  );
}