"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import {
  FaLocationCrosshairs,
  FaBoxOpen,
  FaTruckFast,
  FaCalculator,
  FaCheck,
  FaCircleExclamation,
  FaEnvelope,
  FaBook,
  FaLaptop,
  FaSuitcase,
  FaCube,
} from "react-icons/fa6";

// Package Presets
const PACKAGE_PRESETS = [
  {
    id: "envelope",
    name: "Envelope",
    icon: "✉️",
    dims: { length: 35, width: 25, height: 2 },
    weight: 0.5,
  },
  {
    id: "book-box",
    name: "Book Box",
    icon: "📚",
    dims: { length: 30, width: 20, height: 15 },
    weight: 2,
  },
  {
    id: "laptop-box",
    name: "Laptop Box",
    icon: "💻",
    dims: { length: 45, width: 35, height: 10 },
    weight: 3,
  },
  {
    id: "luggage",
    name: "Luggage",
    icon: "🧳",
    dims: { length: 70, width: 50, height: 30 },
    weight: 20,
  },
  {
    id: "custom",
    name: "Custom",
    icon: "📦",
    dims: { length: 0, width: 0, height: 0 },
    weight: 0,
  },
];

import ShippingHero from "@/components/shipping/shipping-hero";

export default function ShippingEstimatePage() {
  // State
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(PACKAGE_PRESETS[0].id);
  const [dimensions, setDimensions] = useState(PACKAGE_PRESETS[0].dims);
  const [weight, setWeight] = useState(PACKAGE_PRESETS[0].weight);
  const [isStackable, setIsStackable] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteResult, setQuoteResult] = useState<null | {
    price: number;
    eta: string;
  }>(null);

  // Handle Preset Change
  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = PACKAGE_PRESETS.find((p) => p.id === presetId);
    if (preset && presetId !== "custom") {
      setDimensions(preset.dims);
      setWeight(preset.weight);
    }
  };

  // Reverse Geocoding Helper
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
  };

  // Handle Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Fetch address from coordinates
        const address = await reverseGeocode(latitude, longitude);
        setPickupLocation(address);
        setIsLocating(false);
      },
      (error) => {
        // Use warn for expected errors like permission denial
        console.warn("Geolocation error:", error.message);
        let errorMessage =
          "Unable to retrieve your location. Please enter it manually.";

        // Handle specific error codes
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage =
              "Location access was denied. Please enable location permissions in your browser settings to use this feature, or enter your address manually.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage =
              "Location unavailable. Please check your device settings.";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please try again.";
            break;
        }

        alert(errorMessage);
        setIsLocating(false);
      }
    );
  };

  // Handle Calculate Quote
  const handleCalculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setQuoteResult(null);

    // Simulate API call
    setTimeout(() => {
      // Mock calculation logic
      const volume = dimensions.length * dimensions.width * dimensions.height;
      const basePrice = 20;
      const weightCost = weight * 2;
      const volumeCost = volume * 0.001;
      const total = basePrice + weightCost + volumeCost;

      setQuoteResult({
        price: Math.round(total * 100) / 100,
        eta: "2-3 Business Days",
      });
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <ShippingHero />

      {/* Estimate Form Section */}
      <div className="bg-gray-50 py-20">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-brand-blue font-bold text-xs uppercase tracking-wider">
                  Get a Quote
                </span>
              </div>
              <h1 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mb-6">
                Estimate Your <span className="text-brand-blue">Shipping</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Get an instant estimate for your shipment. Enter your details
                below to see our competitive rates and delivery times.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-3 space-y-6">
                <form onSubmit={handleCalculateQuote}>
                  {/* Location Details */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-blue">
                        <FaTruckFast className="w-5 h-5" />
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">
                        Route Details
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pickup Location
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Enter full address"
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50"
                            required
                          />
                          <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue hover:text-brand-blue/80 p-2 rounded-full hover:bg-brand-blue/5 transition-colors cursor-pointer"
                            title="Use current location"
                            aria-label="Use current location"
                          >
                            <FaLocationCrosshairs
                              className={`w-5 h-5 ${
                                isLocating ? "animate-pulse" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Drop-off Location
                        </label>
                        <input
                          type="text"
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          placeholder="Enter full address"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <FaBoxOpen className="w-5 h-5" />
                      </div>
                      <h2 className="font-bold text-xl text-gray-900">
                        Package Details
                      </h2>
                    </div>

                    {/* Presets */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Package Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {PACKAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePresetChange(preset.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                              selectedPreset === preset.id
                                ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                                : "border-gray-200 hover:border-brand-blue/50 text-gray-600"
                            }`}
                          >
                            <span className="text-2xl mb-1">{preset.icon}</span>
                            <span className="text-xs font-medium">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dimensions & Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          Dimensions (cm)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={dimensions.length}
                              onChange={(e) =>
                                setDimensions({
                                  ...dimensions,
                                  length: Number(e.target.value),
                                })
                              }
                              placeholder="L"
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center h-11"
                              disabled={selectedPreset !== "custom"}
                            />
                            <span className="text-xs text-gray-500 text-center block mt-1">
                              Length
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={dimensions.width}
                              onChange={(e) =>
                                setDimensions({
                                  ...dimensions,
                                  width: Number(e.target.value),
                                })
                              }
                              placeholder="W"
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center h-11"
                              disabled={selectedPreset !== "custom"}
                            />
                            <span className="text-xs text-gray-500 text-center block mt-1">
                              Width
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={dimensions.height}
                              onChange={(e) =>
                                setDimensions({
                                  ...dimensions,
                                  height: Number(e.target.value),
                                })
                              }
                              placeholder="H"
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center h-11"
                              disabled={selectedPreset !== "custom"}
                            />
                            <span className="text-xs text-gray-500 text-center block mt-1">
                              Height
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none h-11"
                            disabled={selectedPreset !== "custom"}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="stackable"
                          checked={isStackable}
                          onChange={(e) => setIsStackable(e.target.checked)}
                          className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                        />
                        <label
                          htmlFor="stackable"
                          className="text-sm text-gray-600 select-none"
                        >
                          This item is stackable
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full py-4 text-lg font-bold shadow-lg shadow-brand-blue/20 mt-6"
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <span className="flex items-center gap-2">
                        <FaCalculator className="animate-pulse" />{" "}
                        Calculating...
                      </span>
                    ) : (
                      "Get My Quote"
                    )}
                  </Button>
                </form>
              </div>

              {/* Summary / Result Section */}
              <div className="lg:col-span-2">
                <div className="bg-brand-blue text-white rounded-3xl p-6 md:p-8 sticky top-32">
                  <h3 className="font-bold text-xl mb-6">Quote Summary</h3>

                  {!quoteResult ? (
                    <div className="text-center py-8 text-white/60">
                      <FaCircleExclamation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        Fill out the form to see your estimated shipping cost.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <p className="text-sm text-white/60 mb-1">
                          Estimated Cost
                        </p>
                        <p className="text-4xl font-black text-brand-yellow">
                          ${quoteResult.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <span className="text-white/70">Service</span>
                          <span className="font-semibold">Standard Ground</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <span className="text-white/70">Est. Delivery</span>
                          <span className="font-semibold">
                            {quoteResult.eta}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <span className="text-white/70">Distance</span>
                          <span className="font-semibold">Calculated</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="w-full bg-white text-brand-blue hover:bg-brand-yellow hover:text-brand-blue border-none"
                        >
                          Book This Shipment
                        </Button>
                        <p className="text-xs text-center text-white/40 mt-4">
                          *Final price may vary based on exact weight and
                          dimensions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
