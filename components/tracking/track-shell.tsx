"use client";

import React, { FC, useState } from "react";
import { CircleHelp } from "lucide-react";
import MarkerHeading from "@/components/landing/marker-heading";
import { SiteContainer } from "@/components/site/ui";
import { SITE_CONTACT } from "@/components/site/copy";

interface TrackShellProps {
  /** Called with the trimmed, uppercased tracking number. */
  onTrack: (trackingId: string) => void;
  defaultValue?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

/** Public tracking page frame: heading, search form, result and help notes. */
const TrackShell: FC<TrackShellProps> = ({
  onTrack,
  defaultValue = "",
  isLoading = false,
  children,
}) => {
  const [value, setValue] = useState(defaultValue);

  const submit = (event: React.FormEvent): void => {
    event.preventDefault();
    const id = value.trim().toUpperCase();
    if (id) onTrack(id);
  };

  return (
    <main className="pattern-grid min-h-screen bg-gray-50 font-satoshi text-foreground">
      <SiteContainer className="flex max-w-[1080px] flex-col gap-6 pb-24 pt-10">
        <div className="flex flex-col gap-4">
          <MarkerHeading
            marker="parcel"
            markerColor="sky"
            className="m-0 text-[38px] font-medium leading-[42px] text-gray-900 md:text-[44px] md:leading-[50px]"
          >
            Track a
          </MarkerHeading>
          <form
            onSubmit={submit}
            aria-label="Track a parcel"
            className="flex max-w-[640px] gap-2 rounded-2xl border border-gray-200 bg-white p-1.5"
          >
            <label htmlFor="tracking-number" className="sr-only">
              Tracking number
            </label>
            <input
              id="tracking-number"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Starts with MLS-"
              className="h-11 min-w-0 flex-1 bg-transparent px-3 font-mono text-base text-foreground outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !value.trim()}
              className="inline-flex h-11 items-center rounded-[10px] bg-foreground px-5 text-[15px] font-bold text-white disabled:opacity-50"
            >
              {isLoading ? "Tracking..." : "Track"}
            </button>
          </form>
        </div>

        {children}

        <section aria-label="Tracking help" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex gap-3.5 rounded-[20px] bg-warning-bg p-[18px] text-sm text-warning-fg">
            <span>
              <strong>Unpaid shipments</strong> show as awaiting payment, with a
              link to finish paying once you sign in.
            </span>
          </div>
          <div className="flex gap-3.5 rounded-[20px] border border-gray-200 bg-white p-[18px] text-sm text-gray-700">
            <CircleHelp className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
            <span>
              <strong>Number not found?</strong> Check it starts with MLS- and has
              no spaces. Still stuck? WhatsApp {SITE_CONTACT.phone}.
            </span>
          </div>
        </section>
      </SiteContainer>
    </main>
  );
};

export default TrackShell;
