/**
 * ISO-8601 duration helpers.
 *
 * The carrier's `accessTime` is a duration (`PT1H30M`) — the minimum window a
 * courier needs to be able to collect. It is a length of time, not a moment,
 * and rendering it on a clock reads as "the driver arrives at 01:30".
 */

export interface Duration {
  hours: number;
  minutes: number;
}

const ISO_DURATION = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

/**
 * Parses an ISO-8601 duration into hours and minutes.
 *
 * @returns `null` when the input is absent or unparseable, so callers can omit
 * the constraint rather than silently applying a wrong one.
 */
export const parseDuration = (value?: string | null): Duration | null => {
  if (!value) return null;

  const match = ISO_DURATION.exec(value.trim().toUpperCase());
  if (!match) return null;

  const [, days, hours, minutes, seconds] = match;
  if (!days && !hours && !minutes && !seconds) return null;

  const totalMinutes =
    Number(days ?? 0) * 24 * 60 +
    Number(hours ?? 0) * 60 +
    Number(minutes ?? 0) +
    Math.floor(Number(seconds ?? 0) / 60);

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
};

export const durationToMinutes = (duration: Duration): number =>
  duration.hours * 60 + duration.minutes;

/** "2 hours 30 minutes", for display beside a time picker. */
export const formatDuration = (duration: Duration): string => {
  const parts: string[] = [];

  if (duration.hours > 0) {
    parts.push(`${duration.hours} hour${duration.hours === 1 ? "" : "s"}`);
  }
  if (duration.minutes > 0) {
    parts.push(`${duration.minutes} minute${duration.minutes === 1 ? "" : "s"}`);
  }

  return parts.length > 0 ? parts.join(" ") : "0 minutes";
};

/** Minutes since midnight for an `HH:MM` or `HH:MM:SS` clock time. */
export const timeToMinutes = (time: string): number => {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
};
