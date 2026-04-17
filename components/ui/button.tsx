import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed font-satoshi font-semibold cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-opacity-80 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        primary:
          "bg-brand-blue text-white active:bg-opacity-80 focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 hover:bg-brand-yellow hover:text-brand-blue hover:ring-2 hover:ring-brand-yellow hover:ring-offset-2",
        secondary:
          "bg-brand-yellow text-foreground active:bg-opacity-80 focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 hover:ring-2 hover:ring-brand-yellow hover:ring-offset-2",
        outline:
          "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white active:bg-opacity-10 focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 hover:ring-2 hover:ring-brand-blue hover:ring-offset-2",
        ghost:
          "text-foreground hover:bg-brand-blue hover:bg-opacity-10 active:bg-opacity-80 focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 hover:ring-2 hover:ring-brand-blue hover:ring-offset-2",
        danger:
          "bg-red-600 text-white active:bg-opacity-80 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 hover:bg-red-700 hover:ring-2 hover:ring-red-600 hover:ring-offset-2",
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
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  rounded,
  isLoading,
  children,
  ...props
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, rounded, className })}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export { Button };
export default Button;
