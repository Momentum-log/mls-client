"use client";

import React, { FC } from "react";
import { CircleCheck, Clock, Globe, Package } from "lucide-react";
import Container from "@/components/shared/container";
import Eyebrow from "@/components/landing/eyebrow";
import StatTile from "@/components/landing/stat-tile";
import { useLandingCopy } from "@/hooks/use-landing-copy";

/** "About Momentum" summary with headline operating statistics. */
const LandingCompany: FC = () => {
  const { copy } = useLandingCopy();

  const points = [copy.point1, copy.point2, copy.point3];

  return (
    <section id="about" className="bg-white py-20 md:py-[88px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>{copy.aboutMomentum}</Eyebrow>
            <h2 className="mb-4 mt-3.5 font-work-sans text-[clamp(28px,5vw,40px)] font-extrabold leading-[1.12] text-gray-900">
              {copy.aboutHeading}
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-500">
              {copy.aboutText}
            </p>

            <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-base text-foreground"
                >
                  <CircleCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatTile
              tone="blue"
              icon={<Globe className="h-[22px] w-[22px]" />}
              value="150+"
              label={copy.countriesServedLabel}
              sublabel={copy.globalFreightReach}
            />
            <StatTile
              tone="yellow"
              icon={<Package className="h-[22px] w-[22px]" />}
              value="70kg+"
              label={copy.heavyFreight}
              sublabel={copy.ourSpecialty}
            />
            <StatTile
              tone="violet"
              icon={<Clock className="h-[22px] w-[22px]" />}
              value={copy.instant}
              label={copy.quoteTurnaroundLabel}
              sublabel={copy.fastTransparent}
            />
            <StatTile
              tone="blue"
              icon={<CircleCheck className="h-[22px] w-[22px]" />}
              value="98%"
              label={copy.onTimeDelivery}
              sublabel={copy.acrossRoutes}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LandingCompany;
