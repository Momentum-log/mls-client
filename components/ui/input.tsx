import * as React from "react";

import { cn } from "@/utils/cn"; // Assuming cn utility exists, check utils

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional field label rendered above the input.
   * Matches the label treatment used by `components/ui/select.tsx`.
   */
  label?: string;
  /** Class names applied to the wrapper when a `label` is present. */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, wrapperClassName, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? (label ? generatedId : undefined);

    const input = (
      <input
        type={type}
        id={inputId}
        className={cn(
          "flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20 focus-visible:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );

    if (!label) return input;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
        {input}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
