import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/how-it-works";
import ValueProp from "@/components/home/value-prop";

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
      </main>
    </div>
  );
}
