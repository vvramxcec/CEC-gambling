import { AppLayout } from "@/components/app-layout";
import { AdminMarketCard } from "@/components/admin-market-card";
import { PageShell, Badge, Card } from "@/components/ui";
import { db } from "@/lib/db";
import { AlertCircle, Gavel, Trophy, Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const markets = await db.market.findMany({
    where: { status: { in: ["PENDING", "OPEN", "LOCKED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      outcomes: true,
      createdBy: { select: { name: true } },
    },
  });

  const pending = markets.filter((market) => market.status === "PENDING");
  const active = markets.filter((market) => market.status !== "PENDING");

  return (
    <AppLayout adminOnly>
      <PageShell
        title="Admin Panel"
        subtitle="Approve suggestions, lock betting, and resolve outcomes."
        action={
          <Link href="/suggest" className="btn-primary px-4 py-2 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Market
          </Link>
        }
      >
        <div className="space-y-10">
          {/* Pending Suggestions */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[var(--color-gold)]" />
                  Pending Suggestions
                </h2>
                <Badge variant="gold" size="md">{pending.length}</Badge>
              </div>
            </div>

            {pending.length === 0 ? (
              <Card variant="glass" padding="xl" className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-[var(--color-muted)]/50 mb-4" />
                <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">No pending suggestions</h3>
                <p className="text-[var(--color-muted)] mb-6">Students haven&apos;t submitted any bets for review yet.</p>
              </Card>
            ) : (
              <div className="space-y-4 animate-slide-up">
                {pending.map((market) => (
                  <AdminMarketCard key={market.id} market={market} />
                ))}
              </div>
            )}
          </section>

          {/* Active Markets */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-xl font-semibold text-[var(--color-cream)] flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-[var(--color-gold)]" />
                  Active Markets
                </h2>
                <Badge variant="emerald" size="md">{active.length}</Badge>
              </div>
            </div>

            {active.length === 0 ? (
              <Card variant="glass" padding="xl" className="text-center">
                <Gavel className="w-12 h-12 mx-auto text-[var(--color-muted)]/50 mb-4" />
                <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-2">No active markets</h3>
                <p className="text-[var(--color-muted)] mb-6">Approved markets will appear here.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {active.map((market) => (
                  <AdminMarketCard key={market.id} market={market} />
                ))}
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <Card variant="default" padding="lg">
            <h3 className="font-display text-lg font-semibold text-[var(--color-cream)] mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--color-gold)]" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-[var(--color-bg-elevated)]/50">
                <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">{pending.length}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Pending Review</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-[var(--color-bg-elevated)]/50">
                <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
                  {active.filter(m => m.status === "OPEN").length}
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Open for Betting</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-[var(--color-bg-elevated)]/50">
                <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
                  {active.filter(m => m.status === "LOCKED").length}
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Locked</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-[var(--color-bg-elevated)]/50">
                <p className="font-display font-bold text-2xl text-[var(--color-gold-light)]">
                  {markets.filter(m => m.status === "RESOLVED").length}
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-1">Resolved</p>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
    </AppLayout>
  );
}