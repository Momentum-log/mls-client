"use client";

import React, { FC } from "react";
import Container from "@/components/shared/container";
import Eyebrow from "@/components/landing/eyebrow";
import { useLandingCopy } from "@/hooks/use-landing-copy";

/**
 * Company video section.
 *
 * The source file is ~6.4 MB, so the element carries `preload="none"` and a
 * generated poster frame — the video only downloads once a visitor presses play.
 */
const LandingVideo: FC = () => {
  const { copy } = useLandingCopy();

  return (
    <section id="video" className="bg-white py-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-16">
          <div className="max-w-[520px] flex-[1_1_400px]">
            <Eyebrow>{copy.videoTitle}</Eyebrow>
            <h2 className="my-4 font-work-sans text-3xl font-extrabold leading-tight text-gray-900 md:text-[40px]">
              {copy.videoHeading}
            </h2>
            <p className="text-lg leading-relaxed text-gray-500">
              {copy.videoText}
            </p>
          </div>

          <div className="flex flex-[1_1_320px] justify-center">
            <video
              src="/videos/momentum-company.mp4"
              poster="/videos/momentum-company-poster.jpg"
              preload="none"
              controls
              playsInline
              className="block w-full max-w-[320px] rounded-3xl bg-foreground shadow-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LandingVideo;
