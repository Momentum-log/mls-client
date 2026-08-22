"use client";

import React, { FC } from "react";
import { Languages } from "lucide-react";
import { useLandingCopy } from "@/hooks/use-landing-copy";

/**
 * EN | PL switch for the landing page's bilingual copy.
 *
 * Only the landing sections are translated, so the header renders this on the
 * home route alone — see `components/layout/header.tsx`.
 */
const LanguageToggle: FC = () => {
  const { language, setLanguage } = useLandingCopy();

  return (
    <div className="flex items-center gap-1.5 text-gray-500">
      <Languages className="h-4 w-4 opacity-80" aria-hidden="true" />
      <div className="flex items-center gap-0.5 text-[13.5px] font-semibold">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={
            language === "en"
              ? "px-1 font-bold text-brand-blue"
              : "px-1 font-normal text-gray-500 hover:text-brand-blue"
          }
        >
          EN
        </button>
        <span className="text-gray-300" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          onClick={() => setLanguage("pl")}
          aria-pressed={language === "pl"}
          className={
            language === "pl"
              ? "px-1 font-bold text-brand-blue"
              : "px-1 font-normal text-gray-500 hover:text-brand-blue"
          }
        >
          PL
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
