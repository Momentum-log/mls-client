"use client";

import React from "react";
import Container from "@/components/shared/container";
import {
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaShieldHalved,
} from "react-icons/fa6";
import MissionShowcase from "./mission-showcase";
import VisionShowcase from "./vision-showcase";
import TrustShowcase from "./trust-showcase";
import InnovationShowcase from "./innovation-showcase";
import PartnershipShowcase from "./partnership-showcase";
import GlobalMindsetShowcase from "./global-mindset-showcase";

const MissionVision: React.FC = () => {
  return (
    <>
      {/* Mission Section */}
      <section className="py-20 bg-white overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <span className="text-brand-blue font-bold text-sm uppercase tracking-wider mb-2 block">
                Our Purpose
              </span>
              <h2 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 font-medium md:text-xl leading-relaxed mb-8">
                To empower businesses of all sizes by providing seamless,
                reliable, and innovative logistics solutions. We strive to
                remove the friction from global trade, making shipping as easy
                as sending an email.
              </p>
            </div>

            {/* Showcase */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <MissionShowcase />
            </div>
          </div>
        </Container>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Showcase */}
            <div className="order-1 flex justify-center lg:justify-start">
              <VisionShowcase />
            </div>

            {/* Text Content */}
            <div className="order-2 text-center lg:text-left">
              <span className="text-brand-yellow font-bold text-sm uppercase tracking-wider mb-2 block">
                Where We're Going
              </span>
              <h2 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mb-6">
                Our Vision
              </h2>
              <p className="text-gray-600 md:text-xl leading-relaxed mb-8">
                A world where distance is no longer a barrier to opportunity. We
                envision a connected global economy where goods move freely,
                efficiently, and sustainably across borders.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values - Bento Grid */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="text-center mb-16">
            <span className="text-brand-blue font-bold text-sm uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mt-3">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Trust First - Large Card */}
            <div className="md:col-span-2 bg-brand-blue rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group min-h-[300px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 h-full w-full md:w-1/2 z-0">
                <TrustShowcase />
              </div>
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white mb-6">
                  <FaShieldHalved className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-2xl md:text-3xl mb-4">
                  Trust First
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  We earn trust through transparency and delivering on our
                  promises, every single time. Integrity is the foundation of
                  everything we do.
                </p>
              </div>
            </div>

            {/* Innovation - Tall Card */}
            <div className="md:row-span-2 bg-brand-yellow rounded-3xl p-8 md:p-12 text-brand-blue relative overflow-hidden group flex flex-col">
              <div className="relative z-10 mb-auto">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6">
                  <FaLightbulb className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-2xl md:text-3xl mb-4">
                  Innovation
                </h3>
                <p className="text-brand-blue/80 text-lg leading-relaxed">
                  We constantly challenge the status quo to find smarter, faster
                  ways to ship. We embrace technology to solve complex problems.
                </p>
              </div>
              <div className="relative z-0 h-64 mt-8 -mx-4 -mb-8">
                <InnovationShowcase />
              </div>
            </div>

            {/* Partnership - Standard Card */}
            <div className="bg-accent-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group">
              <PartnershipShowcase />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white mb-6">
                  <FaHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Partnership</h3>
                <p className="text-white/80 leading-relaxed">
                  We don't just move boxes; we build lasting relationships with
                  our clients.
                </p>
              </div>
            </div>

            {/* Global Mindset - Standard Card */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 text-gray-900 relative overflow-hidden group hover:shadow-lg transition-all">
              <GlobalMindsetShowcase />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6">
                  <FaGlobe className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Global Mindset</h3>
                <p className="text-gray-600 leading-relaxed">
                  We think big and act locally, connecting communities across
                  the world.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default MissionVision;
