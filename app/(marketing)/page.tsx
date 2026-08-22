import LandingHero from "@/components/landing/landing-hero";
import LandingVideo from "@/components/landing/landing-video";
import LandingPartners from "@/components/landing/landing-partners";
import LandingInquiryForm from "@/components/landing/landing-inquiry-form";
import LandingCompany from "@/components/landing/landing-company";
import LandingSustainability from "@/components/landing/landing-sustainability";
import FAQSection from "@/components/shared/faq-section";

/**
 * Momentum Logistics landing page.
 *
 * Header and footer come from `app/(marketing)/layout.tsx` — do not add them here.
 * The previous landing page is preserved at `/legacy-home`.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero — primary CTA routes to the instant shipment quote flow */}
        <LandingHero />

        {/* Company video */}
        <LandingVideo />

        {/* Official carrier partners */}
        <LandingPartners />

        {/* Become a partner — live freight enquiry form */}
        <LandingInquiryForm />

        {/* About Momentum */}
        <LandingCompany />

        {/* Sustainability & ESG */}
        <LandingSustainability />

        {/* FAQ */}
        <FAQSection />
      </main>
    </div>
  );
}
