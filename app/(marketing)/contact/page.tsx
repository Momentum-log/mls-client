"use client";

import React from "react";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import FAQSection from "@/components/shared/faq-section";
import { useUtilsStore } from "@/store/utils-store";
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

export default function ContactPage() {
  const { isContactFormDisabled } = useUtilsStore();

  return (
    <main>
      <div className="bg-gray-50 pt-32 pb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <div>
              <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-brand-blue font-bold text-xs uppercase tracking-wider">
                  Get in Touch
                </span>
              </div>
              <h1 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mb-6">
                We'd Love to <br />
                <span className="text-brand-blue">Hear from You</span>
              </h1>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Have a question about your shipment? Need a custom quote? Our
                team is here to help you move your business forward.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand-blue shrink-0">
                    <FaPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600 mb-1">+48 795 069 276</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand-blue shrink-0">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      info@momentumlogservices.com
                    </p>
                    <p className="text-sm text-gray-500">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand-blue shrink-0">
                    <FaLocationDot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Headquarters
                    </h3>
                    <p className="text-gray-600">
                      ul. kpt pilota zwirki 17,
                      <br />
                      90-539 Łódź
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Connect with us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://wa.me/48795069276"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/momentumlogserv?s=21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <FaXTwitter className="w-5 h-5" />
                  </a>
                  {/* <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166fe5] transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </a> */}
                  <a
                    href="https://www.instagram.com/momentumlogservices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/momentum-logistics-services/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:bg-[#006396] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
              {isContactFormDisabled && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm mx-auto">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaEnvelope className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Form Temporarily Unavailable
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      We are currently upgrading our support system. Please
                      contact us via phone or WhatsApp for immediate assistance.
                    </p>
                    <a
                      href="https://wa.me/48795069276"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button className="w-full">Chat on WhatsApp</Button>
                    </a>
                  </div>
                </div>
              )}

              <form
                className={
                  isContactFormDisabled ? "opacity-50 pointer-events-none" : ""
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-gray-700">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50">
                    <option>General Inquiry</option>
                    <option>Shipping Quote</option>
                    <option>Track a Shipment</option>
                    <option>Business Partnership</option>
                  </select>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-sm font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-gray-50 resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button className="w-full py-4 text-base">Send Message</Button>
              </form>
            </div>
          </div>
        </Container>
      </div>
      <FAQSection />
    </main>
  );
}
