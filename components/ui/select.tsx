"use client";

import React, { useState, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer",
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  label,
  disabled,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else if (searchable && searchInputRef.current) {
      // Focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(selectTriggerVariants(), className, {
          "ring-2 ring-brand-blue ring-offset-2 border-brand-blue": isOpen,
          "opacity-50 cursor-not-allowed": disabled,
        })}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOption?.icon && (
            <span className="text-lg shrink-0">{selectedOption.icon}</span>
          )}
          <span className={cn("truncate", !selectedOption && "text-gray-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <FaChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200 shrink-0",
            {
              "rotate-180": isOpen,
            },
          )}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-xl z-50 max-h-60 overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                <div className="relative">
                  <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="p-1 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors",
                      value === option.value
                        ? "bg-brand-blue/5 text-brand-blue font-medium"
                        : "hover:bg-gray-50 text-gray-700",
                    )}
                  >
                    {option.icon && (
                      <span className="text-lg text-gray-400 group-hover:text-gray-600 shrink-0">
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
