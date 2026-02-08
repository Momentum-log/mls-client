"use client";

import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaShip,
  FaBoxesStacked,
  FaWarehouse,
  FaCheck,
  FaWeightScale,
  FaHeadset,
} from "react-icons/fa6";

interface HeavyFreightShowcaseProps {
  className?: string;
}

/**
 * Interactive showcase component for the Heavy Freight section.
 * Displays an animated service selector with weight indicator and contact CTA.
 */
const HeavyFreightShowcase: React.FC<HeavyFreightShowcaseProps> = ({
  className = "",
}) => {
  const [selectedService, setSelectedService] = useState(0);
  const [weight, setWeight] = useState(70);

  const services = [
    {
      id: "ftl",
      icon: FaTruck,
      name: "Full Truck Load",
      shortName: "FTL",
      description: "Entire truck for your cargo",
      capacity: "Up to 24 tonnes",
    },
    {
      id: "ltl",
      icon: FaTruck,
      name: "Less Than Truck Load",
      shortName: "LTL",
      description: "Share truck space efficiently",
      capacity: "70kg - 5 tonnes",
    },
    {
      id: "port",
      icon: FaShip,
      name: "Port Load",
      shortName: "Port",
      description: "Sea freight solutions",
      capacity: "Container loads",
    },
    {
      id: "groupage",
      icon: FaBoxesStacked,
      name: "Groupage",
      shortName: "Group",
      description: "Consolidated shipments",
      capacity: "Cost-effective bulk",
    },
    {
      id: "door",
      icon: FaWarehouse,
      name: "Door-to-Door",
      shortName: "D2D",
      description: "End-to-end freight",
      capacity: "Full service",
    },
  ];

  // Auto-cycle through services
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedService((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [services.length]);

  // Animate weight counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWeight((prev) => {
        if (prev >= 500) return 70;
        return prev + Math.floor(Math.random() * 50) + 10;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentService = services[selectedService];

  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Header */}
        <div className="bg-brand-blue px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaWeightScale className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">Heavy Freight</span>
          </div>
          <div className="bg-brand-yellow px-2 py-0.5 rounded text-[10px] font-bold text-gray-900">
            70kg+
          </div>
        </div>

        {/* Weight Display */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Package Weight
            </span>
            <span className="text-xs text-brand-blue font-semibold">
              Heavy Cargo
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900 tabular-nums transition-all duration-300">
              {weight}
            </span>
            <span className="text-lg font-bold text-gray-400">kg</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-yellow rounded-full transition-all duration-500"
              style={{ width: `${Math.min((weight / 500) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span>70kg</span>
            <span>500kg+</span>
          </div>
        </div>

        {/* Service Selector */}
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
            Available Services
          </p>
          <div className="flex gap-1 mb-4">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(index)}
                className={`flex-1 py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-tight transition-all ${
                  selectedService === index
                    ? "bg-brand-blue text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {service.shortName}
              </button>
            ))}
          </div>

          {/* Selected Service Details */}
          <div className="bg-gray-50 rounded-2xl p-4 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
                <currentService.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm">
                  {currentService.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentService.description}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <FaCheck className="w-2.5 h-2.5 text-brand-blue" />
                  <span className="text-[10px] font-medium text-gray-600">
                    {currentService.capacity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-brand-yellow px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaHeadset className="w-4 h-4 text-brand-blue" />
            <div>
              <p className="text-xs font-bold text-gray-900">Need a quote?</p>
              <p className="text-[10px] text-gray-700">Our experts are ready</p>
            </div>
          </div>
          <div className="bg-brand-blue text-white px-3 py-1.5 rounded-full text-[11px] font-bold">
            Contact Us
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -z-10 -bottom-4 -right-4 w-24 h-24 bg-brand-yellow/20 rounded-full blur-2xl" />
      <div className="absolute -z-10 -top-4 -left-4 w-20 h-20 bg-brand-blue/10 rounded-full blur-2xl" />
    </div>
  );
};

export default HeavyFreightShowcase;
