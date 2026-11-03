import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  FileText,
  Luggage,
  Package,
  Plane,
  Ship,
  Truck,
} from "lucide-react";
import {
  LinkButton,
  PanelLabel,
  SectionHeading,
  SectionTitle,
  SiteContainer,
} from "@/components/site/ui";
import type { SiteCopy } from "@/components/site/copy";
import Rings from "@/components/site/rings";
import { cn } from "@/utils/cn";
import { localePath, type SiteLocale } from "@/utils/site-locale";

type HomeCopy = SiteCopy["home"];

interface SectionProps {
  copy: HomeCopy;
  locale: SiteLocale;
}

const PARTNER_LOGOS = [
  { name: "DPD", src: "/images/partners/dpd.png" },
  { name: "FedEx", src: "/images/partners/fedex.jpg" },
  { name: "DHL", src: "/images/partners/dhl.jpg" },
];

/** Courier networks, each logo padded inside a white tile so none is cropped. */
export const HomePartners: FC<{ copy: HomeCopy }> = ({ copy }) => (
  <section aria-labelledby="partners-h">
    <SiteContainer className="flex flex-col items-center gap-5 pb-6 pt-6 lg:pt-14">
      <h2
        id="partners-h"
        className="m-0 text-center font-satoshi text-[13px] font-bold uppercase leading-4 tracking-[0.15em] text-gray-500"
      >
        {copy.partnersTitle}
      </h2>
      <ul className="m-0 grid w-full max-w-[760px] list-none grid-cols-3 gap-2 p-0 sm:gap-4">
        {PARTNER_LOGOS.map((partner) => (
          <li
            key={partner.name}
            className="flex h-16 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:h-24 sm:rounded-2xl sm:px-8 sm:py-4"
          >
            <span className="relative h-full w-full">
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                sizes="200px"
                className="object-contain"
              />
            </span>
          </li>
        ))}
      </ul>
    </SiteContainer>
  </section>
);

const SHIP_CARDS = [
  {
    icon: FileText,
    card: "pattern-dots-light bg-brand-blue text-white",
    tile: "bg-white/15 text-brand-yellow",
    text: "text-navy-fg",
  },
  {
    icon: Package,
    card: "bg-brand-yellow text-foreground",
    tile: "bg-white/60 text-brand-blue",
    text: "text-gray-800",
  },
  {
    icon: Luggage,
    card: "pattern-dots bg-brand-blue-tint text-gray-900",
    tile: "bg-white text-brand-blue",
    text: "text-gray-600",
  },
  {
    icon: Briefcase,
    card: "pattern-grid-light bg-brand-navy text-white",
    tile: "bg-white/10 text-brand-yellow",
    text: "text-navy-muted",
  },
];

/** What Momentum ships: four coloured cards, each leading to the instant quote. */
export const HomeShip: FC<SectionProps> = ({ copy, locale }) => (
  <section aria-labelledby="ship-h" className="pattern-grid">
    <SiteContainer className="flex flex-col gap-8 pb-12 pt-6 lg:gap-10 lg:pb-24 lg:pt-[72px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="ship-h" eyebrow={copy.shipEyebrow} title={copy.shipTitle} />
        <Link
          href={localePath(locale, "/ship")}
          className="text-[15px] font-bold text-brand-blue no-underline hover:text-brand-blue-dark"
        >
          {copy.shipLink} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-5">
        {copy.shipCards.map((card, index) => {
          const style = SHIP_CARDS[index];
          const Icon = style.icon;
          return (
            <Link
              key={card.title}
              href="/shipping-estimate"
              className={cn(
                "group relative isolate flex min-h-[180px] flex-col gap-2 overflow-hidden rounded-2xl p-4 no-underline transition-transform duration-200 hover:-translate-y-1 lg:min-h-[260px] lg:gap-3 lg:rounded-3xl lg:p-6",
                style.card,
              )}
            >
              <Icon
                aria-hidden="true"
                strokeWidth={1.2}
                className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-28 w-28 opacity-15 transition-transform duration-300 group-hover:rotate-6 lg:h-40 lg:w-40"
              />
              <span className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl lg:h-12 lg:w-12",
                    style.tile,
                  )}
                >
                  <Icon className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
                </span>
                <span className="font-satoshi text-sm font-extrabold opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              <h3 className="m-0 mt-auto font-satoshi text-base font-bold leading-[22px] lg:text-xl lg:leading-7">
                {card.title}
              </h3>
              <p className={cn("m-0 text-[13px] leading-[18px] lg:text-[15px] lg:leading-[22px]", style.text)}>
                {card.text}
              </p>
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>
    </SiteContainer>
  </section>
);

const FREIGHT_ICONS = [Truck, Ship, Plane];

export const HomeFreight: FC<SectionProps> = ({ copy, locale }) => (
  <section aria-labelledby="fr-h" className="pattern-grid-light bg-brand-navy text-white">
    <SiteContainer className="flex flex-col gap-10 py-16 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[640px] flex-col gap-3">
          <PanelLabel className="text-brand-yellow">{copy.freightEyebrow}</PanelLabel>
          <SectionTitle id="fr-h" className="text-white">
            {copy.freightTitle}
          </SectionTitle>
          <p className="m-0 text-[17px] leading-[26px] text-navy-fg">{copy.freightText}</p>
        </div>
        <LinkButton href={`${localePath(locale, "/freight")}#enquiry`} variant="yellow">
          {copy.freightCta}
        </LinkButton>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {copy.freightCards.map((card, index) => {
          const Icon = FREIGHT_ICONS[index];
          return (
            <article
              key={card.title}
              className="flex flex-col gap-4 rounded-3xl bg-white/5 p-7"
            >
              <Icon className="h-10 w-10 text-brand-yellow" aria-hidden="true" />
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 font-satoshi text-[22px] font-bold leading-7">{card.title}</h3>
                <p className="m-0 text-[15px] leading-[22px] text-navy-muted">{card.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </SiteContainer>
  </section>
);

export const HomeHowItWorks: FC<{ copy: HomeCopy }> = ({ copy }) => (
  <section aria-labelledby="how-h" className="pattern-dots bg-gray-50">
    <SiteContainer className="flex flex-col gap-10 py-16 lg:py-24">
      <SectionHeading id="how-h" eyebrow={copy.howEyebrow} title={copy.howTitle} />
      <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {copy.howSteps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2.5 border-t border-gray-300 pt-5">
            <span className="font-satoshi text-[40px] font-bold leading-[44px] text-brand-blue">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="text-xl font-bold leading-[26px]">{step.title}</strong>
            <span className="text-[15px] leading-[22px] text-gray-600">{step.text}</span>
          </li>
        ))}
      </ol>
    </SiteContainer>
  </section>
);

export const HomeFacts: FC<{ copy: HomeCopy }> = ({ copy }) => (
  <section aria-label={copy.factsLabel} className="pattern-grid">
    <SiteContainer className="py-16 lg:py-[72px]">
      <dl className="m-0 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {copy.facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col-reverse gap-1.5 border-l-[3px] border-brand-yellow pl-5"
          >
            <dt className="text-[15px] font-medium leading-[22px] text-gray-600">{fact.label}</dt>
            <dd className="m-0 font-satoshi text-[36px] font-extrabold leading-[40px] tracking-[-0.02em] text-gray-900 lg:text-5xl lg:leading-[52px]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </SiteContainer>
  </section>
);

export const HomeSustainability: FC<SectionProps> = ({ copy, locale }) => (
  <section aria-labelledby="green-h">
    <SiteContainer className="pb-16 lg:pb-24">
      <div className="flex flex-wrap overflow-hidden rounded-3xl bg-eco-bg lg:rounded-[32px]">
        <div className="relative min-h-[260px] flex-[1_1_480px] lg:min-h-[440px]">
          <Image
            src="/images/landing/sustainability.jpg"
            alt={copy.greenImageAlt}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="pattern-dots flex min-w-0 flex-[1_1_440px] flex-col justify-center gap-5 p-6 sm:p-12">
          <PanelLabel className="text-success-fg">{copy.greenEyebrow}</PanelLabel>
          <h2
            id="green-h"
            className="m-0 font-satoshi text-[32px] font-bold leading-[38px] tracking-[-0.02em] text-gray-900 lg:text-[40px] lg:leading-[46px]"
          >
            {copy.greenTitle}
          </h2>
          <p className="m-0 text-[17px] leading-[26px] text-gray-700">{copy.greenText}</p>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 text-[15px] font-semibold leading-[22px] text-gray-900 sm:grid-cols-2">
            {copy.greenPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <Check className="h-5 w-5 shrink-0 text-success-fg" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <LinkButton
            href={localePath(locale, "/sustainability")}
            variant="outlineEco"
            size="md"
            className="self-start"
          >
            {copy.greenCta}
          </LinkButton>
        </div>
      </div>
    </SiteContainer>
  </section>
);

export const HomeCta: FC<SectionProps> = ({ copy, locale }) => (
  <section aria-labelledby="cta-h">
    <SiteContainer className="pb-16 lg:pb-24">
      <div className="pattern-stripes-light relative isolate flex min-h-[360px] flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl bg-brand-navy px-6 py-12 text-center text-white lg:min-h-[420px] lg:rounded-[32px]">
        <Rings />
        <h2
          id="cta-h"
          className="m-0 max-w-[720px] font-satoshi text-[32px] font-bold leading-[38px] tracking-[-0.02em] lg:text-5xl lg:leading-[54px]"
        >
          {copy.ctaTitle}
        </h2>
        <p className="m-0 text-[17px] font-medium leading-[26px] text-navy-fg">{copy.ctaText}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton href="/shipping-estimate" variant="yellow">
            {copy.ctaQuote}
          </LinkButton>
          <LinkButton href={localePath(locale, "/contact")} variant="outlineLight">
            {copy.ctaContact}
          </LinkButton>
        </div>
      </div>
    </SiteContainer>
  </section>
);
