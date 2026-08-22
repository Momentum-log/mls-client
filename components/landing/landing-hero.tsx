"use client";

import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/landing/eyebrow";
import MarkerHeading from "@/components/landing/marker-heading";
import { useLandingCopy } from "@/hooks/use-landing-copy";
import { scrollToSection } from "@/utils/scroll-to-section";

/**
 * Landing page hero.
 *
 * The primary CTA deliberately routes to `/shipping-estimate` — the app's own
 * instant shipment-quote flow — while the secondary CTA scrolls to the freight
 * partnership enquiry form. These are two distinct journeys and must stay so.
 */
const LandingHero: FC = () => {
  const { copy } = useLandingCopy();

  const stats = [
    { value: "150+", label: copy.countriesServed },
    { value: "70 kg+", label: copy.heavyFreightSpecialist },
    { value: copy.instant, label: copy.quoteTurnaround },
  ];

  return (
    <section className="overflow-hidden bg-white py-16 md:py-[72px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy column */}
          <div>
            <Eyebrow>{copy.heroWhoWeAre}</Eyebrow>

            <MarkerHeading
              marker={copy.heroMarker}
              className="mt-4 max-w-[600px] text-[clamp(34px,7.5vw,60px)]"
            >
              {copy.heroHeading}
            </MarkerHeading>

            <p className="my-6 max-w-[520px] text-lg leading-relaxed text-foreground/70 md:text-[19px]">
              {copy.heroText}
            </p>

            <div className="flex flex-col flex-wrap gap-3.5 sm:flex-row">
              <Link href="/shipping-estimate" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  rounded="full"
                  className="w-full whitespace-nowrap sm:min-w-[200px]"
                >
                  {copy.ctaPrimary} →
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                rounded="full"
                className="w-full whitespace-nowrap sm:w-auto sm:min-w-[150px]"
                onClick={() => scrollToSection("partner-form")}
              >
                {copy.contactUs}
              </Button>
            </div>

            <div className="mt-11 flex flex-wrap gap-9">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-work-sans text-3xl font-extrabold tracking-[-0.02em] text-brand-blue">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual column */}
          <div className="relative mb-8 lg:mb-0">
            <div className="relative h-[320px] w-full overflow-hidden rounded-3xl md:h-[460px]">
              <Image
                src="/images/landing/hero-truck.jpg"
                alt="Momentum Logistics freight container ship at port"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            {/* Floating live-shipment card */}
            <div className="absolute -bottom-6 left-0 w-[250px] rounded-2xl border border-gray-100 border-l-4 border-l-brand-blue bg-white p-5 shadow-xl lg:-left-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-gray-500">
                  {copy.liveShipment}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-blue-800"
                    aria-hidden="true"
                  />
                  {copy.inTransit}
                </span>
              </div>
              <div className="font-mono text-[13px] text-gray-500">MLS-2847</div>
              <div className="mt-0.5 text-[22px] font-extrabold text-foreground">
                Łódź → Hamburg
              </div>
              <div className="mt-3 flex items-center gap-2 text-[13px] text-gray-500">
                <Truck
                  className="h-4 w-4 text-brand-blue"
                  aria-hidden="true"
                />
                {copy.etaDays}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LandingHero;
