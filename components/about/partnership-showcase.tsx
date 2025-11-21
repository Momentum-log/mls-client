"use client";

import React from "react";

const PartnershipShowcase: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Abstract Connecting Rings */}
      <div className="absolute -top-10 -right-10 w-40 h-40 border-20 border-white/10 rounded-full"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-10 border-white/10 rounded-full"></div>

      {/* Connecting Dots */}
      <div className="absolute top-1/2 right-8 flex gap-2">
        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default PartnershipShowcase;
