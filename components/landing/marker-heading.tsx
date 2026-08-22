import React, { FC } from "react";
import { cn } from "@/utils/cn";

interface MarkerHeadingProps {
  /** Text rendered in the normal weight, before the highlighted phrase. */
  children: React.ReactNode;
  /** Phrase that receives the yellow marker swipe. */
  marker: string;
  className?: string;
}

/**
 * Display heading with Momentum's signature yellow marker swipe behind the
 * closing phrase.
 *
 * The swipe is an absolutely positioned block rotated -3deg and stacked beneath
 * the text — the same treatment used on the previous landing hero, extracted
 * here so both pages share one implementation.
 */
const MarkerHeading: FC<MarkerHeadingProps> = ({
  children,
  marker,
  className,
}) => (
  <h1
    className={cn(
      "font-satoshi font-black leading-[1.1] tracking-[-0.02em] text-foreground",
      className,
    )}
  >
    {children}{" "}
    <span className="relative inline-block">
      <span className="absolute bottom-[0.05em] left-0 z-0 h-[0.34em] w-full -rotate-3 bg-brand-yellow" />
      <span className="relative z-10">{marker}</span>
    </span>
  </h1>
);

export default MarkerHeading;
