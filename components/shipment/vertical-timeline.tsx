"use client";

import React from "react";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

export interface TimelineStep {
  id: string;
  label: string;
  status: "pending" | "current" | "completed";
}

interface VerticalTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

/**
 * VerticalTimeline component to visualize progress in the stacked shipment flow.
 *
 * @param steps - Array of steps with their respective statuses
 * @param className - Optional additional styles
 */
export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  steps,
  className = "",
}) => {
  return (
    <div className={`flex flex-col space-y-0 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start group">
          {/* Connector Line */}
          {index !== steps.length - 1 && (
            <div
              className={`absolute left-[11px] top-6 w-0.5 h-[calc(100%-8px)] transition-colors duration-300 ${
                step.status === "completed" ? "bg-brand-blue" : "bg-gray-200"
              }`}
            />
          )}

          {/* Icon & Label */}
          <div className="flex items-start gap-4 pb-8 min-h-16">
            <div className="relative z-10 pt-1">
              {step.status === "completed" ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue animate-in zoom-in duration-300">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
              ) : step.status === "current" ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue text-white ring-4 ring-brand-blue/10 animate-pulse">
                  <FiCircle className="w-4 h-4 fill-current" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                  <FiCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span
                className={`text-sm font-bold transition-colors duration-300 ${
                  step.status === "current"
                    ? "text-brand-blue"
                    : step.status === "completed"
                      ? "text-gray-900"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {step.status === "current" && (
                <span className="text-xs text-brand-blue font-medium animate-in fade-in slide-in-from-top-1">
                  In Progress
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
