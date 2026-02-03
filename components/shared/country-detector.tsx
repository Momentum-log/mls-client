"use client";

import { useEffect } from "react";
import { useCountryStore } from "@/store/country-store";

/**
 * Country Detector Initializer Component.
 * Detects user's country via IP geolocation on first mount.
 * Renders nothing - just triggers the detection.
 */
export default function CountryDetector() {
  const { detectCountry, isDetected, isManualOverride } = useCountryStore();

  useEffect(() => {
    // Attempt detection on mount
    detectCountry();
  }, [detectCountry]);

  return null; // Renders nothing
}
