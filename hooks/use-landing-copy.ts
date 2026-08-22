"use client";

/**
 * Resolves the active landing-page copy dictionary.
 *
 * Wraps `useLanguageStore` and guards against a hydration mismatch: the store is
 * persisted to `sessionStorage`, which is unavailable during SSR, so the server
 * always renders English. Until the persisted value has rehydrated on the client
 * we return English too, then switch to the stored preference. Without this, a
 * visitor who had selected Polish would trigger a React hydration error on every
 * reload.
 *
 * Rehydration is read through `useSyncExternalStore` — zustand's persist
 * middleware is exactly the kind of external store it exists for, and it avoids
 * the cascading render of a `setState`-in-effect mounted flag.
 *
 * @module hooks/use-landing-copy
 */

import { useSyncExternalStore } from "react";
import { useLanguageStore } from "@/store/language-store";
import {
  LANDING_COPY,
  Language,
  LandingCopy,
} from "@/components/landing/translations";

/** Subscribes to the persist middleware finishing rehydration. */
const subscribeToHydration = (onStoreChange: () => void): (() => void) =>
  useLanguageStore.persist.onFinishHydration(onStoreChange);

const getHydrationSnapshot = (): boolean =>
  useLanguageStore.persist.hasHydrated();

/** The server never has `sessionStorage`, so it is never hydrated. */
const getServerHydrationSnapshot = (): boolean => false;

interface UseLandingCopyResult {
  /** Strings for the active language. */
  copy: LandingCopy;
  /** The active language, or `"en"` before client rehydration completes. */
  language: Language;
  /** Switches the landing-page language. */
  setLanguage: (language: Language) => void;
}

/**
 * @returns The active landing copy plus the language setter.
 */
export const useLandingCopy = (): UseLandingCopyResult => {
  const { language, setLanguage } = useLanguageStore();

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const activeLanguage: Language = isHydrated ? language : "en";

  return {
    copy: LANDING_COPY[activeLanguage],
    language: activeLanguage,
    setLanguage,
  };
};
