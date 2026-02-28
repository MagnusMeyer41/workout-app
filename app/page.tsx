import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { CoreFeaturesSection } from "@/components/landing/core-features";
import { Footer } from "@/components/ui/footer-section";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <LandingNavbar />
      <div className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <CoreFeaturesSection />
        <Footer />
      </div>
    </main>
  );
}