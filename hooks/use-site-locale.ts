"use client";

import { usePathname } from "next/navigation";
import { getSiteCopy, type SiteCopy } from "@/components/site/copy";
import {
  DEFAULT_LOCALE,
  localeFromPath,
  type SiteLocale,
} from "@/utils/site-locale";

interface UseSiteLocaleResult {
  locale: SiteLocale;
  copy: SiteCopy;
  /** True on pages that exist in both languages (`/en/...`, `/pl/...`). */
  isLocalized: boolean;
}

/**
 * The marketing-site language for client components (header, footer).
 * Read from the URL, so server and client always agree; unprefixed pages
 * (quote, tracking, auth) are English.
 */
export const useSiteLocale = (): UseSiteLocaleResult => {
  const pathLocale = localeFromPath(usePathname() ?? "/");
  const locale = pathLocale ?? DEFAULT_LOCALE;
  return { locale, copy: getSiteCopy(locale), isLocalized: !!pathLocale };
};
