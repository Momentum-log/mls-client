"use client";

import React from "react";
import { FaLocationDot } from "react-icons/fa6";

const GlobalMindsetShowcase: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Abstract Map Background */}
      <div className="absolute -right-10 top-10 opacity-10">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#005db1"
            strokeWidth="2"
            strokeDasharray="10 10"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            stroke="#005db1"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
        </svg>
      </div>

      {/* Floating Markers */}
      <div className="absolute top-1/3 right-1/4 animate-bounce">
        <FaLocationDot className="text-brand-blue/20 w-6 h-6" />
      </div>
      <div className="absolute bottom-1/4 right-10 animate-bounce delay-100">
        <FaLocationDot className="text-brand-blue/20 w-4 h-4" />
      </div>
    </div>
  );
};

export default GlobalMindsetShowcase;
