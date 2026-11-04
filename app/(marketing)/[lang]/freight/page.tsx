import type { Metadata } from "next";
import Image from "next/image";
import { Construction, Plane, Ship, Truck } from "lucide-react";
import Eyebrow from "@/components/landing/eyebrow";
import MarkerHeading from "@/components/landing/marker-heading";
import { LinkButton, PanelLabel, SiteContainer, heroTitleClass } from "@/components/site/ui";
import {
  resolveLocalePage,
  SITE_CONTACT,
  type LocalePageProps,
} from "@/components/site/copy";
import FreightEnquiryForm from "@/components/site/freight-enquiry-form";
import { cn } from "@/utils/cn";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { copy } = await resolveLocalePage(params);
  return copy.meta.freight;
}

const MODE_ICONS = [Truck, Ship, Plane, Construction];

/** Services: freight and B2B partnerships, with the live enquiry form. */
export default async function FreightPage({ params }: LocalePageProps) {
  const { copy } = await resolveLocalePage(params);
  const t = copy.freight;

  return (
    <main className="bg-white font-satoshi text-foreground">
      <section aria-labelledby="fr-h" className="bg-brand-navy text-white">
        <div className="relative h-[220px] sm:h-[320px] lg:h-[420px]">
          <Image
            src="/images/landing/hero-truck.jpg"
            alt={t.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <SiteContainer className="pattern-grid-light flex flex-wrap items-end gap-12 pb-20 pt-12 lg:pt-16">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-5">
            <PanelLabel className="text-brand-yellow">{t.eyebrow}</PanelLabel>
            <MarkerHeading id="fr-h" marker={t.marker} className={cn(heroTitleClass, "m-0 text-white")}>
              {t.title}
            </MarkerHeading>
            <p className="m-0 max-w-[620px] text-lg font-medium leading-7 text-navy-fg">{t.intro}</p>
          </div>
          <div className="flex flex-[0_1_320px] flex-col gap-2.5">
            <LinkButton href="#enquiry" variant="yellow">
              {t.cta}
            </LinkButton>
            <LinkButton href={SITE_CONTACT.whatsappHref} variant="outlineLight">
              {t.whatsapp}
            </LinkButton>
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="modes-h" className="pattern-grid">
        <SiteContainer className="flex flex-col gap-8 pb-16 pt-16 lg:pt-24">
          <h2
            id="modes-h"
            className="m-0 font-satoshi text-[32px] font-bold leading-[38px] tracking-[-0.02em] text-gray-900 lg:text-[40px] lg:leading-[46px]"
          >
            {t.modesTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.modes.map((mode, index) => {
              const Icon = MODE_ICONS[index];
              return (
                <article key={mode.title} className="flex flex-col gap-3.5 rounded-3xl bg-gray-50 p-7">
                  <Icon className="h-10 w-10 text-brand-blue" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="m-0 font-satoshi text-[22px] font-bold leading-7">{mode.title}</h3>
                  <p className="m-0 text-[15px] leading-[22px] text-gray-600">{mode.text}</p>
                </article>
              );
            })}
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="steps-h">
        <SiteContainer className="flex flex-col gap-8 pb-16 lg:pb-24">
          <h2
            id="steps-h"
            className="m-0 font-satoshi text-[26px] font-bold leading-8 tracking-[-0.02em] text-gray-900 lg:text-[32px] lg:leading-10"
          >
            {t.stepsTitle}
          </h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
            {t.steps.map((step, index) => {
              const isLast = index === t.steps.length - 1;
              return (
                <li
                  key={step.title}
                  className={cn(
                    "flex flex-col gap-2.5 border-t-[3px] pt-5",
                    isLast ? "border-brand-yellow" : "border-brand-blue",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-extrabold",
                      isLast ? "text-warning-fg" : "text-brand-blue",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="text-xl font-bold leading-[26px]">{step.title}</strong>
                  <span className="text-[15px] leading-[22px] text-gray-600">{step.text}</span>
                </li>
              );
            })}
          </ol>
        </SiteContainer>
      </section>

      <section id="enquiry" aria-labelledby="enq-h" className="pattern-dots scroll-mt-6 bg-gray-50">
        <SiteContainer className="flex flex-wrap gap-12 py-16 lg:py-24">
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
            <Eyebrow>{t.form.eyebrow}</Eyebrow>
            <h2
              id="enq-h"
              className="m-0 font-satoshi text-[30px] font-bold leading-9 tracking-[-0.02em] text-gray-900 lg:text-4xl lg:leading-[42px]"
            >
              {t.form.title}
            </h2>
            <p className="m-0 text-base leading-6 text-gray-600">{t.form.text}</p>
            <div className="mt-2 flex flex-col gap-2.5 text-[15px] font-semibold">
              <a href={SITE_CONTACT.phoneHref} className="text-brand-blue no-underline">
                {SITE_CONTACT.phone}
              </a>
              <a href={`mailto:${SITE_CONTACT.email}`} className="text-brand-blue no-underline">
                {SITE_CONTACT.email}
              </a>
            </div>
          </div>
          <FreightEnquiryForm copy={t.form} />
        </SiteContainer>
      </section>
    </main>
  );
}
