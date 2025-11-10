"use client";

import { FC } from "react";
import Container from "@/components/shared/container";
import HowItWorksStep from "./how-it-works-step";
import QuoteEstimatorShowcase from "./quote-estimator-showcase";
import ShipmentShowcase from "./shipment-showcase";
import TrackingStepShowcase from "./tracking-step-showcase";
import Button from "../ui/button";
import { FaClipboard } from "react-icons/fa6";

const HowItWorks: FC = () => {
  const stepsData = [
    {
      title: "Get Started & Get a Quote",
      description:
        "Create your free account in under a minute. Once registered, you can immediately use our quick estimate tool to see shipping costs or request a callback from our team.",
      points: [
        {
          bold: "Free, No-Obligation Quotes",
          regular: "Get instant pricing without commitment",
        },
        {
          bold: "No Account Needed for Estimates",
          regular: "Try our calculator before signing up",
        },
        {
          bold: "Quick Registration",
          regular: "Simple 1-minute setup when you're ready",
        },
      ],
      imagePosition: "left" as const,
      imageElement: <QuoteEstimatorShowcase />,
      primaryColor: "brand-blue",
      accentColor: "brand-yellow",
    },
    {
      title: "Create & Confirm Your Shipment",
      description:
        "Log into your dashboard to create a new shipment. Enter what you're shipping, where it's going, and when it needs to arrive, then confirm your booking.",
      points: [
        {
          bold: "Easy Shipment Creation",
          regular: "Simple forms with clear instructions",
        },
        {
          bold: "Multiple Service Options",
          regular: "Choose the speed and service that fits your needs",
        },
        {
          bold: "Secure Payment Processing",
          regular: "Safe, encrypted payments with instant confirmation",
        },
      ],
      imagePosition: "right" as const,
      imageElement: <ShipmentShowcase />,
      primaryColor: "brand-yellow",
      accentColor: "brand-blue",
    },
    {
      title: "Track from Pickup to Delivery",
      description:
        "Receive your unique Tracking ID immediately after booking. Monitor your shipment's journey in real-time until successful delivery.",
      points: [
        {
          bold: "Real-Time Tracking Updates",
          regular: "Watch your shipment move on live maps",
        },
        {
          bold: "Automatic Status Notifications",
          regular: "Get email/SMS alerts at every major milestone",
        },
        {
          bold: "Delivery Confirmation",
          regular: "Receive proof of delivery with final confirmation email",
        },
      ],
      imagePosition: "left" as const,
      primaryColor: "accent-dark",
      imageElement: <TrackingStepShowcase />,
      accentColor: "accent-light",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background text-foreground">
      <Container>
        <div>
          {/* Heading section */}
          <div className="mx-auto text-center mb-16">
            <h2 className="font-work-sans font-black text-4xl md:text-5xl text-foreground mb-6">
              How <span className="text-brand-blue">Momentum Moves</span> <br />{" "}
              Your World
            </h2>
            <p className="text-foreground/70 font-medium text-lg max-w-3xl mx-auto">
              We&apos;ve made shipping simple. Get an instant estimate, schedule
              your shipment, and track it every step of the way—all in one
              place. Momentum Logistics handles the heavy lifting so your
              deliveries stay on time and hassle-free
            </p>

            <Button className="mt-6">
              <FaClipboard className="mr-2" /> Get a Free Quote
            </Button>
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {stepsData.map((step, index) => (
              <HowItWorksStep
                key={index}
                title={step.title}
                description={step.description}
                points={step.points}
                imageElement={step.imageElement}
                imagePosition={step.imagePosition}
                primaryColor={step.primaryColor}
                accentColor={step.accentColor}
              />
            ))}
          </div>

          {/*  */}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
