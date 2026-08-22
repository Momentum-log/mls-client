import React, { FC } from "react";
import { cn } from "@/utils/cn";

interface EyebrowProps {
  children: React.ReactNode;
  /** Tailwind text-colour class. Defaults to the brand blue. */
  className?: string;
}

/**
 * Small all-caps tracked label that sits above a section heading.
 * Ported from the campaign bundle's `Eyebrow` helper.
 */
const Eyebrow: FC<EyebrowProps> = ({ children, className }) => (
  <div
    className={cn(
      "font-satoshi text-[13px] font-bold uppercase tracking-[0.15em] text-brand-blue",
      className,
    )}
  >
    {children}
  </div>
);

export default Eyebrow;
