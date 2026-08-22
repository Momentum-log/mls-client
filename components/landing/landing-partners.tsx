"use client";

import React, { FC } from "react";
import Image from "next/image";
import Container from "@/components/shared/container";
import Eyebrow from "@/components/landing/eyebrow";
import { useLandingCopy } from "@/hooks/use-landing-copy";

/** Carrier networks Momentum moves freight through. */
const partners = [
  { id: "dhl", name: "DHL", src: "/images/partners/dhl.jpg" },
  { id: "fedex", name: "FedEx", src: "/images/partners/fedex.jpg" },
];

/** Official carrier partner logos. */
const LandingPartners: FC = () => {
  const { copy } = useLandingCopy();

  return (
    <section
      id="partners"
      className="border-y border-gray-100 bg-gray-50 py-11"
    >
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-10">
          <div className="max-w-[280px]">
            <Eyebrow>{copy.partnersTitle}</Eyebrow>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
              {copy.partnersText}
            </p>
          </div>

          <div className="flex flex-1 flex-wrap justify-center gap-7 md:justify-end">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="relative h-[120px] w-[240px] overflow-hidden rounded-[18px]"
              >
                <Image
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LandingPartners;
