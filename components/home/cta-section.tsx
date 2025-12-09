"use client";

import React from "react";
import Container from "@/components/shared/container";
import Button from "../ui/button";
import DashboardShowcase from "./dashboard-showcase";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const CTASection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="py-20 md:py-32 bg-brand-blue overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-accent-dark/20 rounded-full blur-3xl"></div>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div className="text-left">
            <div className="inline-block bg-brand-yellow/20 border border-brand-yellow/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-yellow font-bold text-xs uppercase tracking-wider">
                Start Shipping Smarter
              </span>
            </div>
            <h2 className="font-work-sans font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Ready to Streamline <br />
              <span className="text-brand-yellow">Your Logistics?</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl font-light">
              Join thousands of businesses moving faster with Momentum. Get
              instant quotes, real-time tracking, and dedicated support—all in
              one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/shipping-estimate")}
                variant="primary"
                className="bg-brand-yellow text-brand-blue hover:bg-white hover:text-brand-blue border-none text-base px-8 py-4 h-auto"
              >
                Get a Free Quote
              </Button>
              <Button
                onClick={() => router.push("/contact")}
                variant="outline"
                className="text-brand-yellow"
              >
                Contact Sales <FaArrowRight className="ml-2" />
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-white/60 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-300 border-2 border-brand-blue"
                  ></div>
                ))}
              </div>
              <p>Trusted by 500+ companies</p>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative mt-8 lg:mt-0">
            <DashboardShowcase />

            {/* Floating Elements for depth */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block animate-bounce duration-3000">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <FaCircleCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Status Update
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    Shipment Delivered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
