"use client";

import React from "react";
import { FaMicrochip, FaRobot, FaBolt } from "react-icons/fa6";

const InnovationShowcase: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-end items-center pb-8">
      {/* Tech Card */}
      <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-2xl p-4 w-56 shadow-2xl relative overflow-hidden">
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue opacity-50 animate-[scan_2s_linear_infinite]"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">
            AI Optimization
          </span>
          <FaMicrochip className="text-brand-blue w-4 h-4 animate-pulse" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-brand-blue/5 rounded p-2 text-center">
            <p className="text-[9px] text-gray-500">Efficiency</p>
            <p className="text-sm font-bold text-brand-blue">+45%</p>
          </div>
          <div className="bg-brand-blue/5 rounded p-2 text-center">
            <p className="text-[9px] text-gray-500">Cost</p>
            <p className="text-sm font-bold text-green-600">-20%</p>
          </div>
        </div>

        {/* Active Process */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="w-6 h-6 bg-brand-blue rounded flex items-center justify-center text-white">
            <FaRobot className="w-3 h-3" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-900">Auto-Routing</p>
            <div className="w-20 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-brand-blue w-[80%] animate-[width_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-8 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-brand-yellow animate-bounce">
        <FaBolt className="w-6 h-6" />
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200px);
          }
        }
        @keyframes width {
          0%,
          100% {
            width: 80%;
          }
          50% {
            width: 40%;
          }
        }
      `}</style>
    </div>
  );
};

export default InnovationShowcase;
