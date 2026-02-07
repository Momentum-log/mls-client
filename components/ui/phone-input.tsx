"use client";

import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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

      <style jsx global>{`
        /* Minimalist tweaks to match the theme */
        .react-tel-input .flag-dropdown {
          background-color: transparent !important;
          border: none !important;
          top: 2px !important;
          bottom: 2px !important;
          left: 2px !important;
        }
        .react-tel-input .selected-flag {
          background-color: transparent !important;
          border-radius: 10px 0 0 10px !important;
          padding-left: 12px !important;
        }
        .react-tel-input .selected-flag:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }
        .react-tel-input .country-list {
          border-radius: 12px !important;
          border: 1px solid #f3f4f6 !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          width: 300px !important;
        }
        .react-tel-input .country-list .country {
          padding: 10px 15px !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .react-tel-input .country-list .country.highlight {
          background-color: #f8fafc !important;
        }
        .react-tel-input .country-list .country:hover {
          background-color: #f1f5f9 !important;
        }
        /* Search Box Refinement */
        .react-tel-input .search {
          padding: 10px !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        .react-tel-input .search-box {
          width: 100% !important;
          margin: 0 !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          border: 1px solid #f3f4f6 !important;
          font-size: 13px !important;
        }
        .react-tel-input .search-emoji {
          display: none !important;
        }
        .react-tel-input .search-box input {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
};

export default PhoneInputComponent;
