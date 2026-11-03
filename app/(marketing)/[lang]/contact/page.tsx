import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Eyebrow from "@/components/landing/eyebrow";
import MarkerHeading from "@/components/landing/marker-heading";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteContainer } from "@/components/site/ui";
import Rings from "@/components/site/rings";
import {
  resolveLocalePage,
  SITE_CONTACT,
  type LocalePageProps,
} from "@/components/site/copy";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { copy } = await resolveLocalePage(params);
  return copy.meta.contact;
}

const cardTitle =
  "m-0 font-satoshi text-[22px] font-bold leading-7 text-gray-900";

/** Contact channels, headquarters and a message form. */
export default async function ContactPage({ params }: LocalePageProps) {
  const { copy } = await resolveLocalePage(params);
  const t = copy.contact;

  const channels = [
    {
      href: SITE_CONTACT.whatsappHref,
      icon: MessageCircle,
      title: t.whatsapp,
      value: SITE_CONTACT.phone,
      primary: true,
    },
    {
      href: SITE_CONTACT.phoneHref,
      icon: Phone,
      title: t.phone,
      value: SITE_CONTACT.phone,
      primary: false,
    },
    {
      href: `mailto:${SITE_CONTACT.email}`,
      icon: Mail,
      title: t.email,
      value: SITE_CONTACT.email,
      primary: false,
    },
  ];

  return (
    <main className="pattern-grid bg-gray-50 font-satoshi text-foreground">
      <SiteContainer className="flex flex-col gap-10 pb-24 pt-10 lg:pt-16">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <MarkerHeading
            marker={t.marker}
            after={t.titleEnd}
            markerColor="sky"
            brush={3}
            className="m-0 text-[38px] font-medium leading-[42px] text-gray-900 lg:text-[52px] lg:leading-[58px]"
          >
            {t.title}
          </MarkerHeading>
          <p className="m-0 text-lg font-medium leading-7 text-gray-600">
            {t.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.title}
                href={channel.href}
                className={
                  channel.primary
                    ? "pattern-dots-light relative isolate flex flex-col gap-2.5 overflow-hidden rounded-3xl bg-brand-blue p-7 text-white no-underline hover:bg-brand-blue-dark"
                    : "pattern-dots relative isolate flex flex-col gap-2.5 overflow-hidden rounded-3xl border border-gray-200 bg-brand-blue-tint p-7 text-gray-900 no-underline hover:border-brand-blue"
                }
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.2}
                  className="pointer-events-none absolute -bottom-5 -right-5 -z-10 h-28 w-28 opacity-10"
                />
                <Icon
                  className={
                    channel.primary
                      ? "h-7 w-7 text-brand-yellow"
                      : "h-7 w-7 text-brand-blue"
                  }
                  aria-hidden="true"
                />
                <strong className="text-xl font-bold leading-[26px]">
                  {channel.title}
                </strong>
                <span
                  className={
                    channel.primary
                      ? "break-all text-base font-medium text-navy-fg"
                      : "break-all text-base font-medium text-gray-600"
                  }
                >
                  {channel.value}
                </span>
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap items-stretch gap-6">
          <div className="pattern-grid-light relative isolate flex min-w-0 flex-[1_1_380px] flex-col gap-6 overflow-hidden rounded-3xl bg-brand-navy p-6 text-white sm:p-8">
            <Rings />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-foreground">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="m-0 font-satoshi text-[22px] font-bold leading-7">
                {t.hqTitle}
              </h2>
            </div>
            <address className="flex gap-3 text-lg font-medium not-italic leading-7">
              <MapPin
                className="mt-1 h-5 w-5 shrink-0 text-brand-yellow"
                aria-hidden="true"
              />
              <span>
                {SITE_CONTACT.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 text-[15px] font-semibold">
              <a
                href={SITE_CONTACT.phoneHref}
                className="flex items-center gap-3 text-navy-fg no-underline hover:text-white"
              >
                <Phone
                  className="h-5 w-5 text-brand-yellow"
                  aria-hidden="true"
                />
                {SITE_CONTACT.phone}
              </a>
              <a
                href={`mailto:${SITE_CONTACT.email}`}
                className="flex items-center gap-3 break-all text-navy-fg no-underline hover:text-white"
              >
                <Mail
                  className="h-5 w-5 shrink-0 text-brand-yellow"
                  aria-hidden="true"
                />
                {SITE_CONTACT.email}
              </a>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONTACT.addressLines.join(", "))}`}
              className="mt-auto inline-flex h-12 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 text-[15px] font-bold text-foreground no-underline hover:bg-brand-yellow"
            >
              {t.directions}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* Not wired to a backend yet: kept visible but disabled until it is. */}
          <form
            aria-labelledby="msg-h"
            className="flex min-w-0 flex-[1_1_480px] flex-col gap-[18px] rounded-3xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <h2 id="msg-h" className={cardTitle}>
              {t.formTitle}
            </h2>
            <p className="m-0 rounded-xl bg-warning-bg px-4 py-3 text-sm font-medium text-warning-fg">
              {t.formDisabled}
            </p>
            <fieldset
              disabled
              className="m-0 flex flex-col gap-[18px] border-0 p-0 opacity-60"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  name="first_name"
                  label={t.firstName}
                  placeholder={t.firstName}
                  required
                />
                <Input
                  name="last_name"
                  label={t.lastName}
                  placeholder={t.lastName}
                  required
                />
              </div>
              <Input
                name="email"
                type="email"
                label={copy.contact.email}
                placeholder={t.emailPlaceholder}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="msg-body"
                  className="text-sm font-semibold text-gray-700"
                >
                  {t.message}
                </label>
                <textarea
                  id="msg-body"
                  name="message"
                  rows={6}
                  required
                  placeholder={t.messagePlaceholder}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] leading-[22px] text-foreground placeholder:text-gray-400 focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] text-gray-500">{t.replyNote}</span>
                <Button type="submit" size="lg">
                  {t.send}
                </Button>
              </div>
            </fieldset>
          </form>
        </div>
      </SiteContainer>
    </main>
  );
}
