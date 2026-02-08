"use client";

import React from "react";
import Container from "@/components/shared/container";
import HeavyFreightShowcase from "@/components/home/heavy-freight-showcase";
import Button from "@/components/ui/button";
import {
  FaTruck,
  FaShip,
  FaBoxesStacked,
  FaWarehouse,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa6";

/**
 * Homepage section promoting heavy freight services (70kg+).
 * Features FTL, LTL, Port Load, Groupage, and Door-to-Door services.
 */
const HeavyFreightSection: React.FC = () => {
  const features = [
    {
      icon: FaTruck,
      title: "FTL & LTL",
      description: "Full and partial truck loads for any shipment size",
    },
    {
      icon: FaShip,
      title: "Port Load",
      description: "Sea freight and container shipping solutions",
    },
    {
      icon: FaBoxesStacked,
      title: "Groupage",
      description: "Cost-effective consolidated shipments",
    },
    {
      icon: FaWarehouse,
      title: "Door-to-Door",
      description: "Complete end-to-end freight management",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 px-4 py-2 rounded-full mb-6">
              <span className="text-2xl">📦</span>
              <span className="text-sm font-bold text-gray-800">
                70kg+ Heavy Freight
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-work-sans font-black text-foreground mb-6">
              <span className="text-brand-blue">Heavy Cargo?</span>
              <br />
              We've Got You Covered
            </h2>

            {/* Description */}
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              For shipments weighing 70kg and above, our logistics experts
              provide personalized solutions. From full truck loads to sea
              freight, we handle the heavy lifting so you don't have to.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-blue/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/48795069276"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="lg"
                  rounded="full"
                  className="gap-2 shadow-xl shadow-brand-blue/20"
                >
                  <FaHeadset className="w-4 h-4" />
                  Talk to an Expert
                </Button>
              </a>
              <a href="mailto:info@momentumlogservice.com">
                <Button
                  variant="outline"
                  size="lg"
                  rounded="full"
                  className="gap-2"
                >
                  Request a Quote
                  <FaArrowRight className="w-3 h-3" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right Showcase */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <HeavyFreightShowcase />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeavyFreightSection;
