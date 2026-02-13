"use client";

import React from "react";
import Container from "@/components/shared/container";
import Link from "next/link";

/**
 * Privacy Policy page with standard placeholder content.
 */
export default function PrivacyPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: February 7, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
            <h2 className="text-lg font-bold text-gray-900">1. Introduction</h2>
            <p>
              Momentum Logistics Service ("we," "our," or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our website and services.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              2. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, including but
              not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Personal identification information (name, email, phone number)
              </li>
              <li>Shipping addresses and contact details</li>
              <li>
                Payment information (processed securely via third-party
                providers)
              </li>
              <li>Account credentials</li>
            </ul>

            <h2 className="text-lg font-bold text-gray-900">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and manage your shipments</li>
              <li>Communicate with you about orders and account activity</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-lg font-bold text-gray-900">
              4. Information Sharing
            </h2>
            <p>
              We may share your information with third-party shipping carriers
              to fulfill your shipment requests. We do not sell your personal
              information to third parties. We may also share information when
              required by law or to protect our legal interests.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              5. Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your
              information from unauthorized access, alteration, or disclosure.
              However, no internet transmission is completely secure, and we
              cannot guarantee absolute security.
            </p>

            <h2 className="text-lg font-bold text-gray-900">6. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access,
              correct, or delete your personal data. You may also have the right
              to object to or restrict certain processing. Contact us to
              exercise these rights.
            </p>

            <h2 className="text-lg font-bold text-gray-900">7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your
              experience on our website. For more details, please see our{" "}
              <Link href="/cookies" className="text-brand-blue hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with a revised "Last updated" date.
            </p>

            <h2 className="text-lg font-bold text-gray-900">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <Link
                href="mailto:info@momentumlogservices.com"
                className="text-brand-blue hover:underline"
              >
                info@momentumlogservices.com
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
