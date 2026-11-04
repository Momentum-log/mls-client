"use client";

import Link from "next/link";
import { FiMessageCircle, FiZap } from "react-icons/fi";
import type { QuoteNotice } from "@/types/shipping";

interface QuoteNoticesProps {
  notices?: QuoteNotice[];
}

const COPY: Record<QuoteNotice["code"], { title: string; action: string }> = {
  EXPRESS_ON_REQUEST: {
    title: "Express shipping also available",
    action: "Contact us for express",
  },
  QUOTE_ON_REQUEST: {
    title: "Request a quote",
    action: "Request a quote",
  },
};

/** True when the quote has no price on purpose and asks for a quote instead. */
export const needsQuoteRequest = (notices?: QuoteNotice[]) =>
  !!notices?.some((n) => n.code === "QUOTE_ON_REQUEST");

/**
 * Messages that come with a quote but are not bookable rates (Momentum,
 * Nigeria <-> EU): express on request, or "request a quote" for shipments
 * over the online weight limit. The button opens a WhatsApp chat with support
 * when the server sends one, otherwise the contact page.
 */
export default function QuoteNotices({ notices }: QuoteNoticesProps) {
  if (!notices?.length) return null;

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {notices.map((notice) => {
        const copy = COPY[notice.code] ?? COPY.EXPRESS_ON_REQUEST;
        const Icon = notice.code === "QUOTE_ON_REQUEST" ? FiMessageCircle : FiZap;
        const buttonClass =
          "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-brand-blue px-4 text-sm font-bold text-brand-blue no-underline hover:bg-brand-blue hover:text-white";
        return (
          <li
            key={notice.code}
            className="flex flex-col gap-3 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
              <div className="flex flex-col gap-0.5">
                <strong className="text-sm font-bold text-gray-900">{copy.title}</strong>
                <span className="text-[13px] leading-[18px] text-gray-600">{notice.message}</span>
              </div>
            </div>
            {notice.contactUrl ? (
              <a href={notice.contactUrl} target="_blank" rel="noreferrer" className={buttonClass}>
                {copy.action} on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link href="/contact" className={buttonClass}>
                {copy.action}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
