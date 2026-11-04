"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  detectBrowserLocale,
  LOCALE_COOKIE,
  switchLocalePath,
  type SiteLocale,
} from "@/utils/site-locale";

/**
 * First visit only: move visitors in Poland to `/pl` and everyone else to `/en`,
 * then remember the result. A language picked in the header overwrites the
 * cookie, so detection never overrides a choice.
 */
const LocaleAutoDetect = ({ locale }: { locale: SiteLocale }) => {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (document.cookie.includes(`${LOCALE_COOKIE}=`)) return;
    const detected = detectBrowserLocale();
    document.cookie = `${LOCALE_COOKIE}=${detected}; path=/; max-age=31536000; samesite=lax`;
    if (detected !== locale) router.replace(switchLocalePath(pathname, detected));
  }, [locale, pathname, router]);

  return null;
};

export default LocaleAutoDetect;
