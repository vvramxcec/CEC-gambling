import { LandingLayout } from "@/components/app-layout";
import { Hero } from "@/components/hero";
import { LiveBetsSection } from "@/components/live-bets-section";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { ClassPersonalities } from "@/components/class-personalities";
import { HowItWorks } from "@/components/how-it-works";
import { HallOfDisasters } from "@/components/hall-of-disasters";
import { CTASection } from "@/components/cta-section";

export default function LandingPage() {
  return (
    <LandingLayout>
      <div className="relative">
        <Hero />
        <LiveBetsSection />
        <LeaderboardPreview />
        <ClassPersonalities />
        <HowItWorks />
        <HallOfDisasters />
        <CTASection />
      </div>
    </LandingLayout>
  );
}