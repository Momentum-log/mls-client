"use client";

import React from "react";
import { FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa6";

const SUPPORT_EMAIL = "info@momentumlogservices.com";
const SUPPORT_WHATSAPP = "48795069276";
const SUPPORT_PHONE = "+48795069276";

interface SupportOptionsProps {
  /** Null until the shipment has been paid for and numbered. */
  trackingNumber: string | null;
}

/**
 * The ways to reach MLS about one shipment. Email and WhatsApp open with the
 * tracking number already written, so support can find the parcel at once.
 */
export default function SupportOptions({ trackingNumber }: SupportOptionsProps) {
  const subject = trackingNumber ? `Shipment ${trackingNumber}` : "Shipment help";
  const message = trackingNumber
    ? `Hello MLS, I need help with my shipment ${trackingNumber}.`
    : "Hello MLS, I need help with my shipment.";

  const options = [
    {
      label: "Email us",
      detail: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n`)}`,
      icon: FaEnvelope,
      external: false,
    },
    {
      label: "Chat on WhatsApp",
      detail: "+48 795 069 276",
      href: `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`,
      icon: FaWhatsapp,
      external: true,
    },
    {
      label: "Call us",
      detail: "+48 795 069 276",
      href: `tel:${SUPPORT_PHONE}`,
      icon: FaPhone,
      external: false,
    },
  ];

  return (
    <ul className="space-y-3">
      {options.map(({ label, detail, href, icon: Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex items-center gap-3 w-full px-4 py-3 bg-white border-2 border-brand-blue/10 text-brand-blue rounded-2xl hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all group"
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="flex flex-col min-w-0">
              <span className="font-bold text-sm">{label}</span>
              <span className="text-xs text-gray-500 group-hover:text-white/80 truncate">
                {detail}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
