import Hero from "@/components/home/hero";
import ValueProp from "@/components/home/value-prop";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Value Propositions Section */}
        <ValueProp />
      </main>
    </div>
  );
}
