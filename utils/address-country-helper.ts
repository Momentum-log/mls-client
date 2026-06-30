/**
 * Core country resolution and logging utilities for Address-Based Country Override.
 *
 * @module utils/address-country-helper
 */

import { User } from "@/types/auth";
import {
  getUseAddressCountryMode,
} from "./feature-flags";

/**
 * Error thrown when strict ENABLED mode is active but the user has no verified address.
 */
export class MissingAddressError extends Error {
  constructor(message = "Address verification required") {
    super(message);
    this.name = "MissingAddressError";
    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingAddressError);
    }
  }
}

export interface AddressResolutionLog {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context: {
    userId?: string;
    mode: string;
    addressCountry?: string;
    browserCountry: string;
    resolvedCountry: string;
  };
}

const LOG_STORAGE_KEY = "mls_address_resolution_logs";

/**
 * Internal helper to write a log entry to sessionStorage (browser-only).
 */
function logResolution(
  level: AddressResolutionLog["level"],
  message: string,
  context: AddressResolutionLog["context"]
) {
  if (typeof window === "undefined" || !window.sessionStorage) {
    // Fallback console log for Server-Side / Node.js
    console.log(`[AddressResolution] [${level.toUpperCase()}] ${message}`, JSON.stringify(context));
    return;
  }

  try {
    const rawLogs = window.sessionStorage.getItem(LOG_STORAGE_KEY);
    const logs: AddressResolutionLog[] = rawLogs ? JSON.parse(rawLogs) : [];
    
    // Add new log
    logs.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    });

    // Keep last 100 logs to prevent unbounded storage growth
    if (logs.length > 100) {
      logs.shift();
    }

    window.sessionStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error("Failed to save address resolution log:", err);
  }
}

/**
 * Prints the stored address resolution logs to the browser console.
 */
export function printAddressResolutionLogs(): void {
  if (typeof window === "undefined" || !window.sessionStorage) {
    console.log("Session storage is not available in this environment.");
    return;
  }

  try {
    const rawLogs = window.sessionStorage.getItem(LOG_STORAGE_KEY);
    if (!rawLogs) {
      console.log("No address resolution logs found.");
      return;
    }

    const logs: AddressResolutionLog[] = JSON.parse(rawLogs);
    console.group("📍 MLS Address Resolution Logs");
    logs.forEach((log) => {
      const color =
        log.level === "error"
          ? "color: red; font-weight: bold"
          : log.level === "warn"
            ? "color: orange; font-weight: bold"
            : log.level === "info"
              ? "color: blue"
              : "color: gray";
      console.log(
        `%c[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`,
        color,
        log.context
      );
    });
    console.groupEnd();
  } catch (err) {
    console.error("Failed to print logs:", err);
  }
}

/**
 * Resolves the country code for an operation based on active USE_ADDRESS_COUNTRY mode,
 * user profile, and browser fallback.
 *
 * @param user - Authenticated user object or null
 * @param browserCountryCode - Fallback country code detected from browser/session
 * @returns The resolved country code (e.g., 'PL', 'US')
 * @throws MissingAddressError if in strict ENABLED mode and user has no approved/verified address
 */
export function getUserCountryCode(
  user: User | null,
  browserCountryCode: string
): string {
  const mode = getUseAddressCountryMode();
  const userId = user?.id;
  const addressCountry = user?.address?.country;
  // User verified check: in some systems verification depends on status or approved verified fields
  const hasApprovedAddress = user?.addressRequestStatus === "APPROVED" || !!user?.addressVerifiedAt || !!addressCountry;

  let resolvedCountry = browserCountryCode;
  let logLevel: AddressResolutionLog["level"] = "info";
  let message = "";

  try {
    if (mode === "DISABLED") {
      resolvedCountry = browserCountryCode;
      message = "Address override disabled. Using browser country.";
    } else if (mode === "ENABLED") {
      if (!addressCountry || !hasApprovedAddress) {
        logLevel = "error";
        message = "Strict mode enabled but user has no verified address. Throwing MissingAddressError.";
        logResolution(logLevel, message, {
          userId,
          mode,
          addressCountry,
          browserCountry: browserCountryCode,
          resolvedCountry: "",
        });
        throw new MissingAddressError("Address verification required");
      }
      resolvedCountry = addressCountry;
      message = "Strict mode enabled. Using verified address country.";
    } else if (mode === "AUTO") {
      if (addressCountry && hasApprovedAddress) {
        resolvedCountry = addressCountry;
        message = "Auto mode enabled. Using verified address country.";
      } else {
        resolvedCountry = browserCountryCode;
        logLevel = "warn";
        message = "Auto mode enabled but no verified address found. Falling back to browser country.";
      }
    } else {
      // Fallback for unexpected modes
      resolvedCountry = browserCountryCode;
      logLevel = "warn";
      message = `Unknown mode '${mode}'. Falling back to browser country.`;
    }

    logResolution(logLevel, message, {
      userId,
      mode,
      addressCountry,
      browserCountry: browserCountryCode,
      resolvedCountry,
    });

    return resolvedCountry;
  } catch (error) {
    if (error instanceof MissingAddressError) {
      throw error;
    }
    // Fallback resolve
    logResolution("error", `Unexpected resolution error: ${(error as Error).message}. Falling back to browser country.`, {
      userId,
      mode,
      addressCountry,
      browserCountry: browserCountryCode,
      resolvedCountry: browserCountryCode,
    });
    return browserCountryCode;
  }
}
