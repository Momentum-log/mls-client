"use client";

import React from "react";

interface FeaturePoint {
  bold: string;
  regular: string;
  subtext?: string;
}

interface CTAConfig {
  text: string;
  href?: string;
  onClick?: () => void;
}

interface HowItWorksStepProps {
  title: string;
  description: string;
  points: FeaturePoint[];
  imageElement: React.ReactNode;
  imagePosition?: "left" | "right";
  primaryColor: string; // Can be "brand-blue", "#10b981", "var(--color-brand-blue)", etc.
  accentColor: string; // Can be "brand-yellow", "#34d399", "var(--color-brand-yellow)", etc.
  cta?: CTAConfig;
}

/**
 * Helper function to resolve color values
 * Supports: CSS variables, hex colors, Tailwind color names
 */
const resolveColor = (color: string): string => {
  // If it's already a hex color or var() function, return as-is
  if (color.startsWith("#") || color.startsWith("var(")) {
    return color;
  }

  // If it's a Tailwind color name or custom CSS variable name, wrap in var()
  // Map common color names to CSS variables
  const colorMap: Record<string, string> = {
    "brand-blue": "var(--color-brand-blue)",
    "brand-yellow": "var(--color-brand-yellow)",
    "accent-dark": "var(--color-accent-dark)",
    "accent-light": "var(--color-accent-light)",
  };

  return colorMap[color] || `var(--color-${color})`;
};

/**
 * Helper function to get hex color value for opacity calculations
 */
const getHexColor = (color: string): string => {
  // Pre-defined hex mappings
  const hexMap: Record<string, string> = {
    "brand-blue": "#005db1",
    "brand-yellow": "#fcb417",
    "accent-dark": "#8b5cf6",
    "accent-light": "#c3b4fc",
  };

  // If already a hex, return it
  if (color.startsWith("#")) {
    return color;
  }

  // Return mapped value or default fallback
  return hexMap[color] || "#cccccc";
};

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({
  title,
  description,
  points,
  imageElement,
  imagePosition = "left",
  primaryColor,
  accentColor,
}) => {
  const isImageRight = imagePosition === "right";

  // Resolve the actual color values
  const resolvedPrimaryColor = resolveColor(primaryColor);
  const resolvedAccentColor = resolveColor(accentColor);

  // Get hex values for opacity backgrounds
  const hexAccentColor = getHexColor(accentColor);

  return (
    <div className="w-full py-12 px-4 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center`}
        >
          {/* Image Container */}
          <div
            className={`${
              isImageRight ? "md:order-2" : "md:order-1"
            } order-1 rounded-3xl items-center justify-center overflow-hidden`}
            style={{
              backgroundColor: `${hexAccentColor}1A`, // 10% opacity
            }}
          >
            <div className="w-full rounded-3xl overflow-hidden aspect-square md:aspect-auto flex items-center justify-center p-4 md:p-8 text-foreground">
              {imageElement}
            </div>
          </div>

          {/* Text Content Container */}
          <div
            className={`${
              isImageRight ? "md:order-1" : "md:order-2"
            } order-2 flex flex-col gap-6`}
          >
            {/* Title */}
            <h4
              className="text-2xl md:text-4xl lg:text-5xl font-black font-work-sans leading-tight w-4/6"
              style={{ color: resolvedPrimaryColor }}
            >
              {title}
            </h4>

            {/* Description */}
            <p className="text-foreground/70 font-medium leading-relaxed">
              {description}
            </p>

            {/* Feature Points */}
            <div className="flex flex-col gap-4 mt-2">
              {points.map((point, index) => (
                <div key={index} className="flex gap-3 items-start">
                  {/* Bullet Dot */}
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: resolvedAccentColor }}
                  />

                  {/* Point Content */}
                  <div className="flex-1">
                    <p className="text-base leading-relaxed">
                      <span
                        className="font-bold"
                        style={{ color: resolvedPrimaryColor }}
                      >
                        {point.bold}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksStep;
