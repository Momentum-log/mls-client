/**
 * Core country resolution and logging utilities for Address-Based Country Override.
 *
 * @module utils/address-country-helper
 */



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

export function getUserCountryCode(
  browserCountryCode: string,
  fallbackCountryCode?: string
): string {
  // Use browser country code if available and valid (not empty and not "EU")
  if (browserCountryCode && browserCountryCode !== "EU") {
    logResolution("info", "Using browser country code.", {
      mode: "BROWSER",
      browserCountry: browserCountryCode,
      resolvedCountry: browserCountryCode,
    });
    return browserCountryCode;
  }

  // Fallback to pickup/sender country code if browser detection is not allowed or not available
  if (fallbackCountryCode) {
    logResolution("info", "Browser country not available. Using fallback/pickup country code.", {
      mode: "FALLBACK",
      browserCountry: browserCountryCode || "",
      resolvedCountry: fallbackCountryCode,
    });
    return fallbackCountryCode;
  }

  // Final fallback to US
  logResolution("warn", "Neither browser nor fallback country available. Defaulting to US.", {
    mode: "DEFAULT",
    browserCountry: browserCountryCode || "",
    resolvedCountry: "US",
  });
  return "US";
}
