import CryptoJS from "crypto-js";
import { StateStorage } from "zustand/middleware";

const SECRET_KEY = "MLS-2026"; // User provided key
const PERSISTENCE_KEY = "MLS_PERSISTENCE_PREF"; // key to store preference

type PersistenceType = "session" | "local";

// Helper for Encryption
export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption failed", error);
    return data;
  }
};

// Helper for Decryption
export const decryptData = (ciphertext: string): string => {
  try {
    // Legacy support: If data looks like JSON, it's not encrypted.
    // We should return empty string to treat it as invalid/expired session
    // forcing a fresh login which will then save encrypted data.
    if (
      !ciphertext ||
      ciphertext.startsWith("{") ||
      ciphertext.startsWith("[")
    ) {
      return "";
    }

    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // If decryption produced valid bytes but result is empty/null which is rare,
    // or if the original text is not valid UTF-8 (caught below usually).
    return originalText;
  } catch (error) {
    // console.error("Decryption failed", error);
    return "";
  }
};

// Manage Persistence Preference
export const setPersistencePreference = (type: PersistenceType) => {
  if (typeof window !== "undefined") {
    // We store the preference itself in localStorage so we know where to look on reload
    // OR we check both on load. Checking both is safer.
    // However, we need to know where to WRITE.
    localStorage.setItem(PERSISTENCE_KEY, type);
  }
};

export const getPersistencePreference = (): PersistenceType => {
  if (typeof window === "undefined") return "session";
  return (
    (localStorage.getItem(PERSISTENCE_KEY) as PersistenceType) || "session"
  );
};

// Zustand StateStorage Implementation with Encryption
export const secureStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;

    let value = localStorage.getItem(name) || sessionStorage.getItem(name);

    if (!value) return null;

    // Detect if value is encrypted (basic check) or just try decrypting
    // Zustand persist expects JSON string usually.
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
