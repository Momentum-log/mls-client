"use client";

import { FiHome, FiMapPin } from "react-icons/fi";
import type { HandoverPreference } from "@/types/shipping";
import { defaultPickup, earliestPickupDate } from "@/utils/handover";

interface HandoverChoiceProps {
  value: HandoverPreference;
  onChange: (value: HandoverPreference) => void;
  problem: string | null;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";

/**
 * "How will the parcel leave you?" on the review step, before paying.
 *
 * The answer is saved with the shipment. When our team books the label by
 * hand they book this; otherwise it is the starting point on the shipment
 * page after payment.
 */
export default function HandoverChoice({
  value,
  onChange,
  problem,
}: HandoverChoiceProps) {
  const isPickup = value.method === "PICKUP";

  const card = (selected: boolean) =>
    `flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
      selected
        ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue"
        : "border-gray-200 hover:border-brand-blue/50"
    }`;

  return (
    <fieldset className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
      <legend className="sr-only">How will the parcel leave you?</legend>

      <label className={card(!isPickup)}>
        <input
          type="radio"
          name="handover"
          value="DROPOFF"
          className="mt-1 w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
          checked={!isPickup}
          onChange={() => onChange({ method: "DROPOFF" })}
        />
        <FiMapPin className="mt-0.5 w-5 h-5 text-brand-blue shrink-0" aria-hidden />
        <span>
          <span className="block text-sm font-bold text-gray-900">
            I&apos;ll drop it off
          </span>
          <span className="block text-xs text-gray-500 mt-1">
            Take the parcel to a drop-off point near you.
          </span>
        </span>
      </label>

      <label className={card(isPickup)}>
        <input
          type="radio"
          name="handover"
          value="PICKUP"
          className="mt-1 w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
          checked={isPickup}
          onChange={() => onChange(isPickup ? value : defaultPickup())}
        />
        <FiHome className="mt-0.5 w-5 h-5 text-brand-blue shrink-0" aria-hidden />
        <span>
          <span className="block text-sm font-bold text-gray-900">
            Courier picks it up from my address
          </span>
          <span className="block text-xs text-gray-500 mt-1">
            Choose a day and when the parcel will be ready.
          </span>
        </span>
      </label>

      {isPickup && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
              Pickup day
            </span>
            <input
              type="date"
              className={inputClass}
              min={earliestPickupDate()}
              value={value.pickupDate ?? ""}
              onChange={(e) => onChange({ ...value, pickupDate: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
              Ready from
            </span>
            <input
              type="time"
              className={inputClass}
              value={value.readyTime ?? ""}
              onChange={(e) => onChange({ ...value, readyTime: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
              Until
            </span>
            <input
              type="time"
              className={inputClass}
              value={value.closeTime ?? ""}
              onChange={(e) => onChange({ ...value, closeTime: e.target.value })}
            />
          </label>
        </div>
      )}

      {problem && (
        <p role="alert" className="text-xs font-bold text-red-600">
          {problem}
        </p>
      )}
    </fieldset>
  );
}
