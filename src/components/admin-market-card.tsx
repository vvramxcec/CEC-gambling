"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Badge, Select, Input } from "@/components/ui";
import { CheckCircle, XCircle, Lock, Gavel, Check, X, Loader2 } from "lucide-react";

type AdminMarketCardProps = {
  market: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    outcomes: { id: string; label: string }[];
    createdBy: { name: string };
  };
};

const statusConfig = {
  PENDING: { icon: AlertCircle, color: "text-[var(--color-gold)]", bg: "bg-[var(--color-gold)]/10", label: "PENDING" },
  OPEN: { icon: CheckCircle, color: "text-[var(--color-emerald)]", bg: "bg-[var(--color-emerald)]/10", label: "OPEN" },
  LOCKED: { icon: Lock, color: "text-[var(--color-muted)]", bg: "bg-[var(--color-muted)]/10", label: "LOCKED" },
  RESOLVED: { icon: Gavel, color: "text-[var(--color-gold)]", bg: "bg-[var(--color-gold)]/10", label: "RESOLVED" },
  VOIDED: { icon: XCircle, color: "text-[var(--color-crimson)]", bg: "bg-[var(--color-crimson)]/10", label: "VOIDED" },
};

export function AdminMarketCard({ market }: AdminMarketCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState(market.outcomes[0]?.id ?? "");
  const [rejectReason, setRejectReason] = useState("");

  const config = statusConfig[market.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  async function runAction(action: string, body?: Record<string, unknown>) {
    setLoading(action);

    let url = `/api/markets/${market.id}/wager`;
    let method = "PATCH";

    if (action === "approve") {
      url = `/api/markets/${market.id}/approve`;
      method = "POST";
    } else if (action === "reject") {
      url = `/api/markets/${market.id}/reject`;
      method = "POST";
    } else {
      body = { action, ...body };
    }

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    setLoading(null);
    router.refresh();
  }

  return (
    <Card variant="gradient" padding="lg" className="relative">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-[var(--color-cream)] mb-1">{market.title}</h3>
              <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
                  Suggested by {market.createdBy.name}
                </span>
                <Badge
                  variant={market.status === "PENDING" ? "gold" : market.status === "OPEN" ? "emerald" : market.status === "LOCKED" ? "muted" : "crimson"}
                  size="sm"
                  className={`flex items-center gap-1 ${config.bg} ${config.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </Badge>
              </div>
            </div>
          </div>

          {market.description && (
            <p className="text-sm text-[var(--color-muted)] mb-4 line-clamp-2">{market.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {market.outcomes.map((outcome) => (
              <Badge key={outcome.id} variant="muted" size="sm" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-gold)]/50" />
                {outcome.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[240px] lg:w-auto">
          {market.status === "PENDING" && (
            <>
              <Button
                disabled={loading !== null}
                onClick={() => runAction("approve")}
                className="w-full justify-center gap-2"
              >
                {loading === "approve" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Approve
                  </>
                )}
              </Button>

              <Input
                placeholder="Reject reason (optional)"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="w-full"
              />

              <Button
                variant="danger"
                disabled={loading !== null}
                onClick={() => runAction("reject", { reason: rejectReason })}
                className="w-full justify-center gap-2"
              >
                {loading === "reject" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Reject
                  </>
                )}
              </Button>
            </>
          )}

          {(market.status === "OPEN" || market.status === "LOCKED") && (
            <>
              {market.status === "OPEN" && (
                <Button
                  variant="secondary"
                  disabled={loading !== null}
                  onClick={() => runAction("lock")}
                  className="w-full justify-center gap-2"
                >
                  {loading === "lock" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Locking...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Lock betting
                    </>
                  )}
                </Button>
              )}

              <Select
                value={selectedOutcome}
                onValueChange={setSelectedOutcome}
                className="w-full"
              >
                {market.outcomes.map((outcome) => (
                  <option key={outcome.id} value={outcome.id}>
                    Winner: {outcome.label}
                  </option>
                ))}
              </Select>

              <Button
                disabled={loading !== null || !selectedOutcome}
                onClick={() => runAction("resolve", { winningOutcomeId: selectedOutcome })}
                className="w-full justify-center gap-2"
              >
                {loading === "resolve" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <Gavel className="w-4 h-4" />
                    Resolve & pay out
                  </>
                )}
              </Button>

              <Button
                variant="danger"
                disabled={loading !== null}
                onClick={() => runAction("void")}
                className="w-full justify-center gap-2"
              >
                {loading === "void" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Voiding...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Void & refund
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}