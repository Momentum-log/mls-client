"use client";

import React, { FC, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { useCountryStore } from "@/store/country-store";
import type { SiteCopy } from "@/components/site/copy";
import {
  LOCALE_COOKIE,
  SITE_LOCALES,
  switchLocalePath,
  type SiteLocale,
} from "@/utils/site-locale";

type Region = "pl" | "intl";

/** Matches `HeaderCountrySelector`: any non-Polish country prices in EUR. */
const REGION_COUNTRY: Record<Region, string> = { pl: "PL", intl: "US" };

const LANGUAGE_NAMES: Record<SiteLocale, string> = {
  en: "English",
  pl: "Polski",
};

interface HeaderRegionMenuProps {
  copy: SiteCopy;
  locale: SiteLocale;
  onClose: () => void;
}

/**
 * Language and region dialog. Language changes the URL (`/en` or `/pl`) and is
 * remembered in a cookie for `/`; region sets the currency in the country store.
 */
const HeaderRegionMenu: FC<HeaderRegionMenuProps> = ({
  copy,
  locale,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const { countryCode, setCountry } = useCountryStore();

  const [language, setLanguage] = useState<SiteLocale>(locale);
  const [region, setRegion] = useState<Region>(
    countryCode === "PL" ? "pl" : "intl",
  );

  const save = (): void => {
    setCountry(REGION_COUNTRY[region]);
    document.cookie = `${LOCALE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`;
    onClose();
    if (language !== locale) router.push(switchLocalePath(pathname, language));
  };

  const regions = [
    { id: "pl" as const, name: copy.nav.poland, note: copy.nav.polandNote, currency: "PLN" },
    {
      id: "intl" as const,
      name: copy.nav.international,
      note: copy.nav.internationalNote,
      currency: "EUR",
    },
  ];

  return (
    <div
      role="dialog"
      aria-label={copy.nav.regionButton}
      className="absolute right-4 top-[calc(100%+4px)] z-20 flex w-[360px] max-w-[calc(100vw-32px)] flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-xl sm:right-6"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold uppercase leading-4 tracking-[0.15em] text-brand-blue">
          {copy.nav.language}
        </span>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
          {SITE_LOCALES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLanguage(option)}
              aria-pressed={option === language}
              className={cn(
                "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl",
                option === language
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-gray-700",
              )}
            >
              <span className="text-sm font-bold">{LANGUAGE_NAMES[option]}</span>
              <span className="font-mono text-xs opacity-80">/{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold uppercase leading-4 tracking-[0.15em] text-brand-blue">
          {copy.nav.region}
        </span>
        {regions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setRegion(option.id)}
            aria-pressed={option.id === region}
            className={cn(
              "flex min-h-[60px] items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5",
              option.id === region
                ? "border-2 border-brand-blue"
                : "border border-gray-200",
            )}
          >
            <span className="flex flex-col items-start gap-0.5 text-left">
              <span className="text-[15px] font-bold leading-5 text-gray-900">
                {option.name}
              </span>
              <span className="text-[13px] leading-[18px] text-gray-500">
                {option.note}
              </span>
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[13px] font-bold text-gray-900">
              {option.currency}
            </span>
          </button>
        ))}
      </div>

      <p className="m-0 text-[13px] leading-[18px] text-gray-500">
        {copy.nav.regionHint}
      </p>
      <button
        type="button"
        onClick={save}
        className="h-12 rounded-xl bg-brand-blue text-[15px] font-bold text-white hover:bg-brand-blue-dark"
      >
        {copy.nav.save}
      </button>
    </div>
  );
};

export default HeaderRegionMenu;
