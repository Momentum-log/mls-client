"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "@/components/ui/phone-input.css";
import { cn } from "@/utils/cn";

interface UniversalPhoneInputProps {
  value: string;
  onChange: (value: string, country: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Universal PhoneInput component with country code dropdown and flags.
 * Follows the project's flat design philosophy using CSS variables.
 */
export const PhoneInputComponent: React.FC<UniversalPhoneInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  label,
  placeholder = "Enter phone number",
  className,
  disabled = false,
}) => {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <label className="text-xs font-black uppercase tracking-tight text-gray-700 block mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <PhoneInput
          country={"pl"}
          value={value}
          onChange={(phone, countryData: any) =>
            onChange(phone, countryData.countryCode?.toUpperCase())
          }
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          enableSearch={true}
          searchPlaceholder="Search country..."
          jumpCursorToEnd={true}
          inputClass={cn(
            "!w-full !h-12 !pl-14 !pr-4 !rounded-xl !border-2 !border-gray-100 !bg-white !text-sm !font-medium !text-gray-900 !transition-all !duration-200 outline-hidden focus:!border-brand-blue/30 focus:!ring-4 focus:!ring-brand-blue/5",
            touched && error ? "!border-red-500" : "",
            disabled ? "!bg-gray-50 !cursor-not-allowed" : "",
          )}
          buttonClass={cn(
            "!h-[44px] !bg-transparent !border-none !rounded-l-xl !pl-2 !transition-all !duration-200",
            disabled ? "!cursor-not-allowed" : "",
          )}
          dropdownClass="!rounded-xl !border-gray-100 !shadow-2xl !shadow-black/10 !mt-2 !bg-white !overflow-y-auto"
          searchClass="!block" // Ensure search box is visible
          containerClass="!w-full"
          inputProps={{
            name: "phone",
            autoFocus: false,
          }}
        />
      </div>
      {touched && error && (
        <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{error}</p>
      )}
    </div>
  );
};

export default PhoneInputComponent;
