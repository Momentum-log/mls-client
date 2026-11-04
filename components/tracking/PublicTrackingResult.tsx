"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";
import { TrackingResponse } from "@/types/shipping";
import { cn } from "@/utils/cn";
import { SITE_CONTACT } from "@/components/site/copy";
import {
  getProgress,
  getStatusBadgeClasses,
  getStatusLabel,
  isTerminalFailure,
  isUnpaid,
} from "@/utils/shipment-status";

interface PublicTrackingResultProps {
  data: TrackingResponse;
}

const STAGES = ["Booked and paid", "Picked up", "In transit", "Delivered"];

/** How many of the four journey stages are complete, from the MLS status. */
const stagesDone = (status: string): number => {
  const progress = getProgress(status);
  if (progress >= 100) return 4;
  if (progress >= 70) return 3;
  return 1;
};

const formatEventDate = (value: string): string =>
  value && !isNaN(Date.parse(value))
    ? format(new Date(value), "d MMM yyyy, HH:mm")
    : value;

export default function PublicTrackingResult({ data }: PublicTrackingResultProps) {
  const { shipment, timeline = [] } = data;
  const [copied, setCopied] = useState(false);

  if (!shipment) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
        <p className="font-semibold">Shipment details not found in response.</p>
        <p className="mt-1 text-sm">Please try again or contact support.</p>
      </div>
    );
  }

  const trackingNumber =
    shipment.customTrackingNumber || shipment.carrierTrackingNumber || "";

  if (isUnpaid(shipment.shipmentStatus)) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-8 text-center md:p-12">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning-bg text-warning-fg">
          <CreditCard className="h-8 w-8" aria-hidden="true" />
        </span>
        <span className="font-mono text-[13px] text-gray-500">{trackingNumber}</span>
        <h2 className="m-0 font-satoshi text-2xl font-bold text-gray-900">Awaiting payment</h2>
        <p className="m-0 max-w-md text-gray-600">
          This shipment has been created but not yet paid for. Carrier tracking
          details will be available once the payment is completed.
        </p>
        <Link
          href={`/login?redirect=/app/shipments/${shipment.id || trackingNumber}`}
          className="inline-flex h-12 items-center rounded-xl bg-brand-blue px-6 font-bold text-white no-underline hover:bg-brand-blue-dark"
        >
          Log in to pay
        </Link>
      </section>
    );
  }

  const status = shipment.shipmentStatus;
  const isError = isTerminalFailure(status);
  const done = stagesDone(status);
  const packageCount = shipment.packages?.length;

  const copyShareLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/track-shipment/${trackingNumber}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      aria-labelledby="st-h"
      className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[13px] text-gray-500">{trackingNumber}</span>
          <h2
            id="st-h"
            className="m-0 font-satoshi text-[26px] font-bold leading-8 tracking-[-0.02em] text-gray-900 sm:text-[30px] sm:leading-9"
          >
            {shipment.dropoffAddress?.city
              ? `Shipment to ${shipment.dropoffAddress.city}`
              : getStatusLabel(status)}
          </h2>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-bold",
            getStatusBadgeClasses(status),
          )}
        >
          {getStatusLabel(status)}
        </span>
      </div>

      {!isError && (
        <div aria-hidden="true" className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-1.5">
            {STAGES.map((stage, index) => (
              <span
                key={stage}
                className={cn(
                  "h-1.5 rounded-full",
                  index < done ? "bg-brand-blue" : "bg-gray-200",
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-[11px] font-semibold leading-4 text-gray-600 sm:text-[13px] sm:leading-[18px]">
            {STAGES.map((stage, index) => (
              <span key={stage} className={index === done - 1 ? "text-brand-blue" : ""}>
                {stage}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-8 border-t border-gray-100 pt-2">
        <ol className="m-0 flex min-w-0 flex-[999_1_420px] list-none flex-col p-0 pt-4">
          {timeline.length === 0 && (
            <li className="text-gray-500">No updates available yet.</li>
          )}
          {timeline.map((event, index) => {
            const isLatest = index === 0;
            const isLast = index === timeline.length - 1;
            return (
              <li key={`${event.date}-${index}`} className="flex gap-4">
                <span className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-1 h-3.5 w-3.5 rounded-full",
                      isLatest ? "bg-brand-blue ring-4 ring-blue-100" : "bg-blue-300",
                    )}
                  />
                  {!isLast && <span className="w-0.5 flex-1 bg-gray-200" />}
                </span>
                <span className={cn("flex flex-col gap-0.5", !isLast && "pb-6")}>
                  <strong className="text-base font-bold leading-[22px]">{event.status}</strong>
                  {event.description && (
                    <span className="text-sm text-gray-600">{event.description}</span>
                  )}
                  <span className="text-[13px] font-medium text-gray-500">
                    {formatEventDate(event.date)}
                    {event.location ? ` · ${event.location}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <aside className="flex flex-[1_1_260px] flex-col gap-4 pt-4">
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-sm">
            <dt className="text-gray-500">From</dt>
            <dd className="m-0 font-semibold">
              {shipment.pickupAddress.city}, {shipment.pickupAddress.countryCode}
            </dd>
            <dt className="text-gray-500">To</dt>
            <dd className="m-0 font-semibold">
              {shipment.dropoffAddress.city}, {shipment.dropoffAddress.countryCode}
            </dd>
            {shipment.serviceName && (
              <>
                <dt className="text-gray-500">Service</dt>
                <dd className="m-0 font-semibold">{shipment.serviceName}</dd>
              </>
            )}
            {!!packageCount && (
              <>
                <dt className="text-gray-500">Packages</dt>
                <dd className="m-0 font-semibold">{packageCount}</dd>
              </>
            )}
          </dl>
          <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-4">
            <strong className="text-[15px] font-bold">Need help with this parcel?</strong>
            <a
              href={`${SITE_CONTACT.whatsappHref}?text=${encodeURIComponent(`Tracking number: ${trackingNumber}`)}`}
              className="text-sm font-semibold text-brand-blue no-underline"
            >
              WhatsApp us with this number →
            </a>
            <a
              href={`mailto:${SITE_CONTACT.email}?subject=${encodeURIComponent(trackingNumber)}`}
              className="text-sm font-semibold text-brand-blue no-underline"
            >
              Email support →
            </a>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="h-11 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-foreground hover:border-brand-blue"
          >
            {copied ? "Link copied" : "Copy share link"}
          </button>
          <p className="m-0 text-xs text-gray-500">
            Full addresses and documents are visible only in your account.
          </p>
        </aside>
      </div>
    </section>
  );
}
