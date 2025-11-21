"use client";

import React from "react";
import { FaShieldHalved, FaCheck, FaLock, FaUserShield } from "react-icons/fa6";

const TrustShowcase: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-end pr-4 md:pr-12">
      {/* Glass Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-64 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <FaShieldHalved className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Secure Logistics</p>
            <p className="text-white/60 text-[10px]">Verified Partner</p>
          </div>
        </div>

        {/* Security Checks List */}
        <div className="space-y-2">
          {[
            {
              icon: FaCheck,
              text: "Identity Verified",
              color: "text-green-400",
            },
            {
              icon: FaLock,
              text: "End-to-End Encrypted",
              color: "text-blue-400",
            },
            {
              icon: FaUserShield,
              text: "Vetted Drivers",
              color: "text-yellow-400",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-black/20 rounded-lg p-2 flex items-center gap-3"
            >
              <div
                className={`w-5 h-5 rounded bg-white/10 flex items-center justify-center ${item.color}`}
              >
                <item.icon className="w-3 h-3" />
              </div>
              <span className="text-white/90 text-xs font-medium">
                {item.text}
              </span>
              <FaCheck className="ml-auto text-green-400 w-3 h-3" />
            </div>
          ))}
        </div>

        {/* Trust Score */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-white/60 text-[10px]">Trust Score</span>
          <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded text-green-400 text-xs font-bold">
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute top-0 right-8 bg-brand-yellow text-brand-blue px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-12 animate-bounce">
        Top Rated
      </div>
    </div>
  );
};

export default TrustShowcase;
