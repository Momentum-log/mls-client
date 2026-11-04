"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/ui/phone-input";
import { useAuthStore } from "@/store/auth-store";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import QuoteResults from "@/components/shipping/quote-results";
import { useGetShippingQuote } from "@/hooks/shipments/use-shipments";
import { useCountryStore } from "@/store/country-store";
import { getOrSetGuestId } from "@/utils/auth-helper";
import { handleApiError } from "@/utils/error-handler";
import {
  getEstimatePayload,
  transformShippingData,
} from "@/app/(marketing)/shipping-estimate/utils";
import type { SupportedCurrency } from "@/types/country";
import type { PlaceDetails } from "@/types/location";
import type { SiteCopy } from "@/components/site/copy";
import { localePath, type SiteLocale } from "@/utils/site-locale";

const PRESETS = [
  { id: "envelope", dims: { length: 35, width: 25, height: 2 }, weight: 0.5 },
  { id: "small", dims: { length: 30, width: 20, height: 15 }, weight: 2 },
  { id: "medium", dims: { length: 40, width: 30, height: 30 }, weight: 8 },
  { id: "large", dims: { length: 60, width: 40, height: 40 }, weight: 20 },
] as const;

type PresetId = (typeof PRESETS)[number]["id"];
type Tab = "quote" | "track";

const CURRENCIES: SupportedCurrency[] = ["PLN", "EUR"];

/** Shortest plausible international number, in digits without the `+`. */
const MIN_PHONE_DIGITS = 7;

/** Address as the quote API wants it; the visitor only ever sees the street. */
const toLocation = (place: PlaceDetails) => ({
  countryCode: place.countryCode,
  stateOrProvinceCode: place.stateCode,
  city: place.city,
  postalCode: place.zip,
  streetLines: [place.street || place.formattedAddress],
});

interface AddressFieldProps {
  label: string;
  placeholder: string;
  onSelect: (place: PlaceDetails | null) => void;
}

/** Google Places field that shows the street and hands the full place upward. */
const AddressField: FC<AddressFieldProps> = ({ label, placeholder, onSelect }) => {
  const [text, setText] = useState("");
  return (
    <LocationAutocomplete
      label={label}
      placeholder={placeholder}
      value={text}
      onChange={(value) => {
        setText(value);
        onSelect(null); // typed text no longer matches the chosen place
      }}
      onPlaceSelect={(place) => {
        setText(place.street || place.formattedAddress);
        onSelect(place);
      }}
    />
  );
};

interface BookingPanelProps {
  copy: SiteCopy["home"]["panel"];
  locale: SiteLocale;
}

/**
 * Quote-or-track panel under the home hero. The quote tab prices the trip in
 * place: two Places addresses plus a package size go straight to the quote API.
 */
const BookingPanel: FC<BookingPanelProps> = ({ copy, locale }) => {
  const router = useRouter();
  const { currency, setCurrency, countryCode } = useCountryStore();
  const { mutate: getQuote, data, isPending, reset } = useGetShippingQuote();
  const { user } = useAuthStore();

  const [tab, setTab] = useState<Tab>("quote");
  const [pickup, setPickup] = useState<PlaceDetails | null>(null);
  const [dropoff, setDropoff] = useState<PlaceDetails | null>(null);
  const [preset, setPreset] = useState<PresetId>("small");
  // Guest estimates need a contact; signed-in customers start with their own.
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");

  const quote = data ? transformShippingData(data) : undefined;

  const seePrices = (event: React.FormEvent): void => {
    event.preventDefault();
    if (!pickup || !dropoff) {
      setError(copy.pickAddresses);
      return;
    }
    if (phone.replace(/\D/g, "").length < MIN_PHONE_DIGITS) {
      setError(copy.phoneRequired);
      return;
    }
    setError(null);
    const size = PRESETS.find((p) => p.id === preset) ?? PRESETS[1];
    const payload = getEstimatePayload(
      {
        ...toLocation(pickup),
        email: email.trim(),
        phoneNumber: phone,
        // A signed-in customer is the sender; a guest gives no name (W2a).
        personName: user?.name,
      },
      toLocation(dropoff),
      [
        {
          weight: { value: size.weight, units: "KG" },
          dimensions: { ...size.dims, units: "CM" },
        },
      ],
      getOrSetGuestId(),
      countryCode || undefined,
      undefined,
      currency,
    );
    getQuote(payload, {
      onError: (quoteError) => setError(handleApiError(quoteError).message),
    });
  };

  const track = (event: React.FormEvent): void => {
    event.preventDefault();
    const id = trackingId.trim().toUpperCase();
    if (id) router.push(`/track-shipment/${encodeURIComponent(id)}`);
  };

  /** A changed input makes the shown prices stale. */
  const changed = (apply: () => void) => (): void => {
    apply();
    reset();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "quote", label: copy.tabQuote },
    { id: "track", label: copy.tabTrack },
  ];

  return (
    <div className="flex flex-col gap-[18px] rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-900/15 sm:px-6 sm:pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={copy.tabsLabel}
          className="grid w-full grid-cols-2 gap-1 rounded-[14px] bg-gray-100 p-1 sm:inline-flex sm:w-auto"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === tab}
              onClick={() => setTab(item.id)}
              className={cn(
                "h-10 rounded-[10px] px-[18px] text-[15px] font-bold",
                item.id === tab ? "bg-white text-brand-blue shadow-sm" : "text-gray-700",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {tab === "quote" && (
          <div role="group" aria-label={copy.currency} className="inline-flex rounded-full bg-gray-100 p-[3px]">
            {CURRENCIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={changed(() => setCurrency(code))}
                aria-pressed={code === currency}
                className={cn(
                  "h-8 min-w-[52px] rounded-full px-3 text-[13px] font-bold",
                  code === currency ? "bg-white text-brand-blue" : "text-gray-600",
                )}
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "quote" ? (
        <>
          <form onSubmit={seePrices} className="flex flex-col gap-[18px]">
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2">
              <AddressField
                label={copy.pickup}
                placeholder={copy.addressPlaceholder}
                onSelect={(place) => changed(() => setPickup(place))()}
              />
              <AddressField
                label={copy.dropoff}
                placeholder={copy.addressPlaceholder}
                onSelect={(place) => changed(() => setDropoff(place))()}
              />
            </div>
            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Input
                label={copy.email}
                type="email"
                required
                autoComplete="email"
                placeholder={copy.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <label htmlFor="quick-quote-phone" className="mb-2 block text-sm font-semibold text-gray-700">
                  {copy.phone}
                </label>
                <PhoneInput id="quick-quote-phone" value={phone} onChange={(value) => setPhone(value)} />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 text-base font-bold text-white hover:bg-brand-blue-dark disabled:opacity-60"
              >
                {copy.seePrices}
                <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </div>
            <fieldset className="m-0 flex flex-wrap items-center gap-2 border-0 p-0">
              <legend className="float-left mr-1 p-0 text-[13px] font-semibold text-gray-500">
                {copy.quickSizes}:
              </legend>
              {PRESETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === preset}
                  onClick={changed(() => setPreset(item.id))}
                  className={cn(
                    "h-9 rounded-full px-3 text-[13px] font-semibold",
                    item.id === preset
                      ? "border-2 border-brand-blue bg-brand-blue-tint text-brand-blue"
                      : "border border-gray-200 bg-white text-gray-700",
                  )}
                >
                  {copy.presets[item.id]} · {item.dims.length}×{item.dims.width}×{item.dims.height} cm ·{" "}
                  {item.weight} kg
                </button>
              ))}
              <span className="text-[13px] text-gray-500">
                {copy.heavy}{" "}
                <Link
                  href={`${localePath(locale, "/freight")}#enquiry`}
                  className="font-bold text-brand-blue"
                >
                  {copy.heavyLink}
                </Link>
              </span>
            </fieldset>
            {error && (
              <p role="alert" className="m-0 rounded-xl bg-warning-bg px-3.5 py-3 text-sm font-medium text-warning-fg">
                {error}
              </p>
            )}
          </form>
          {(isPending || quote) && (
            <QuoteResults
              rates={quote?.rates}
              errors={quote?.errors}
              hasResult={!!quote}
              isLoading={isPending}
              onReviewAddresses={() => reset()}
            />
          )}
        </>
      ) : (
        <form onSubmit={track} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-[1_1_420px]">
              <Input
                label={copy.trackingLabel}
                placeholder={copy.trackingPlaceholder}
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="flex h-12 flex-1 items-center justify-center rounded-xl bg-foreground px-7 text-base font-bold text-white sm:flex-none"
            >
              {copy.track}
            </button>
          </div>
          <p className="m-0 text-[13px] text-gray-500">{copy.trackHint}</p>
        </form>
      )}
    </div>
  );
};

export default BookingPanel;
