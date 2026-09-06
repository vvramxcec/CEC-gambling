import { notFound } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { MarketDetailClient } from "@/components/market-detail-client";
import { PageShell } from "@/components/ui";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function MarketPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const market = await db.market.findUnique({
    where: { id },
    select: { id: true, status: true, title: true },
  });

  if (!market) notFound();

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    select: { pointBalance: true },
  });

  return (
    <AppLayout>
      <PageShell title="Market" subtitle={market.title}>
        <MarketDetailClient
          marketId={market.id}
          initialStatus={market.status}
          userBalance={user?.pointBalance ?? 0}
        />
      </PageShell>
    </AppLayout>
  );
}