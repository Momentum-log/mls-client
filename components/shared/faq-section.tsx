"use client";

import React, { useState } from "react";
import Container from "@/components/shared/container";
import { FaPlus, FaMinus } from "react-icons/fa6";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I track my shipment?",
    answer:
      "Tracking is easy! Once your shipment is booked, you'll receive a unique Tracking ID. Simply enter this ID on our homepage or in your dashboard to see real-time updates on your shipment's location and status.",
  },
  {
    question: "How is the shipping quote calculated?",
    answer:
      "Our quotes are calculated based on several factors: package dimensions, weight, pickup and delivery locations, and the service speed you choose (Standard, Express, or Overnight). We believe in transparent pricing with no hidden fees.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and direct bank transfers for business accounts. All payments are processed securely.",
  },
  {
    question: "Do you offer insurance for shipments?",
    answer:
      "Yes, every shipment comes with basic liability coverage. For valuable items, we offer additional comprehensive insurance options during the booking process for a small fee.",
  },
  {
    question: "Can I schedule a pickup for a specific time?",
    answer:
      "Absolutely. During the booking process, you can select a pickup window that works best for you. We offer morning and afternoon slots, and even same-day pickup for urgent requests.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-brand-blue font-bold text-xs uppercase tracking-wider">
                Common Questions
              </span>
            </div>
            <h2 className="font-work-sans font-black text-3xl md:text-4xl text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to know about shipping with Momentum.
            </p>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "border-brand-blue shadow-md"
                    : "border-gray-200 hover:border-brand-blue/50"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span
                    className={`font-work-sans font-bold text-lg ${
                      openIndex === index ? "text-brand-blue" : "text-gray-900"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      openIndex === index
                        ? "bg-brand-blue text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {openIndex === index ? (
                      <FaMinus className="w-3 h-3" />
                    ) : (
                      <FaPlus className="w-3 h-3" />
                    )}
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Still have questions?{" "}
              <a
                href="https://wa.me/48795069276"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue font-bold hover:underline decoration-2 underline-offset-2"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;
