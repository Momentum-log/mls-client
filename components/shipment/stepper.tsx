"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCheckSquare,
  FiNavigation,
} from "react-icons/fi";
import { cn } from "@/utils/cn";

export const steps = [
  {
    id: 1,
    name: "Origin",
    path: "/app/shipments/new/origin",
    icon: FiNavigation,
  },
  {
    id: 2,
    name: "Destination",
    path: "/app/shipments/new/destination",
    icon: FiMapPin,
  },
  {
    id: 3,
    name: "Package",
    path: "/app/shipments/new/package",
    icon: FiPackage,
  },
  { id: 4, name: "Service", path: "/app/shipments/new/service", icon: FiTruck },
  {
    id: 5,
    name: "Summary",
    path: "/app/shipments/new/summary",
    icon: FiCheckSquare,
  },
];

export default function Stepper() {
  const pathname = usePathname();

  // Find current step index (0-based) based on path
  const currentStepIndex = steps.findIndex((step) =>
    pathname.includes(step.path)
  );

  // If we are on the base route or unknown, default to 0
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-4xl mx-auto px-4">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />

        {/* Active Progress Bar */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-brand-blue -z-10 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: activeIndex / (steps.length - 1),
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ width: "100%" }}
        />

        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative gap-2"
            >
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10 bg-white",
                  isActive
                    ? "border-brand-blue text-brand-blue shadow-lg scale-110"
                    : isCompleted
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-gray-200 text-gray-400"
                )}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted
                    ? "var(--color-brand-blue)"
                    : "#ffffff",
                  borderColor:
                    isActive || isCompleted
                      ? "var(--color-brand-blue)"
                      : "#e5e7eb",
                }}
              >
                <step.icon className="w-5 h-5" />
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium absolute -bottom-6 whitespace-nowrap transition-colors duration-300",
                  isActive
                    ? "text-brand-blue font-bold"
                    : isCompleted
                    ? "text-brand-blue"
                    : "text-gray-400"
                )}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
