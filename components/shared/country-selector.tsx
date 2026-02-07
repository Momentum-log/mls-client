"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCountryStore } from "@/store/country-store";
import { FaGlobe, FaChevronDown } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";

const CountrySelector: React.FC = () => {
  const { countryCode, setCountry } = useCountryStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPoland = countryCode === "PL";

  const handleSelect = (code: string) => {
    setCountry(code);
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white/80 hover:text-brand-yellow hover:bg-white/10 px-3 py-2 h-auto rounded-full transition-colors border border-white/20 bg-transparent"
      >
        <FaGlobe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isPoland ? "Poland (PLN)" : "International (EUR)"}
        </span>
        <FaChevronDown
          className={`w-3 h-3 opacity-70 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black/5 z-50 focus:outline-none overflow-hidden"
          >
            <div className="p-1">
              <button
                className={`w-full text-left cursor-pointer rounded-lg px-3 py-2 flex items-center gap-3 transition-colors ${
                  isPoland
                    ? "bg-brand-blue/5 text-brand-blue font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleSelect("PL")}
              >
                <span className="text-lg">🇵🇱</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm">Poland</span>
                  <span className="text-[10px] text-gray-500">PLN (zł)</span>
                </div>
              </button>
              <button
                className={`w-full text-left cursor-pointer rounded-lg px-3 py-2 flex items-center gap-3 transition-colors ${
                  !isPoland
                    ? "bg-brand-blue/5 text-brand-blue font-semibold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleSelect("US")}
              >
                <span className="text-lg">🌍</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm">International</span>
                  <span className="text-[10px] text-gray-500">EUR (€)</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelector;
