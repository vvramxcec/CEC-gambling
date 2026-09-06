import { AppLayout } from "@/components/app-layout";
import { SuggestBetForm } from "@/components/suggest-bet-form";
import { PageShell } from "@/components/ui";

export default function SuggestPage() {
  return (
    <AppLayout>
      <PageShell
        title="Suggest a bet"
        subtitle="Pitch a fun prediction. An admin will approve it before classmates can wager."
      >
        <SuggestBetForm />
      </PageShell>
    </AppLayout>
  );
}
