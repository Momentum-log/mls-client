import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, FileText, MapPin, Printer, Scale, Shield } from "lucide-react";
import Eyebrow from "@/components/landing/eyebrow";
import MarkerHeading from "@/components/landing/marker-heading";
import {
  LinkButton,
  PanelLabel,
  SectionHeading,
  SiteContainer,
  heroTitleClass,
} from "@/components/site/ui";
import { resolveLocalePage, type LocalePageProps } from "@/components/site/copy";
import Rings from "@/components/site/rings";
import { cn } from "@/utils/cn";
import { localePath } from "@/utils/site-locale";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { copy } = await resolveLocalePage(params);
  return copy.meta.ship;
}

const TIER_STYLES = [
  { badge: "bg-brand-blue text-white", card: "border border-gray-200" },
  { badge: "bg-brand-yellow text-foreground", card: "border-2 border-brand-blue" },
  { badge: "bg-gray-700 text-white", card: "border border-gray-200" },
];

const HAND_ICONS = [CalendarClock, MapPin, Printer];

/** Services: parcel and express courier shipping. */
export default async function ShipPage({ params }: LocalePageProps) {
  const { locale, copy } = await resolveLocalePage(params);
  const t = copy.ship;

  return (
    <main className="bg-white font-satoshi text-foreground">
      <section aria-labelledby="sp-h" className="pattern-dots">
        <SiteContainer className="flex flex-col gap-5 pb-16 pt-10 lg:pb-[72px] lg:pt-12">
          <nav aria-label="Breadcrumb" className="text-sm font-medium text-gray-500">
            <Link href={localePath(locale)} className="text-brand-blue no-underline">
              {t.home}
            </Link>{" "}
            / {t.services} / {copy.nav.serviceItems[0].title}
          </nav>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <MarkerHeading id="sp-h" marker={t.marker} markerColor="sky" brush={2} className={cn(heroTitleClass, "max-w-[900px]")}>
            {t.title}
          </MarkerHeading>
          <p className="m-0 max-w-[620px] text-lg font-medium leading-7 text-gray-700">{t.intro}</p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/shipping-estimate">{t.ctaQuote}</LinkButton>
            <LinkButton href="/track-shipment" variant="outline">
              {t.ctaTrack}
            </LinkButton>
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="tiers-h" className="pattern-grid bg-gray-50">
        <SiteContainer className="flex flex-col gap-10 py-16 lg:py-24">
          <SectionHeading id="tiers-h" eyebrow={t.tiersEyebrow} title={t.tiersTitle} text={t.tiersText} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.tiers.map((tier, index) => (
              <article
                key={tier.badge}
                className={cn("flex flex-col gap-2.5 rounded-3xl bg-white p-7", TIER_STYLES[index].card)}
              >
                <span
                  className={cn(
                    "self-start rounded-full px-2.5 py-1 text-xs font-bold",
                    TIER_STYLES[index].badge,
                  )}
                >
                  {tier.badge}
                </span>
                <h3 className="m-0 font-satoshi text-[22px] font-bold leading-7">{tier.title}</h3>
                <p className="m-0 text-[15px] leading-[22px] text-gray-600">{tier.text}</p>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="hand-h">
        <SiteContainer className="flex flex-col gap-10 py-16 lg:py-24">
          <SectionHeading id="hand-h" eyebrow={t.handEyebrow} title={t.handTitle} text={t.handText} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {t.hand.map((item, index) => {
              const Icon = HAND_ICONS[index];
              return (
                <article key={item.title} className="flex flex-col gap-4 rounded-3xl border border-gray-200 p-7">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue-tint text-brand-blue">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="m-0 font-satoshi text-[22px] font-bold leading-7">{item.title}</h3>
                  <p className="m-0 text-[15px] leading-[22px] text-gray-600">{item.text}</p>
                </article>
              );
            })}
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="biz-h">
        <SiteContainer className="pb-16 lg:pb-24">
          <div className="pattern-dots-light relative isolate flex flex-col gap-[18px] overflow-hidden rounded-3xl bg-brand-blue p-6 text-white sm:p-12 lg:rounded-[32px]">
            <Rings />
            <PanelLabel className="text-brand-yellow">{t.bizEyebrow}</PanelLabel>
            <h2
              id="biz-h"
              className="m-0 max-w-[640px] font-satoshi text-[30px] font-bold leading-9 tracking-[-0.02em] lg:text-[38px] lg:leading-[44px]"
            >
              {t.bizTitle}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-base font-medium leading-6 text-navy-fg">
              {t.bizPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <LinkButton href="/register" variant="yellow" className="self-start">
              {t.bizCta}
            </LinkButton>
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="ins-h" className="pattern-dots bg-gray-50">
        <SiteContainer className="grid grid-cols-1 gap-6 py-16 md:grid-cols-3 lg:py-[72px]">
          <Note icon={<Shield className="h-6 w-6 text-blue-700" aria-hidden="true" />} tint="bg-blue-100">
            <strong id="ins-h" className="text-lg font-bold leading-6">{t.insuredTitle}</strong>
            <span className="text-[15px] leading-[22px] text-gray-600">{t.insuredText}</span>
          </Note>
          <Note icon={<FileText className="h-6 w-6 text-blue-700" aria-hidden="true" />} tint="bg-blue-100">
            <strong className="text-lg font-bold leading-6">{t.customsTitle}</strong>
            <span className="text-[15px] leading-[22px] text-gray-600">{t.customsText}</span>
          </Note>
          <Note icon={<Scale className="h-6 w-6 text-warning-fg" aria-hidden="true" />} tint="bg-warning-bg">
            <strong className="text-lg font-bold leading-6">{t.heavyTitle}</strong>
            <span className="text-[15px] leading-[22px] text-gray-600">
              {t.heavyText}{" "}
              <Link href={`${localePath(locale, "/freight")}#enquiry`} className="font-bold text-brand-blue">
                {t.heavyLink}
              </Link>{" "}
              {t.heavyTextEnd}
            </span>
          </Note>
        </SiteContainer>
      </section>
    </main>
  );
}

function Note({
  icon,
  tint,
  children,
}: {
  icon: React.ReactNode;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className={cn("inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tint)}>
        {icon}
      </span>
      <span className="flex flex-col gap-1">{children}</span>
    </div>
  );
}
