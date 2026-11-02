import type { Metadata } from "next";
import {
  Check,
  Globe,
  Handshake,
  Hourglass,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Target,
  Telescope,
  X,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "@/components/landing/eyebrow";
import MarkerHeading from "@/components/landing/marker-heading";
import {
  LinkButton,
  PanelLabel,
  SectionHeading,
  SectionTitle,
  SiteContainer,
  heroTitleClass,
} from "@/components/site/ui";
import { resolveLocalePage, type LocalePageProps } from "@/components/site/copy";
import FaqList from "@/components/site/faq-list";
import CompanyFilm from "@/components/site/company-film";
import Rings from "@/components/site/rings";
import { cn } from "@/utils/cn";
import { localePath } from "@/utils/site-locale";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { copy } = await resolveLocalePage(params);
  return copy.meta.about;
}

const VALUE_ICONS = [ShieldCheck, Lightbulb, Handshake, Globe];

const VALUE_STYLES = [
  { card: "pattern-dots bg-brand-blue-tint text-gray-900", tile: "bg-white text-brand-blue", text: "text-gray-600" },
  { card: "bg-brand-yellow text-foreground", tile: "bg-white/60 text-brand-blue", text: "text-gray-800" },
  { card: "pattern-dots bg-eco-bg text-gray-900", tile: "bg-white text-success-fg", text: "text-gray-600" },
  { card: "pattern-grid-light bg-brand-navy text-white", tile: "bg-white/10 text-brand-yellow", text: "text-navy-muted" },
];

function CardIcon({ icon: Icon, className }: { icon: LucideIcon; className: string }) {
  return (
    <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl", className)}>
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
  );
}

/** Company story, mission, values and the FAQ (`#faq`). */
export default async function AboutPage({ params }: LocalePageProps) {
  const { locale, copy } = await resolveLocalePage(params);
  const t = copy.about;

  return (
    <main className="bg-white font-satoshi text-foreground">
      <section aria-labelledby="ab-h" className="pattern-dots">
        <SiteContainer className="flex flex-wrap items-end gap-x-12 gap-y-8 pb-12 pt-10 lg:pt-16">
          <div className="flex min-w-0 flex-[1_1_600px] flex-col gap-5">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <MarkerHeading id="ab-h" marker={t.marker} brush={3} className={heroTitleClass}>
              {t.title}
            </MarkerHeading>
          </div>
          <p className="m-0 flex-[1_1_360px] text-lg font-medium leading-7 text-gray-700">{t.intro}</p>
        </SiteContainer>
      </section>

      <section aria-labelledby="story-h">
        <SiteContainer className="flex flex-wrap items-center gap-12 pb-16 lg:pb-24">
          <div className="mx-auto flex shrink-0 justify-center lg:mx-0">
            <CompanyFilm copy={t} />
          </div>
          <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-[18px]">
            <SectionHeading id="story-h" eyebrow={t.storyEyebrow} title={t.storyTitle} />
            {t.story.map((paragraph) => (
              <p key={paragraph} className="m-0 text-[17px] leading-[27px] text-gray-700">
                {paragraph}
              </p>
            ))}
            <p className="m-0 text-[15px] font-medium leading-[22px] text-gray-500">{t.group}</p>
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="mv-h" className="pattern-grid bg-gray-50">
        <SiteContainer className="flex flex-col gap-8 py-16 lg:py-24">
          <SectionTitle id="mv-h">{t.whyTitle}</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="pattern-dots flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-7 lg:p-9">
              <CardIcon icon={Target} className="bg-brand-blue-tint text-brand-blue" />
              <PanelLabel className="text-brand-blue">{t.missionLabel}</PanelLabel>
              <p className="m-0 text-xl font-medium leading-[30px] text-gray-900 lg:text-2xl lg:leading-[34px]">
                {t.mission}
              </p>
            </div>
            <div className="pattern-dots-light relative isolate flex flex-col gap-3 overflow-hidden rounded-3xl bg-brand-blue p-7 text-white lg:p-9">
              <Rings />
              <CardIcon icon={Telescope} className="bg-white/15 text-brand-yellow" />
              <PanelLabel className="text-brand-yellow">{t.visionLabel}</PanelLabel>
              <p className="m-0 text-xl font-medium leading-[30px] lg:text-2xl lg:leading-[34px]">{t.vision}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="pattern-grid flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-100 p-8">
              <CardIcon icon={Hourglass} className="bg-white text-gray-500" />
              <h3 className="m-0 font-satoshi text-xl font-bold leading-7 text-gray-500">{t.oldTitle}</h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base font-medium leading-6 text-gray-600">
                {t.oldPoints.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pattern-dots flex flex-col gap-4 rounded-3xl border-2 border-brand-blue bg-brand-blue-tint p-8">
              <CardIcon icon={Rocket} className="bg-brand-blue text-white" />
              <h3 className="m-0 font-satoshi text-xl font-bold leading-7 text-brand-blue">{t.newTitle}</h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base font-medium leading-6 text-foreground">
                {t.newPoints.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="val-h">
        <SiteContainer className="flex flex-col gap-8 py-16 lg:py-24">
          <SectionHeading id="val-h" eyebrow={t.valuesEyebrow} title={t.valuesTitle} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((value, index) => {
              const Icon = VALUE_ICONS[index];
              return (
                <article
                  key={value.title}
                  className={cn(
                    "relative isolate flex min-h-[220px] flex-col gap-3.5 overflow-hidden rounded-[20px] p-6",
                    VALUE_STYLES[index].card,
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.2}
                    className="pointer-events-none absolute -bottom-6 -right-6 -z-10 h-32 w-32 opacity-10"
                  />
                  <CardIcon icon={Icon} className={VALUE_STYLES[index].tile} />
                  <strong className="mt-auto text-xl font-bold leading-[26px]">{value.title}</strong>
                  <span className={cn("text-[15px] leading-[22px]", VALUE_STYLES[index].text)}>{value.text}</span>
                </article>
              );
            })}
          </div>
        </SiteContainer>
      </section>

      <section id="faq" aria-labelledby="faq-h" className="pattern-dots scroll-mt-6 bg-gray-50">
        <SiteContainer className="flex flex-wrap gap-12 py-16 lg:py-24">
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <Eyebrow>{t.faqEyebrow}</Eyebrow>
            <SectionTitle id="faq-h">{t.faqTitle}</SectionTitle>
            <p className="m-0 text-base leading-6 text-gray-600">{t.faqText}</p>
            <LinkButton href={localePath(locale, "/contact")} size="md" className="self-start">
              {t.faqCta}
            </LinkButton>
          </div>
          <div className="min-w-0 flex-[2_1_520px]">
            <FaqList items={t.faqs} />
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
