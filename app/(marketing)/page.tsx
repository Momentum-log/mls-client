import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import ValueProp from "@/components/home/value-prop";
import CTASection from "@/components/home/cta-section";
import FAQSection from "@/components/shared/faq-section";
import HeavyFreightSection from "@/components/home/heavy-freight-section";

export default function Home() {
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
