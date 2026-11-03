import React, { FC } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import Eyebrow from "@/components/landing/eyebrow";

/**
 * Small building blocks shared by the marketing pages: the 1280px content
 * column, link-styled buttons and section headings.
 */

interface SiteContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** The marketing site's content column: 1280px wide with a 24px gutter. */
export const SiteContainer: FC<SiteContainerProps> = ({
  children,
  className,
}) => (
  <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6", className)}>
    {children}
  </div>
);

const linkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 font-satoshi font-bold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark",
        outline:
          "border-2 border-gray-200 text-foreground hover:border-brand-blue hover:text-brand-blue",
        yellow: "bg-brand-yellow text-foreground hover:bg-brand-yellow/90",
        dark: "bg-foreground text-white hover:bg-gray-800",
        outlineLight:
          "border-2 border-white/50 text-white hover:border-white hover:bg-white/10",
        outlineEco:
          "border-2 border-success-fg text-success-fg hover:bg-success-fg hover:text-white",
      },
      size: {
        md: "h-12 text-[15px]",
        lg: "h-[52px] text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

interface LinkButtonProps extends VariantProps<typeof linkButtonVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/** A link that looks like a button: every call to action on the site. */
export const LinkButton: FC<LinkButtonProps> = ({
  href,
  children,
  className,
  variant,
  size,
}) => (
  <Link
    href={href}
    className={cn(linkButtonVariants({ variant, size }), className)}
  >
    {children}
  </Link>
);

interface SectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  text?: string;
  className?: string;
}

/** Eyebrow, H2 and an optional lead paragraph. */
export const SectionHeading: FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  title,
  text,
  className,
}) => (
  <div className={cn("flex max-w-[680px] flex-col gap-3", className)}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <SectionTitle id={id}>{title}</SectionTitle>
    {text && (
      <p className="m-0 text-[17px] leading-[26px] text-gray-600">{text}</p>
    )}
  </div>
);

interface SectionTitleProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: FC<SectionTitleProps> = ({
  id,
  children,
  className,
}) => (
  <h2
    id={id}
    className={cn(
      "m-0 font-satoshi text-[32px] font-bold leading-[38px] tracking-[-0.02em] text-gray-900 md:text-[44px] md:leading-[50px]",
      className,
    )}
  >
    {children}
  </h2>
);

/** Uppercase label for dark or tinted panels, where the blue eyebrow lacks contrast. */
export const PanelLabel: FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      "font-satoshi text-[13px] font-bold uppercase leading-4 tracking-[0.15em]",
      className,
    )}
  >
    {children}
  </span>
);

/** Display H1 sizing shared by the marketing page heroes. */
export const heroTitleClass =
  "font-medium text-[38px] leading-[42px] md:text-[60px] md:leading-[1.1]";
