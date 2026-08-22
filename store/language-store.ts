/**
 * Landing-page language state.
 *
 * The marketing landing page ships bilingual copy (English / Polish) and a
 * header toggle. Only the landing sections are translated — the shared nav,
 * footer and FAQ remain English — so this store is deliberately narrow and is
 * read exclusively by `components/landing/*` and the header toggle.
 *
 * Persisted to `sessionStorage` (not `localStorage`) to match the convention
 * established by `store/country-store.ts`: a per-tab preference that does not
 * outlive the browsing session.
 *
 * @module store/language-store
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Language } from "@/components/landing/translations";

/** Shape of the language store. */
export interface LanguageStore {
  /** Currently selected landing-page language. Defaults to English. */
  language: Language;
  /** Switches the landing-page language. */
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "mls-landing-language",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
