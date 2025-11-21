"use client";

import React from "react";
import Container from "@/components/shared/container";
import { FaCheck, FaXmark } from "react-icons/fa6";

const ProblemSolution: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-work-sans font-black text-3xl md:text-5xl text-gray-900 mb-4">
            Why We Started
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We saw a broken industry filled with hidden fees and missed
            deadlines. So we decided to fix it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* The Old Way */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 opacity-70 hover:opacity-100 transition-opacity">
            <div className="inline-block bg-red-100 text-red-600 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              The Old Way
            </div>
            <h3 className="font-bold text-2xl text-gray-900 mb-6">
              Traditional Logistics
            </h3>
            <ul className="space-y-4">
              {[
                "Hidden fees and surcharges",
                "Opaque tracking updates",
                "Paper-based documentation",
                "Slow customer support",
                "Unpredictable delivery times",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <FaXmark className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* The Momentum Way */}
          <div className="bg-brand-blue p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <div className="inline-block bg-brand-yellow text-brand-blue font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-6">
                The Momentum Way
              </div>
              <h3 className="font-bold text-2xl text-white mb-6">
                Modern Logistics
              </h3>
              <ul className="space-y-4">
                {[
                  "Transparent, upfront pricing",
                  "Real-time GPS tracking",
                  "100% Digital workflows",
                  "24/7 Dedicated support",
                  "Guaranteed delivery windows",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-brand-blue shrink-0 mt-0.5">
                      <FaCheck className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProblemSolution;
