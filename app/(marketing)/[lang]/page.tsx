import type { Metadata } from "next";
import { resolveLocalePage, type LocalePageProps } from "@/components/site/copy";
import HomeHero from "@/components/site/home/home-hero";
import {
  HomeCta,
  HomeFacts,
  HomeFreight,
  HomeHowItWorks,
  HomePartners,
  HomeSustainability,
} from "@/components/site/home/home-sections";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { copy } = await resolveLocalePage(params);
  return copy.meta.home;
}

/**
 * Momentum Logistics home page. Header and footer come from
 * `app/(marketing)/layout.tsx`; the previous page is kept at `/legacy-home`.
 */
export default async function HomePage({ params }: LocalePageProps) {
  const { locale, copy } = await resolveLocalePage(params);
  const home = copy.home;

  return (
    <main className="bg-white font-satoshi text-foreground">
      <HomeHero copy={home} locale={locale} />
      <HomePartners copy={home} />
      <HomeFreight copy={home} locale={locale} />
      <HomeHowItWorks copy={home} />
      <HomeFacts copy={home} />
      <HomeSustainability copy={home} locale={locale} />
      <HomeCta copy={home} locale={locale} />
    </main>
  );
}
