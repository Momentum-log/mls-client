import React, { FC, useId } from "react";
import { cn } from "@/utils/cn";
import { BRUSH_STROKES } from "./brush-strokes";

const BRUSH_COLORS = {
  yellow: "#fcb417",
  blue: "#005db1",
  sky: "#93c5fd",
  green: "#86efac",
} as const;

export type BrushColor = keyof typeof BRUSH_COLORS;

const THICKNESS = {
  thin: "0.26em",
  regular: "0.38em",
  bold: "0.54em",
  full: "1.05em",
} as const;

export interface BrushHighlightProps {
  children: React.ReactNode;
  /** A brand colour name or any CSS colour. Default yellow. */
  color?: BrushColor | (string & {});
  /** Which of the three hand-painted strokes. Default 1. */
  variant?: 1 | 2 | 3;
  thickness?: keyof typeof THICKNESS;
  /** Mirror the stroke so the dry tail sits on the left. */
  flip?: boolean;
  className?: string;
}

/** A painted brush stroke behind a word or phrase (styles in `globals.css`). */
const BrushHighlight: FC<BrushHighlightProps> = ({
  children,
  color = "yellow",
  variant = 1,
  thickness = "regular",
  flip = false,
  className,
}) => {
  const maskId = `brush-${useId().replace(/[^A-Za-z0-9_-]/g, "")}`;
  const stroke = BRUSH_STROKES[variant - 1];
  const style = {
    "--brush-color": BRUSH_COLORS[color as BrushColor] ?? color,
    "--brush-height": THICKNESS[thickness],
  } as React.CSSProperties;

  return (
    <span className={cn("brush", flip && "brush--flip", className)} style={style}>
      <svg
        className={cn("brush__stroke", thickness === "full" && "brush__stroke--full")}
        viewBox={stroke.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={-10} y={-20} width={320} height={90}>
            <rect x={-10} y={-20} width={320} height={90} fill="#fff" />
            {stroke.streaks.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#000"
                strokeWidth={i >= 6 ? 0.8 : i % 2 ? 1.1 : 1.8}
                strokeLinecap="round"
              />
            ))}
          </mask>
        </defs>
        <path d={stroke.d} fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
      <span className="brush__text">{children}</span>
    </span>
  );
};

export default BrushHighlight;
