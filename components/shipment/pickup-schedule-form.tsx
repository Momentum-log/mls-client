"use client";

import React, { useMemo, useState } from "react";
import {
  PickupAvailability,
  PICKUP_REMARKS_MAX_LENGTH,
  RequestPickupPayload,
} from "@/types/shipping";
import {
  formatDuration,
  parseDuration,
  timeToMinutes,
} from "@/utils/duration";
import {
  FiCalendar,
  FiMessageSquare,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import Button from "@/components/ui/button";

interface PickupScheduleFormProps {
  availability: PickupAvailability;
  onSubmit: (payload: RequestPickupPayload) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const toClock = (time: string) => time.slice(0, 5);
const toSeconds = (time: string) => `${time}:00`;

/**
 * Schedules a courier collection against the carrier's real availability.
 *
 * Every constraint here comes from the carrier: the selectable dates, the
 * cutoff, and the minimum window the driver needs. Nothing is generated
 * locally — a date we invent is a date the carrier will reject at booking,
 * with no explanation the customer can act on.
 */
export default function PickupScheduleForm({
  availability,
  onSubmit,
  onCancel,
  isSubmitting,
}: PickupScheduleFormProps) {
  const [scheduledDate, setScheduledDate] = useState(
    availability.availableDates[0] ?? "",
  );
  const [readyTime, setReadyTime] = useState(
    toClock(availability.defaultReadyTime || "09:00:00"),
  );
  const [closeTime, setCloseTime] = useState(
    toClock(availability.cutoffTime || "17:00:00"),
  );
  const [remarks, setRemarks] = useState("");

  const accessTime = useMemo(
    () => parseDuration(availability.accessTime),
    [availability.accessTime],
  );

  const validationError = useMemo(() => {
    if (!scheduledDate) return "Choose a pickup date.";

    const ready = timeToMinutes(readyTime);
    const close = timeToMinutes(closeTime);

    if (ready >= close) {
      return "The ready time must be earlier than the close time.";
    }

    // `accessTime` is how long the courier needs the window to be, not a
    // time of day. A window shorter than this is refused by the carrier.
    if (accessTime) {
      const required = accessTime.hours * 60 + accessTime.minutes;
      if (close - ready < required) {
        return `The collection window must be at least ${formatDuration(accessTime)} long.`;
      }
    }

    if (availability.cutoffTime) {
      const cutoff = timeToMinutes(availability.cutoffTime);
      if (ready > cutoff) {
        return `The parcel must be ready by ${toClock(availability.cutoffTime)} for this date.`;
      }
    }

    return null;
  }, [scheduledDate, readyTime, closeTime, accessTime, availability.cutoffTime]);

  const remarksTooLong = remarks.length > PICKUP_REMARKS_MAX_LENGTH;
  const canSubmit = !validationError && !remarksTooLong && !isSubmitting;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      scheduledDate,
      readyTime: toSeconds(readyTime),
      closeTime: toSeconds(closeTime),
      remarks: remarks.trim() || undefined,
    });
  };

  return (
    <div className="space-y-4 bg-brand-blue/5 border border-brand-blue/15 p-4 rounded-2xl animate-in fade-in duration-200">
      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
        <FiCalendar className="w-4 h-4 text-brand-blue" />
        Schedule a Courier Pickup
      </h4>

      {validationError && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          <FiAlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Pickup Date
          </label>
          <select
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          >
            {availability.availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Package Ready From
          </label>
          <input
            type="time"
            value={readyTime}
            onChange={(e) => setReadyTime(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Available Until
          </label>
          <input
            type="time"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>

      {accessTime && (
        <p className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <FiInfo className="w-3.5 h-3.5 shrink-0" />
          The courier needs a window of at least {formatDuration(accessTime)}.
        </p>
      )}

      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
          <FiMessageSquare className="w-3.5 h-3.5 text-gray-500" />
          Driver Instructions (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Reception desk, ring bell 2B"
          maxLength={PICKUP_REMARKS_MAX_LENGTH}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
        />
        {/*
          The carrier rejects anything longer rather than truncating it, and
          silently dropping half an instruction the customer believes was
          passed on is worse than telling them.
        */}
        <p
          className={`text-[10px] font-medium mt-1 text-right ${
            remarksTooLong ? "text-red-600" : "text-gray-400"
          }`}
        >
          {remarks.length}/{PICKUP_REMARKS_MAX_LENGTH}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="text-xs py-2.5 px-4"
        >
          {isSubmitting ? "Booking pickup..." : "Confirm Pickup"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs text-gray-500 font-bold"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
