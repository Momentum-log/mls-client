import React, { FC } from "react";
import { cn } from "@/utils/cn";
import BrushHighlight, { type BrushHighlightProps } from "@/components/ui/brush-highlight";

interface MarkerHeadingProps {
  /** Text rendered before the highlighted phrase. */
  children?: React.ReactNode;
  /** Phrase that receives the brush stroke. */
  marker: string;
  /** Text after the highlighted phrase, for headings where it sits mid-sentence. */
  after?: string;
  markerColor?: BrushHighlightProps["color"];
  brush?: BrushHighlightProps["variant"];
  thickness?: BrushHighlightProps["thickness"];
  id?: string;
  className?: string;
}

/** Page H1 with Momentum's brush stroke behind one phrase. */
const MarkerHeading: FC<MarkerHeadingProps> = ({
  children,
  marker,
  after,
  markerColor,
  brush,
  thickness,
  id,
  className,
}) => (
  <h1
    id={id}
    className={cn(
      "font-satoshi font-black leading-[1.1] tracking-[-0.02em] text-foreground",
      className,
    )}
  >
    {children}
    {children ? " " : null}
    <BrushHighlight color={markerColor} variant={brush} thickness={thickness}>
      {marker}
    </BrushHighlight>
    {after ? ` ${after}` : null}
  </h1>
);

export default MarkerHeading;
