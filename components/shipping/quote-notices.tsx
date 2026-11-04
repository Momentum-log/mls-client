"use client";

import Link from "next/link";
import { FiZap } from "react-icons/fi";
import type { QuoteNotice } from "@/types/shipping";

interface QuoteNoticesProps {
  notices?: QuoteNotice[];
}

/**
 * Messages that come with a quote but are not bookable rates. Today: Momentum
 * express (Nigeria <-> EU) exists but has no online price yet, so the customer
 * is offered a way to ask for it instead.
 */
export default function QuoteNotices({ notices }: QuoteNoticesProps) {
  if (!notices?.length) return null;

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {notices.map((notice) => (
        <li
          key={notice.code}
          className="flex flex-col gap-3 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <FiZap className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <strong className="text-sm font-bold text-gray-900">
                Express shipping also available
              </strong>
              <span className="text-[13px] leading-[18px] text-gray-600">{notice.message}</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-brand-blue px-4 text-sm font-bold text-brand-blue no-underline hover:bg-brand-blue hover:text-white"
          >
            Contact us for express
          </Link>
        </li>
      ))}
    </ul>
  );
}
