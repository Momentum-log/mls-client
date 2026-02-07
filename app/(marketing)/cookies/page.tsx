"use client";

import React from "react";
import Container from "@/components/shared/container";
import Link from "next/link";

/**
 * Cookie Policy page with standard placeholder content.
 */
export default function CookiesPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-6">
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: February 7, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
            <h2 className="text-lg font-bold text-gray-900">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help the site remember your preferences and
              improve your browsing experience.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              2. How We Use Cookies
            </h2>
            <p>Momentum Logistics Service uses cookies to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ensure the website functions properly</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Personalize your experience</li>
            </ul>

            <h2 className="text-lg font-bold text-gray-900">
              3. Types of Cookies We Use
            </h2>
            <p>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function. They enable core features like security and
              accessibility.
            </p>
            <p>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors interact with our website by collecting anonymous data.
            </p>
            <p>
              <strong>Preference Cookies:</strong> Remember your settings and
              preferences for a better experience on future visits.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              4. Managing Cookies
            </h2>
            <p>
              Most browsers allow you to control cookies through settings. You
              can delete existing cookies and block new ones. Please note that
              disabling cookies may affect the functionality of our website.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              5. Third-Party Cookies
            </h2>
            <p>
              We may use third-party services (e.g., analytics providers) that
              set their own cookies. We do not control these cookies, and their
              use is governed by the respective third-party privacy policies.
            </p>

            <h2 className="text-lg font-bold text-gray-900">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. Changes will
              be posted on this page with a revised "Last updated" date.
            </p>

            <h2 className="text-lg font-bold text-gray-900">7. Contact Us</h2>
            <p>
              If you have questions about our Cookie Policy, please contact us
              at{" "}
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
