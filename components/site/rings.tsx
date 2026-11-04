import React, { FC } from "react";

/**
 * Decorative rings for feature cards. The parent needs `relative isolate
 * overflow-hidden` so the rings sit behind its content and are clipped.
 */
const Rings: FC = () => (
  <>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full border-[32px] border-brand-yellow/20"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-40 w-40 rounded-full border-[20px] border-white/10"
    />
  </>
);

export default Rings;
