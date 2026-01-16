import { format } from "date-fns";
import { enGB } from "date-fns/locale";

/**
 * Formats a date string for tracking display.
 * Format: "15 May, 2026"
 * @param dateString - The ISO date string or Date object
 */
export const formatTrackingDate = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    // "15 may, 2026"
    return format(date, "dd MMM, yyyy", { locale: enGB }).toLowerCase();
  } catch (e) {
    console.error("Date formatting error:", e);
    return String(dateString);
  }
};

/**
 * Formats a time string for tracking display.
 * Format: "09:29pm" (12-hour format with lowercase am/pm)
 * @param dateString - The ISO date string or Date object
 */
export const formatTrackingTime = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    // "09:29pm"
    return format(date, "hh:mma", { locale: enGB }).toLowerCase();
  } catch (e) {
    console.error("Time formatting error:", e);
    return "";
  }
};

/**
 * Formats a date into a full tracking string.
 * Format: "15 may, 2026, 09:29pm"
 */
export const formatTrackingFull = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "N/A";
  const date = formatTrackingDate(dateString);
  const time = formatTrackingTime(dateString);
  return `${date}, ${time}`;
};
