"use client";

import React from "react";
import Container from "@/components/shared/container";
import { FaRocket } from "react-icons/fa6";
import GlobalNetworkShowcase from "./global-network-showcase";

const AboutHero: React.FC = () => {
  return (
    <section className="relative bg-gray-50 py-20 md:py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-brand-blue/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <FaRocket className="text-brand-blue w-4 h-4" />
              <span className="text-gray-600 font-medium text-sm tracking-wide">
                Our Journey
              </span>
            </div>
            <h1 className="font-work-sans font-black text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-8 leading-tight">
              Revolutionizing <br />
              <span className="text-brand-blue">Logistics for Everyone</span>
            </h1>
            <p className="text-gray-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              We're building the future of shipping—where speed, transparency,
              and reliability come standard.
            </p>
          </div>

          {/* Right Column: Interactive Showcase */}
          <div className="relative z-10 flex justify-center lg:justify-end">
            <GlobalNetworkShowcase />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;
