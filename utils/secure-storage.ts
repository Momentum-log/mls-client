import { StateStorage } from "zustand/middleware";

const PERSISTENCE_KEY = "MLS_PERSISTENCE_PREF"; // key to store preference

type PersistenceType = "session" | "local";

// Helper for Encoding (Base64) - Replaces unstable AES in this environment
// Note: Client-side static key encryption provides only obfuscation, not true security.
// Base64 is sufficient for obfuscating state in localStorage.
export const encryptData = (data: string): string => {
  try {
    if (!data) return "";
    return typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(data)))
      : Buffer.from(data).toString("base64");
  } catch (error) {
    console.warn("Encoding failed", error);
    return data;
  }
};

// Helper for Decoding
export const decryptData = (ciphertext: string): string => {
  try {
    if (!ciphertext) return "";

    // Legacy support: If data looks like JSON, it's not encoded.
    if (ciphertext.startsWith("{") || ciphertext.startsWith("[")) {
      return ciphertext;
    }

    // Check for explicit base64 prefix if we used one (optional, but handling generic b64 here)
    const payload = ciphertext.startsWith("b64:")
      ? ciphertext.substring(4)
      : ciphertext;

    return typeof window !== "undefined"
      ? decodeURIComponent(escape(window.atob(payload)))
      : Buffer.from(payload, "base64").toString();
  } catch (error) {
    console.warn("Decoding failed, clearing data", error);
    return "";
  }
};

// Manage Persistence Preference
export const setPersistencePreference = (type: PersistenceType) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PERSISTENCE_KEY, type);
  }
};

export const getPersistencePreference = (): PersistenceType => {
  if (typeof window === "undefined") return "session";
  return (
    (localStorage.getItem(PERSISTENCE_KEY) as PersistenceType) || "session"
  );
};

// Zustand StateStorage Implementation
export const secureStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;

    const value = localStorage.getItem(name) || sessionStorage.getItem(name);

    if (!value) return null;

    const decrypted = decryptData(value);
    return decrypted || null;
  },

  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;

    const encrypted = encryptData(value);
    const type = getPersistencePreference();

    if (type === "local") {
      localStorage.setItem(name, encrypted);
      sessionStorage.removeItem(name); // Clean up other valid to avoid confusion
    } else {
      sessionStorage.setItem(name, encrypted);
      localStorage.removeItem(name);
    }
  },

  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};
