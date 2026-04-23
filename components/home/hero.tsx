"use client";

import React from "react";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import Link from "next/link";
import { useCountryStore } from "@/store/country-store";
import { formatCurrencyCompact } from "@/utils/currency-formatter";

/**
 * Homepage Hero Section Component.
 * Displays main heading, CTAs, and three feature cards with dynamic currency.
 */
const Hero: React.FC = () => {
  const { currency } = useCountryStore();

  // Static price display: 100 PLN or €23 EUR based on detected currency
  const displayPrice = formatCurrencyCompact(
    currency === "PLN" ? 100 : 23,
    currency,
  );

  return (
    <section className="py-16 md:py-24 text-foreground">
      <Container>
        <div className="flex flex-col items-center text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl mb-6 max-w-5xl font-satoshi font-black">
            <span className="relative inline-block">
              <span className="relative z-10">
                Your trusted <br />{" "}
                <span className="text-brand-blue">logistics partner.</span>
              </span>
              <span className="absolute bottom-1 left-0 md:top-16 lg:top-30 w-full h-8 md:h-16 lg:h-20 bg-brand-yellow -rotate-3" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl">
            Ship packages, track deliveries, and manage your logistics needs
            with ease. From local to international shipping, we&apos;ve got you
            covered.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/shipping-estimate">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Get a Quote →
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            {/* Card 1 - Shipment Tracking (Blue) */}
            <div className="bg-brand-blue rounded-3xl p-3 text-left relative overflow-hidden">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-4 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">
                    Shipment Tracking
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-blue"></div>
                </div>
                <p className="text-xs text-foreground/60 mb-4">Package ID</p>
                <p className="text-3xl font-bold text-foreground mb-4">
                  MLS-2847
                </p>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div>
                    <p>Status</p>
                    <p className="text-brand-blue font-semibold">In Transit</p>
                  </div>
                  <div>
                    <p>ETA</p>
                    <p className="text-foreground font-semibold">2 days</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href="/track-shipment" className="flex-1">
                    <Button className="w-full">Track</Button>
                  </Link>
                  <Link href="/track-shipment" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border border-foreground/20 text-foreground py-2 rounded-lg text-sm font-medium"
                    >
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 - Delivery Quote (Purple) */}
            <div className="bg-accent-light rounded-3xl p-3 text-left relative overflow-hidden min-h-80">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-4 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">
                    Delivery Quote
                  </span>
                  <div className="w-8 h-8 rounded-full bg-accent-dark"></div>
                </div>
                <p className="text-xs text-foreground/60 mb-4">
                  Express Delivery
                </p>
                <p className="text-3xl font-bold text-foreground mb-4">
                  {displayPrice}
                </p>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div>
                    <p>Delivery Time</p>
                    <p className="text-foreground font-semibold">
                      Mon, 8 Nov 2025
                    </p>
                  </div>
                  <div>
                    <p>Weight</p>
                    <p className="text-foreground font-semibold">52kg</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href="/shipping-estimate" className="flex-1">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                  <Link href="/shipping-estimate" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border border-foreground/20 text-foreground py-2 rounded-lg text-sm font-medium"
                    >
                      Compare
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3 - International Shipping (Yellow) */}
            <div className="bg-brand-yellow rounded-3xl p-3 text-left relative overflow-hidden min-h-80">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-4 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">
                    International Shipping
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-blue"></div>
                </div>
                <p className="text-xs text-foreground/60 mb-4">Destination</p>
                <p className="text-3xl font-bold text-foreground mb-4">
                  Global
                </p>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <div>
                    <p>Countries</p>
                    <p className="text-foreground font-semibold">150+</p>
                  </div>
                  <div>
                    <p>Avg. Time</p>
                    <p className="text-foreground font-semibold">5-7 days</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href="/shipping-estimate" className="flex-1">
                    <Button className="w-full">Ship Global</Button>
                  </Link>
                  <Link href="/about" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border border-foreground/20 text-foreground py-2 rounded-lg text-sm font-medium"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
