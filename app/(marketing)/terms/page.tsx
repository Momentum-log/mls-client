"use client";

import React from "react";
import Container from "@/components/shared/container";
import Link from "next/link";

/**
 * Terms and Conditions page with standard placeholder content.
 */
export default function TermsPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-6">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: February 7, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
            <h2 className="text-lg font-bold text-gray-900">1. Introduction</h2>
            <p>
              Welcome to Momentum Logistics Service ("we," "our," or "us"). By
              accessing or using our website and services, you agree to be bound
              by these Terms and Conditions. If you do not agree with any part
              of these terms, please do not use our services.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              2. Use of Services
            </h2>
            <p>
              Our services are intended for users who are at least 18 years old.
              By using our services, you represent that you meet this age
              requirement. You agree to use our services only for lawful
              purposes and in accordance with these Terms.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              3. Shipment and Delivery
            </h2>
            <p>
              Momentum Logistics Service acts as an intermediary between you and
              third-party shipping carriers. While we strive to provide accurate
              delivery estimates, we are not liable for delays, damages, or
              losses caused by third-party carriers. All shipments are subject
              to the terms and conditions of the selected carrier.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              4. Pricing and Payment
            </h2>
            <p>
              All prices displayed on our platform are in the currency indicated
              at the time of checkout. You agree to pay the full amount for your
              shipment before services are rendered. Refund policies are subject
              to the terms of the individual carrier and Momentum Logistics
              Service's discretion.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              5. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to notify us immediately of any
              unauthorized use of your account. We reserve the right to suspend
              or terminate accounts that violate these Terms.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Momentum Logistics Service
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of our services. Our
              total liability shall not exceed the amount paid by you for the
              specific service in question.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Any
              changes will be effective immediately upon posting on our website.
              Your continued use of our services constitutes acceptance of the
              revised Terms.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              8. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Poland, without regard to its conflict of law
              provisions.
            </p>

            <h2 className="text-lg font-bold text-gray-900">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <Link
                href="mailto:info@momentumlogservice.com"
                className="text-brand-blue hover:underline"
              >
                info@momentumlogservice.com
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
