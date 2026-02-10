"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  useAutocomplete,
  usePlaceDetails,
} from "@/hooks/location/use-google-places";
import { useDebounce } from "@/hooks/use-debounce";
import { v4 as uuidv4 } from "uuid";
import { AutocompleteSuggestion, PlaceDetails } from "@/types/location";
import { FaMapPin, FaRoad } from "react-icons/fa6";
import { cn } from "@/utils/cn";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (details: PlaceDetails) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  touched?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter street address",
  className,
  label,
  error,
  touched,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [sessionToken, setSessionToken] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedInput = useDebounce(inputValue, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate session token on mount or when a selection is made
  useEffect(() => {
    if (!sessionToken) {
      setSessionToken(uuidv4());
    }
  }, [sessionToken]);

  // Sync internal state with external value (e.g. for Formik)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const { data: suggestions = [], isLoading } = useAutocomplete(
    debouncedInput,
    sessionToken,
  );

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const { data: placeDetails } = usePlaceDetails(selectedPlaceId, sessionToken);

  useEffect(() => {
    if (placeDetails) {
      onPlaceSelect(placeDetails);
      setSelectedPlaceId(null);
      setShowSuggestions(false);
      setSessionToken(uuidv4()); // Refresh token for next session
    }
  }, [placeDetails, onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setSelectedPlaceId(suggestion.placeId);
  };

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <FaRoad className="h-4 w-4" />
        </span>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn("pl-11", touched && error ? "border-red-500" : "")}
        />
      </div>

      {showSuggestions && inputValue.length > 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.placeId}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <FaMapPin className="h-4 w-4 text-brand-blue/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {suggestion.mainText}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {suggestion.secondaryText}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}

      {touched && error && (
        <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>
      )}
    </div>
  );
};
