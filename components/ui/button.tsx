import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none font-satoshi font-semibold",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-blue text-white hover:bg-opacity-90 active:bg-opacity-80 focus:ring-2 focus:ring-brand-blue focus:ring-offset-2",
        secondary:
          "bg-brand-yellow text-foreground hover:bg-opacity-90 active:bg-opacity-80 focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2",
        outline:
          "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:bg-opacity-5 active:bg-opacity-10 focus:ring-2 focus:ring-brand-blue focus:ring-offset-2",
        ghost:
          "text-foreground hover:bg-background-color active:bg-opacity-80 focus:ring-2 focus:ring-brand-blue focus:ring-offset-2",
        danger:
          "bg-red-600 text-white hover:bg-opacity-90 active:bg-opacity-80 focus:ring-2 focus:ring-red-600 focus:ring-offset-2",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
      },
      rounded: {
        ios: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "ios",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  rounded,
  ...props
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, rounded, className })}
      {...props}
    />
  );
};

export default Button;
