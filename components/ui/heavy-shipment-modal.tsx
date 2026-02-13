"use client";

import React from "react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import {
  FaTruck,
  FaShip,
  FaWarehouse,
  FaBoxesStacked,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";

interface HeavyShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal displayed when a shipment is 70kg or above.
 * Directs users to contact logistics experts for heavy freight services.
 */
const HeavyShipmentModal: React.FC<HeavyShipmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const services = [
    { icon: FaTruck, label: "FTL (Full Truck Load)" },
    { icon: FaTruck, label: "LTL (Less Than Truck Load)" },
    { icon: FaShip, label: "Port Load" },
    { icon: FaBoxesStacked, label: "Groupage" },
    { icon: FaWarehouse, label: "Door-to-Door Freight" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Heavy Shipment Detected">
      <div className="space-y-6">
        {/* Weight Notice */}
        <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
              <FaBoxesStacked className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Your shipment is 70kg or above
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Heavy shipments require specialized handling and custom quotes
                from our logistics experts.
              </p>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
            We handle:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl"
              >
                <service.icon className="w-4 h-4 text-brand-blue" />
                <span className="text-sm font-medium text-gray-800">
                  {service.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Contact our experts:
          </p>

          <a
            href="https://wa.me/48795069276"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="primary"
              className="w-full justify-center gap-2"
              rounded="full"
            >
              <FaWhatsapp className="w-4 h-4" />
              Chat on WhatsApp
            </Button>
          </a>

          <div className="flex gap-3">
            <a href="tel:+48795069276" className="flex-1">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 text-sm"
                rounded="full"
              >
                <FaPhone className="w-3 h-3" />
                Call Us
              </Button>
            </a>
            <a href="mailto:info@momentumlogservices.com" className="flex-1">
              <Button
                variant="outline"
                className="w-full justify-center gap-2 text-sm"
                rounded="full"
              >
                <FaEnvelope className="w-3 h-3" />
                Email
              </Button>
            </a>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors pt-2"
        >
          I&apos;ll ship something lighter
        </button>
      </div>
    </Modal>
  );
};

export default HeavyShipmentModal;
