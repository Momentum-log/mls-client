import AboutHero from "@/components/about/about-hero";
import MissionVision from "@/components/about/mission-vision";
import ProblemSolution from "@/components/about/problem-solution";
import CTASection from "@/components/home/cta-section";
import FaqSection from "@/components/shared/faq-section";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <MissionVision />
      <ProblemSolution />
      <CTASection />
      <FaqSection />
    </main>
  );
}
