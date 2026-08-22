import type { Metadata } from "next";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import ValueProp from "@/components/home/value-prop";
import CTASection from "@/components/home/cta-section";
import FAQSection from "@/components/shared/faq-section";
import HeavyFreightSection from "@/components/home/heavy-freight-section";

/**
 * The previous marketing landing page, retained for reference after the
 * freight-partnership page took over `/`.
 *
 * Deliberately unlinked and excluded from search indexing — nothing in the
 * app navigates here.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LegacyHome() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Value Propositions Section */}
        <ValueProp />

        {/* How it works */}
        <HowItWorks />

        {/* Heavy Freight Section */}
        <HeavyFreightSection />

        {/* CTA Section */}
        <CTASection />

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </div>
  );
}
