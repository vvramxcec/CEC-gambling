"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, Textarea, Badge } from "@/components/ui";
import { Plus, X, Zap, Clock, AlertCircle, CheckCircle } from "lucide-react";

export function SuggestBetForm() {
  const router = useRouter();
  const [outcomes, setOutcomes] = useState(["", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateOutcome(index: number, value: string) {
    setOutcomes((current) => current.map((item, i) => (i === index ? value : item)));
  }

  function removeOutcome(index: number) {
    if (outcomes.length <= 2) return;
    setOutcomes((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const closesAtRaw = formData.get("closesAt") as string;

    const validOutcomes = outcomes.map((item) => item.trim()).filter(Boolean);
    if (validOutcomes.length < 2) {
      setError("Please provide at least 2 outcomes");
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      outcomes: validOutcomes,
      closesAt: closesAtRaw ? new Date(closesAtRaw).toISOString() : undefined,
    };

    const response = await fetch("/api/markets/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error?.formErrors?.[0] || "Could not submit suggestion");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }

  return (
    <div className="space-y-6">
      {success && (
        <Card variant="default" padding="lg" className="bg-[var(--color-emerald)]/10 border-[var(--color-emerald)]/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[var(--color-emerald)] flex-shrink-0" />
            <div>
              <p className="font-medium text-[var(--color-emerald)]">Submitted for approval!</p>
              <p className="text-sm text-[var(--color-muted)]">An admin will review your bet. You&apos;ll see it on the dashboard once approved.</p>
            </div>
          </div>
        </Card>
      )}

      <Card variant="gradient" padding="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Bet title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Will Raj show up early today?"
              className="mt-1"
            />
            <p className="text-xs text-[var(--color-muted)] mt-1">Make it specific, fun, and verifiable</p>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Bet closes at first bell. Admin resolves after attendance."
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Outcomes (2–4 options)</Label>
              <Badge variant="muted" size="sm">
                {outcomes.length}/4
              </Badge>
            </div>

            {outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="w-8 h-8 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-muted)] font-mono text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <Input
                  value={outcome}
                  onChange={(event) => updateOutcome(index, event.target.value)}
                  required
                  placeholder={index === 0 ? "&ldquo;Yes, before 9:00&rdquo;" : index === 1 ? "&ldquo;No, late as usual&rdquo;" : `Outcome ${index + 1}`}
                  className="flex-1"
                />
                {outcomes.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-crimson-light)] hover:bg-[var(--color-crimson)]/10 transition-colors"
                    aria-label="Remove outcome"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {outcomes.length < 4 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOutcomes((current) => [...current, ""])}
                className="w-full justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add outcome
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="closesAt">Close betting at (optional)</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
              <Input
                id="closesAt"
                name="closesAt"
                type="datetime-local"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-1">Leave empty to close manually or when admin locks</p>
          </div>

          {error && (
            <div className="rounded-xl bg-[var(--color-crimson)]/10 border border-[var(--color-crimson)]/20 px-4 py-3 text-sm text-[var(--color-crimson-light)] flex items-center gap-2 animate-slide-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 py-3 text-base" size="lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[var(--color-bg-deep)] border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Submit for approval
                </>
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()} className="px-6 py-3">
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Tips card */}
      <Card variant="default" padding="lg" className="border-[var(--color-gold)]/20">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-[var(--color-muted)]">
            <p className="font-medium text-[var(--color-cream)]">Tips for a great bet:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Be specific &mdash; &ldquo;Will Prof. Sharma cancel Friday lecture?&rdquo; beats &ldquo;Will class be cancelled?&rdquo;</li>
              <li>Set a clear resolution time &mdash; when will we know the answer?</li>
              <li>Outcomes should be mutually exclusive and cover all possibilities</li>
              <li>Inside jokes welcome &mdash; this is your class, after all</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}