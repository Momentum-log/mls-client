import React from "react";
import Container from "@/components/shared/container";
import ReceiptShowcase from "@/components/home/receipt-showcase";
import TrackingShowcase from "@/components/home/tracking-showcase";
import SimplifiedLogisticsShowcase from "@/components/home/simplified-logistics-showcase";
import {
  FaBoltLightning,
  FaMapLocationDot,
  FaTruckFast,
} from "react-icons/fa6";

const ValueProp: React.FC = () => {
  const valueProps = [
    {
      title: "Instant, Accurate Quotes",
      description:
        "No more waiting for email quotes. Our smart engine calculates your rate in seconds based on real-time data, with no hidden fees. Know your cost before you commit.",
      bgColor: "bg-brand-blue",
      textColor: "text-white",
      accentColor: "bg-brand-yellow",
    },
    {
      title: "Live, Unbroken Tracking",
      description:
        "From pickup to delivery, watch your shipment's journey on a live map. Get proactive status updates, so you're never left wondering \"where is it?\"",
      bgColor: "bg-brand-yellow",
      textColor: "text-foreground",
      accentColor: "bg-brand-blue",
    },
    {
      title: "Simplified Logistics",
      description:
        "We cut out the complexity. One platform for all your shipping needs—local, national, or international. Manage everything in one simple dashboard.",
      bgColor: "bg-accent-light",
      textColor: "text-foreground",
      accentColor: "bg-accent-dark",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background text-foreground">
      <Container>
        {/* Section Heading with Multi-tone */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-work-sans font-black mb-6">
            <span className="text-foreground">The </span>
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-blue">
                Momentum Difference
              </span>
            </span>
            <span className="relative block text-foreground">
              More Than Just Logistics
            </span>
          </h2>

          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mt-6">
            We&apos;ve rebuilt the logistics experience from the ground up
            around your needs. Stop dealing with complexity and start enjoying a
            shipping process that&apos;s fast, transparent, and entirely in your
            control.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {/* Point 1 - Blue (Top Left) */}
          <div
            className={`${valueProps[0].bgColor} rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-80 transition-transform hover:scale-101 duration-300 relative overflow-hidden`}
          >
            <div>
              <div
                className={`${valueProps[0].accentColor} w-12 h-12 rounded-full mb-6 flex items-center justify-center text-brand-blue`}
              >
                <FaBoltLightning className="h-5 w-5" />
              </div>
              <h3
                className={`${valueProps[0].textColor} text-2xl md:text-3xl font-work-sans font-black mb-4`}
              >
                {valueProps[0].title}
              </h3>
              <p
                className={`${valueProps[0].textColor} text-opacity-80 text-base md:text-lg leading-relaxed mb-6`}
              >
                {valueProps[0].description}
              </p>
            </div>
            {/* Receipt Showcase - underneath description */}
            <div className="mt-6">
              <ReceiptShowcase />
            </div>
          </div>

          {/* Point 2 - Yellow (Top Right) */}
          <div
            className={`${valueProps[1].bgColor} rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-80 transition-transform hover:scale-101 duration-300 relative overflow-hidden`}
          >
            <div>
              <div
                className={`${valueProps[1].accentColor} w-12 h-12 rounded-full mb-6 flex items-center justify-center text-brand-yellow`}
              >
                <FaMapLocationDot className="w-5 h-5" />
              </div>
              <h3
                className={`${valueProps[1].textColor} text-2xl md:text-3xl font-work-sans font-black mb-4`}
              >
                {valueProps[1].title}
              </h3>
              <p
                className={`${valueProps[1].textColor} text-opacity-90 text-base md:text-lg leading-relaxed mb-6`}
              >
                {valueProps[1].description}
              </p>
            </div>
            {/* Tracking Showcase - underneath description */}
            <div className="mt-6 flex justify-center md:justify-end">
              <TrackingShowcase />
            </div>
          </div>

          {/* Point 3 - Blue (Bottom, Full Width) */}
          <div
            className={`${valueProps[2].bgColor} rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-start min-h-80 transition-transform hover:scale-101 duration-300 col-span-1 md:col-span-2 relative overflow-hidden`}
          >
            <div className="flex-1 md:max-w-[70%] lg:max-w-[30%]">
              <div
                className={`${valueProps[2].accentColor} w-12 h-12 rounded-full mb-6 flex items-center justify-center text-accent-light`}
              >
                <FaTruckFast className="h-5 w-5" />
              </div>
              <h3
                className={`${valueProps[2].textColor} text-2xl md:text-3xl font-work-sans font-black mb-4`}
              >
                {valueProps[2].title}
              </h3>
              <p
                className={`${valueProps[2].textColor} text-opacity-80 text-base md:text-lg leading-relaxed`}
              >
                {valueProps[2].description}
              </p>
            </div>
            {/* Receipt Showcase - to the right of description on large screens */}
            <div className="mt-6 flex items-center justify-center flex-1 w-full">
              <SimplifiedLogisticsShowcase />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ValueProp;
