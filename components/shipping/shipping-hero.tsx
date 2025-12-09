"use client";

import React from "react";
import Container from "@/components/shared/container";
import ShippingProcessShowcase from "./shipping-process-showcase";
import { FaRocket } from "react-icons/fa6";

const ShippingHero: React.FC = () => {
  return (
    <section className="relative bg-gray-50 py-16 md:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-yellow/5 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <FaRocket className="text-brand-blue w-4 h-4" />
              <span className="text-gray-600 font-medium text-sm tracking-wide">
                Fastest Shipping
              </span>
            </div>
            <h1 className="font-work-sans font-black text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              Seamless Shipping <br />
              <span className="text-brand-blue">Solutions for You</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Get instant quotes, book shipments, and track your packages in
              real-time. Experience the future of logistics today.
            </p>
          </div>

          {/* Right Column: Interactive Showcase */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <ShippingProcessShowcase />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ShippingHero;
