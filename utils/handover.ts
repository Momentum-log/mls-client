/**
 * Pickup or drop-off, chosen on the review step before paying.
 *
 * Kept out of the component so the rules match the server's
 * `HandoverPreferenceSchema` in one readable place.
 */

import type { HandoverPreference } from "@/types/shipping";

/** Local calendar date as YYYY-MM-DD (not UTC, which can be yesterday). */
export const toLocalIsoDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/** The first day a courier can be asked for: the next weekday after today. */
export const earliestPickupDate = (today = new Date()): string => {
  const next = new Date(today);
  do {
    next.setDate(next.getDate() + 1);
  } while (next.getDay() === 0 || next.getDay() === 6);
  return toLocalIsoDate(next);
};

export const defaultHandover = (): HandoverPreference => ({
  method: "DROPOFF",
});

export const defaultPickup = (today = new Date()): HandoverPreference => ({
  method: "PICKUP",
  pickupDate: earliestPickupDate(today),
  readyTime: "09:00",
  closeTime: "17:00",
});

/** What is wrong with the choice, in the customer's words, or null. */
export const handoverProblem = (
  value: HandoverPreference | null,
  today = new Date(),
): string | null => {
  if (!value) return "Choose how the parcel will leave you.";
  if (value.method === "DROPOFF") return null;
  if (!value.pickupDate || !value.readyTime || !value.closeTime) {
    return "Choose a pickup day and a time window.";
  }
  if (value.pickupDate < earliestPickupDate(today)) {
    return "Pick a day from the next working day onwards.";
  }
  if (value.readyTime >= value.closeTime) {
    return "The pickup window must end after it starts.";
  }
  return null;
};

/** Only the fields the server expects for the chosen method. */
export const toHandoverPayload = (
  value: HandoverPreference,
): HandoverPreference =>
  value.method === "DROPOFF"
    ? { method: "DROPOFF", ...(value.notes ? { notes: value.notes } : {}) }
    : value;
