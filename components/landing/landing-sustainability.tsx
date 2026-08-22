"use client";

import React, { FC } from "react";
import Image from "next/image";
import { Footprints, Handshake, Recycle, Wind } from "lucide-react";
import Container from "@/components/shared/container";
import Eyebrow from "@/components/landing/eyebrow";
import { useLandingCopy } from "@/hooks/use-landing-copy";

/** Sustainability & ESG commitments. */
const LandingSustainability: FC = () => {
  const { copy } = useLandingCopy();

  const goals = [
    { Icon: Footprints, title: copy.goal1Title, description: copy.goal1Desc },
    { Icon: Wind, title: copy.goal2Title, description: copy.goal2Desc },
    { Icon: Recycle, title: copy.goal3Title, description: copy.goal3Desc },
    { Icon: Handshake, title: copy.goal4Title, description: copy.goal4Desc },
  ];

  return (
    <section id="sustainability" className="bg-gray-50 py-20 md:py-[88px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow className="text-success">
              {copy.sustainabilityTitle}
            </Eyebrow>
            <h2 className="mb-4 mt-3.5 font-work-sans text-[clamp(28px,5.2vw,42px)] font-extrabold leading-[1.12] text-gray-900">
              {copy.sustainabilityHeading}
            </h2>
            <p className="mb-7 max-w-[480px] text-lg leading-relaxed text-gray-500">
              {copy.sustainabilityText}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {goals.map(({ Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <span className="inline-flex rounded-xl bg-success-bg p-2.5 text-success">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mb-1.5 mt-3 text-base font-bold text-gray-900">
                    {title}
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-gray-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[360px] w-full overflow-hidden rounded-3xl md:h-[520px]">
              <Image
                src="/images/landing/sustainability.jpg"
                alt="Momentum Logistics green fleet beside wind turbines and solar panels"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            <div className="absolute left-0 top-7 max-w-[190px] rounded-2xl bg-success p-4 text-white shadow-xl lg:-left-4">
              <div className="font-work-sans text-[26px] font-extrabold">
                {copy.netZero}
              </div>
              <div className="mt-0.5 text-[13px] leading-snug opacity-90">
                {copy.netZeroSub}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LandingSustainability;
