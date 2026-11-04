import React, { FC } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import MarkerHeading from "@/components/landing/marker-heading";
import Eyebrow from "@/components/landing/eyebrow";
import { LinkButton, SiteContainer, heroTitleClass } from "@/components/site/ui";
import type { SiteCopy } from "@/components/site/copy";
import { localePath, type SiteLocale } from "@/utils/site-locale";
import BookingPanel from "./booking-panel";

interface HomeHeroProps {
  copy: SiteCopy["home"];
  locale: SiteLocale;
}

/** Headline, hero photo and the quote-or-track panel overlapping its foot. */
const HomeHero: FC<HomeHeroProps> = ({ copy, locale }) => (
  <section aria-labelledby="hero-h" className="pattern-dots bg-gray-50 lg:bg-white">
    <SiteContainer className="flex flex-wrap items-center gap-10 pt-6 lg:pt-12">
      <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-4 lg:gap-[22px]">
        <Eyebrow className="hidden sm:block">{copy.eyebrow}</Eyebrow>
        <MarkerHeading id="hero-h" marker={copy.marker} className={heroTitleClass}>
          {copy.title}
        </MarkerHeading>
        <p className="m-0 max-w-[500px] text-base font-medium leading-6 text-gray-700 lg:text-lg lg:leading-7">
          {copy.intro}
        </p>
        <div className="hidden flex-wrap gap-3 sm:flex">
          <LinkButton href="/shipping-estimate">{copy.ctaQuote}</LinkButton>
          <LinkButton href={localePath(locale, "/freight")} variant="outline">
            {copy.ctaFreight}
          </LinkButton>
        </div>
      </div>

      <div className="relative min-w-0 flex-[1.2_1_520px]">
        <div className="relative h-[200px] overflow-hidden rounded-[20px] sm:h-[360px] lg:h-[540px] lg:rounded-[32px]">
          <Image
            src="/images/landing/hero-truck.jpg"
            alt={copy.heroImageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 680px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute -left-5 top-6 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-gray-900/10 lg:flex">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-tint">
            <MapPin className="h-5 w-5 text-brand-blue" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="font-mono text-xs text-gray-500">MLS-24K7Q9X2</span>
            <strong className="text-sm font-bold">In transit · Łódź → Berlin</strong>
          </span>
        </div>
        <div className="absolute bottom-24 right-6 hidden flex-col rounded-2xl bg-brand-yellow px-[18px] py-3.5 shadow-xl shadow-gray-900/10 lg:flex">
          <strong className="text-[30px] font-extrabold leading-[34px] text-foreground">
            150+
          </strong>
          <span className="text-[13px] font-semibold leading-[18px] text-foreground">
            {copy.countries}
          </span>
        </div>
      </div>
    </SiteContainer>

    <SiteContainer className="relative pb-7 pt-4 lg:-mt-12 lg:pb-0 lg:pt-0">
      <BookingPanel copy={copy.panel} locale={locale} />
    </SiteContainer>
  </section>
);

export default HomeHero;
