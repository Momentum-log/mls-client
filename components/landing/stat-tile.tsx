import React, { FC } from "react";

/** Accent colour applied to the tile's icon chip and value. */
export type StatTone = "blue" | "yellow" | "violet";

interface StatTileProps {
  tone: StatTone;
  /** Lucide icon element rendered inside the tinted chip. */
  icon: React.ReactNode;
  /** The headline figure, e.g. "150+". */
  value: string;
  /** What the figure measures. */
  label: string;
  /** Supporting detail shown beneath the label. */
  sublabel: string;
}

/**
 * Tinted stat card used in the landing page's company section.
 *
 * Tone classes are written out in full rather than interpolated so Tailwind's
 * scanner can see them.
 */
const toneClasses: Record<StatTone, { chip: string; value: string }> = {
  blue: { chip: "bg-brand-blue/10 text-brand-blue", value: "text-brand-blue" },
  yellow: {
    chip: "bg-brand-yellow/15 text-brand-yellow",
    value: "text-brand-yellow",
  },
  violet: {
    chip: "bg-accent-dark/10 text-accent-dark",
    value: "text-accent-dark",
  },
};

const StatTile: FC<StatTileProps> = ({
  tone,
  icon,
  value,
  label,
  sublabel,
}) => {
  const tones = toneClasses[tone];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span
        className={`inline-flex rounded-xl p-2.5 ${tones.chip}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div
        className={`mt-3 font-work-sans text-2xl font-extrabold tracking-[-0.02em] ${tones.value}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-gray-900">{label}</div>
      <div className="mt-0.5 text-xs leading-relaxed text-gray-500">
        {sublabel}
      </div>
    </div>
  );
};

export default StatTile;
