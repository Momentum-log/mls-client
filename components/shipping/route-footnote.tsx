"use client";

import React, { FC } from "react";
import { useSiteLocale } from "@/hooks/use-site-locale";
import type { RouteFootnote as Footnote } from "@/types/shipping";

interface RouteFootnoteProps {
  footnote?: Footnote;
  /** Shown under the route footnote when the quote is reverse charge. */
  reverseCharge?: Footnote;
  className?: string;
}

/**
 * The route's VAT and customs wording, in the site language. The server sends
 * both languages; the text is never edited here.
 */
const RouteFootnote: FC<RouteFootnoteProps> = ({ footnote, reverseCharge, className }) => {
  const { locale } = useSiteLocale();
  const notes = [footnote, reverseCharge].filter((note): note is Footnote => !!note);
  if (notes.length === 0) return null;

  return (
    <div className={className}>
      {notes.map((note) => (
        <p key={note.code} className="m-0 text-xs leading-relaxed text-gray-500">
          {note[locale]}
        </p>
      ))}
    </div>
  );
};

export default RouteFootnote;
