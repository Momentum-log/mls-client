import type { Metadata } from "next";
import Image from "next/image";
import { Handshake, Recycle, Route, Zap } from "lucide-react";
import MarkerHeading from "@/components/landing/marker-heading";
import { LinkButton, PanelLabel, SiteContainer, heroTitleClass } from "@/components/site/ui";
import { resolveLocalePage, type LocalePageProps } from "@/components/site/copy";
import Rings from "@/components/site/rings";
import { localePath } from "@/utils/site-locale";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { copy } = await resolveLocalePage(params);
  return copy.meta.sustainability;
}

const COMMITMENT_ICONS = [Route, Zap, Recycle, Handshake];

/** Services: sustainability and ESG commitments. */
export default async function SustainabilityPage({ params }: LocalePageProps) {
  const { locale, copy } = await resolveLocalePage(params);
  const t = copy.sustainability;

  return (
    <main className="bg-white font-satoshi text-foreground">
      <section aria-labelledby="g-h" className="pattern-dots bg-eco-bg">
        <SiteContainer className="flex flex-wrap items-center gap-12 py-16 lg:py-[88px]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-5">
            <PanelLabel className="text-success-fg">{t.eyebrow}</PanelLabel>
            <MarkerHeading id="g-h" marker={t.marker} markerColor="green" brush={2} className={heroTitleClass}>
              {t.title}
            </MarkerHeading>
            <p className="m-0 max-w-[600px] text-lg font-medium leading-7 text-gray-700">{t.intro}</p>
          </div>
          <div className="flex flex-[1_1_360px] flex-col gap-3 rounded-[32px] border border-green-200 bg-white p-7">
            <PanelLabel className="text-success-fg">{t.ambitionEyebrow}</PanelLabel>
            <strong className="text-4xl font-bold leading-[42px] tracking-[-0.02em] text-gray-900">
              {t.ambitionTitle}
            </strong>
            <span className="text-[15px] leading-[22px] text-gray-600">{t.ambitionText}</span>
          </div>
        </SiteContainer>
      </section>

      <section aria-label={t.imageAlt}>
        <SiteContainer className="pt-16">
          <div className="relative h-[260px] overflow-hidden rounded-3xl sm:h-[360px] lg:h-[480px] lg:rounded-[32px]">
            <Image
              src="/images/landing/sustainability.jpg"
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1280px) 1232px, 100vw"
              className="object-cover"
            />
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="c-h" className="pattern-grid">
        <SiteContainer className="flex flex-col gap-10 py-16 lg:py-24">
          <h2
            id="c-h"
            className="m-0 font-satoshi text-[32px] font-bold leading-[38px] tracking-[-0.02em] text-gray-900 lg:text-[40px] lg:leading-[46px]"
          >
            {t.commitmentsTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.commitments.map((item, index) => {
              const Icon = COMMITMENT_ICONS[index];
              return (
                <article key={item.title} className="flex flex-col gap-3.5 rounded-3xl border border-gray-200 p-7">
                  <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-success-bg">
                    <Icon className="h-[26px] w-[26px] text-success-fg" aria-hidden="true" />
                  </span>
                  <h3 className="m-0 font-satoshi text-[21px] font-bold leading-7">{item.title}</h3>
                  <p className="m-0 text-[15px] leading-[22px] text-gray-600">{item.text}</p>
                </article>
              );
            })}
          </div>
        </SiteContainer>
      </section>

      <section aria-labelledby="esg-h">
        <SiteContainer className="pb-16 lg:pb-24">
          <div className="pattern-grid-light relative isolate flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-3xl bg-brand-navy p-6 text-white sm:p-10 lg:rounded-[32px]">
            <Rings />
            <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-2.5">
              <h2 id="esg-h" className="m-0 font-satoshi text-[30px] font-bold leading-9 tracking-[-0.02em]">
                {t.esgTitle}
              </h2>
              <p className="m-0 text-base leading-6 text-navy-fg">{t.esgText}</p>
            </div>
            <LinkButton href={localePath(locale, "/contact")} variant="yellow">
              {t.esgCta}
            </LinkButton>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
