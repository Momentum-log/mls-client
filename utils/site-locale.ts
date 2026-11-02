/**
 * Locale helpers for the marketing site.
 *
 * Company and freight pages live under a language segment (`/en/...`, `/pl/...`).
 * The quote, tracking, auth and account screens stay unprefixed and English only.
 *
 * @module utils/site-locale
 */

export const SITE_LOCALES = ["en", "pl"] as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

export const DEFAULT_LOCALE: SiteLocale = "en";

/** Cookie that remembers the visitor's language choice for `/`. */
export const LOCALE_COOKIE = "mls_lang";

export const isSiteLocale = (value: string | undefined): value is SiteLocale =>
  SITE_LOCALES.includes(value as SiteLocale);

/** The locale a pathname is under, or `null` for an unprefixed page. */
export const localeFromPath = (pathname: string): SiteLocale | null => {
  const segment = pathname.split("/")[1];
  return isSiteLocale(segment) ? segment : null;
};

/** Prefixes a site path (`/ship`, `/`) with a locale. */
export const localePath = (locale: SiteLocale, path = "/"): string =>
  path === "/" ? `/${locale}` : `/${locale}${path}`;

/**
 * The same page in another language. Unprefixed pages (quote, tracking) have
 * no Polish version, so they lead to that language's home page.
 */
export const switchLocalePath = (
  pathname: string,
  locale: SiteLocale,
): string => {
  if (!localeFromPath(pathname)) return localePath(locale);
  return `/${locale}${pathname.slice(3)}`;
};

/** A language tag that points at Poland: Polish (`pl`, `pl-PL`) or any `-PL` region. */
const isPolishTag = (tag: string): boolean => {
  const [language, region] = tag.trim().toLowerCase().split(/[-_]/);
  return language === "pl" || region === "pl";
};

/** Server side: `pl` when the browser's first language points at Poland. */
export const localeFromAcceptLanguage = (
  header: string | null,
): SiteLocale =>
  isPolishTag(header?.split(",")[0]?.split(";")[0] ?? "") ? "pl" : DEFAULT_LOCALE;

/**
 * Client side, no permission prompt: Poland's time zone or a Polish browser
 * language means `pl`, anywhere else `en`.
 */
export const detectBrowserLocale = (): SiteLocale => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const inPoland =
    zone === "Europe/Warsaw" || navigator.languages.some(isPolishTag);
  return inPoland ? "pl" : "en";
};
