import en, { type SiteCopy } from "./en";
import pl from "./pl";
import {
  DEFAULT_LOCALE,
  isSiteLocale,
  type SiteLocale,
} from "@/utils/site-locale";

export type { SiteCopy };

const SITE_COPY: Record<SiteLocale, SiteCopy> = { en, pl };

export const getSiteCopy = (locale: SiteLocale): SiteCopy => SITE_COPY[locale];

export interface LocalePageProps {
  params: Promise<{ lang: string }>;
}

/** Locale and copy for a `[lang]` page; the layout has already rejected unknown languages. */
export const resolveLocalePage = async (params: LocalePageProps["params"]) => {
  const { lang } = await params;
  const locale: SiteLocale = isSiteLocale(lang) ? lang : DEFAULT_LOCALE;
  return { locale, copy: getSiteCopy(locale) };
};

/** Contact details shown across the site. */
export const SITE_CONTACT = {
  email: "info@momentumlogservices.com",
  phone: "+48 579 306 288",
  phoneHref: "tel:+48579306288",
  whatsappHref: "https://wa.me/48579306288",
  addressLines: [
    "Momentum Logistics Service",
    "ul. kpt. pilota Żwirki 17",
    "90-539 Łódź, Poland",
  ],
  social: {
    x: "https://x.com/momentumlogserv",
    instagram: "https://www.instagram.com/momentumlogservices",
    linkedin: "https://www.linkedin.com/company/momentum-logistics-services/",
  },
} as const;
