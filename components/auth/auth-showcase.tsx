"use client";

import React, { useEffect, useState } from "react";
import {
  FaUserCheck,
  FaShieldHalved,
  FaBoxOpen,
  FaPlane,
  FaTruck,
  FaShip,
} from "react-icons/fa6";
import { motion } from "framer-motion";

const AuthShowcase: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center rounded-3xl overflow-hidden p-8 lg:p-12">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-brand-blue/5 via-brand-yellow/5 to-brand-blue/10 animate-[pulse_10s_ease-in-out_infinite]"></div>

      {/* Animated Artifacts */}
      <motion.div
        className="absolute top-10 left-10 text-brand-blue/10"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaPlane className="w-24 h-24" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-brand-yellow/20"
        animate={{ x: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaTruck className="w-32 h-32" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-0 text-brand-blue/5"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaShip className="w-40 h-40" />
      </motion.div>

      {/* Background Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-md aspect-square z-10">
        {/* Step 1: Account Creation */}
        <div
          className={`absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-700 ease-in-out flex flex-col justify-between ${
            step === 0
              ? "opacity-100 translate-y-0 scale-100 z-30"
              : step === 1
              ? "opacity-0 -translate-y-8 scale-95 z-20"
              : "opacity-0 translate-y-12 scale-90 z-10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-brand-blue shadow-inner">
              <FaUserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Create Account
              </h3>
              <p className="text-sm text-gray-500">Join Momentum Logistics</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-3 bg-gray-100 rounded-full w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded-full w-1/2 animate-pulse delay-75"></div>
          </div>
          <div className="flex justify-end">
            <div className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Success
            </div>
          </div>
        </div>

        {/* Step 2: Secure Verification */}
        <div
          className={`absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-700 ease-in-out flex flex-col justify-between ${
            step === 1
              ? "opacity-100 translate-y-0 scale-100 z-30"
              : step === 2
              ? "opacity-0 -translate-y-8 scale-95 z-20"
              : "opacity-0 translate-y-12 scale-90 z-10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-brand-yellow shadow-inner">
              <FaShieldHalved className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Secure Access</h3>
              <p className="text-sm text-gray-500">Verifying credentials...</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-3 bg-gray-100 rounded-full w-full animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded-full w-5/6 animate-pulse delay-75"></div>
          </div>
          <div className="flex justify-end">
            <div className="px-4 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-full shadow-lg shadow-brand-blue/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              Verified
            </div>
          </div>
        </div>

        {/* Step 3: Ready to Ship */}
        <div
          className={`absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 transition-all duration-700 ease-in-out flex flex-col justify-between ${
            step === 2
              ? "opacity-100 translate-y-0 scale-100 z-30"
              : step === 0
              ? "opacity-0 -translate-y-8 scale-95 z-20"
              : "opacity-0 translate-y-12 scale-90 z-10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-inner">
              <FaBoxOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Ready to Ship</h3>
              <p className="text-sm text-gray-500">Access your dashboard</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50/80 p-3 rounded-xl text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Quotes</p>
              <p className="font-bold text-brand-blue text-lg">Instant</p>
            </div>
            <div className="bg-gray-50/80 p-3 rounded-xl text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Tracking</p>
              <p className="font-bold text-green-600 text-lg">Live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;
