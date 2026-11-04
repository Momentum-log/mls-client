import React, { FC } from "react";
import Image from "next/image";
import {
  Check,
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
