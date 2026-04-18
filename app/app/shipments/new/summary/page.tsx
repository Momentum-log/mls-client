"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShipmentStore } from "@/store/shipment-store";
import Button from "@/components/ui/button";
import {
  FiArrowLeft,
  FiCheckSquare,
  FiUser,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCreditCard,
} from "react-icons/fi";
import { createShipment } from "@/api/shipments";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import {
  getPayload,
  checkIfInternational,
} from "@/app/(marketing)/shipping-estimate/utils";
import { deepTransformData } from "@/utils/data-transform";

export default function SummaryPage() {
  const router = useRouter();
  const { sender, recipient, packages, customs, selectedRate, setStep, reset } =
    useShipmentStore();
  const { user } = useAuthStore();
  const { addToast: toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Transform selectedRate for UI display only
  const displaySelectedRate = React.useMemo(
    () => (selectedRate ? deepTransformData(selectedRate) : null),
    [selectedRate],
  );

  useEffect(() => {
    setStep(4); // 4 index for final step

    if (!sender || !recipient || packages.length === 0 || !selectedRate) {
      router.push("/app/shipments/new/origin");
    }
  }, [setStep, sender, recipient, packages, selectedRate, router]);

  const handleBook = async () => {
    if (!sender || !recipient || packages.length === 0 || !selectedRate) {
      toast({
        title: "Missing Shipment Data",
        message: "Please complete shipment details before booking.",
        type: "error",
      });
      router.push("/app/shipments/new/origin");
      return;
    }

    setLoading(true);
    try {
      // Determine if shipment is international
      const isInternational = checkIfInternational(
        sender?.country,
        recipient?.country,
      );

      // Construct proper payload matching API requirements
      // Use strict helper to build payload
      const payload = getPayload(isInternational, {
        carrierSlug:
          selectedRate.carrierSlug ||
          selectedRate.carrier?.toLowerCase().replace(/\s+/g, "-") ||
          "fedex", // Use slug
        pickupAddress: {
          streetLines: [sender?.street],
          city: sender?.city,
          postalCode: sender?.postalCode,
          countryCode: sender?.country,
          residential: false,
          contact: {
            personName: sender?.name,
            phoneNumber: sender?.phone,
            companyName: sender?.company || "",
          },
          stateOrProvinceCode: sender?.stateOrProvinceCode || "",
        },
        dropoffAddress: {
          streetLines: [recipient?.street],
          city: recipient?.city,
          postalCode: recipient?.postalCode,
          countryCode: recipient?.country,
          residential: true,
          contact: {
            personName: recipient?.name,
            phoneNumber: recipient?.phone,
            companyName: recipient?.company || "",
          },
          stateOrProvinceCode: recipient?.stateOrProvinceCode || "",
        },
        package: {
          weight: {
            value: Number(packages[0].weight),
            units: "KG",
          },
          dimensions: {
            length: Number(packages[0].length),
            width: Number(packages[0].width),
            height: Number(packages[0].height),
            units: "CM", // Standardize units
          },
        },
        rate: selectedRate,
        customs: customs || {
          customsType: "S",
          currency: packages[0].currency,
          categoryOfItem: "91",
          grossWeight: Number(packages[0].weight),
          firstName: sender.name,
          secondaryName: recipient.name,
          customsItem: [
            {
              item: {
                nameEn: packages[0].description || "Package",
                quantity: 1,
                weight: Number(packages[0].weight),
                value: Number(packages[0].value),
                tariffCode: "",
              },
            },
          ],
        },
      });

      console.log(
        "Submitting Shipment Payload:",
        JSON.stringify(payload, null, 2),
      );

      const data = await createShipment(payload);
      const { checkoutUrl } = data;

      toast({
        title: "Shipment Created!",
        message: "Redirecting to invoice...",
        type: "success",
        duration: 3000,
      });

      if (data.invoice?.id) {
        router.push(`/app/invoices/${data.invoice.id}`);
      } else if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        router.push("/app/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Booking Failed",
        message: err.response?.data?.error || "Failed to create shipment.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!sender) return null; // Hydration guard

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-blue/10 rounded-full">
          <FiCheckSquare className="w-6 h-6 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Summary & Pay</h2>
          <p className="text-sm text-gray-500">
            Review details before booking.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
          {/* Route */}
          <div className="flex flex-col md:flex-row gap-8 relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-brand-blue font-semibold">
                <FiUser /> Sender
              </div>
              <p className="font-medium text-gray-900">{sender?.name}</p>
              <p className="text-sm text-gray-600">{sender?.street}</p>
              <p className="text-sm text-gray-600">
                {sender?.postalCode} {sender?.city}, {sender?.country}
              </p>
            </div>

            {/* Divider/Arrow for visuals */}
            <div className="hidden md:block w-px bg-gray-300 mx-4 relative self-stretch"></div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-brand-blue font-semibold">
                <FiMapPin /> Recipient
              </div>
              <p className="font-medium text-gray-900">{recipient?.name}</p>
              <p className="text-sm text-gray-600">{recipient?.street}</p>
              <p className="text-sm text-gray-600">
                {recipient?.postalCode} {recipient?.city}, {recipient?.country}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Package & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium text-sm">
                <FiPackage /> Package
              </div>
              <p className="font-semibold text-gray-900">
                {packages.length} Package(s)
              </p>
              <p className="text-sm text-gray-600">
                {packages[0].weight}kg • {packages[0].description}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium text-sm">
                <FiTruck /> Service
              </div>
              <p className="font-semibold text-gray-900">
                {displaySelectedRate?.carrier}{" "}
                {displaySelectedRate?.serviceName}
              </p>
              <p className="text-sm text-gray-600">
                {displaySelectedRate?.deliveryDescription}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Total */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-700">Total Cost</span>
            <span className="text-3xl font-bold text-brand-blue">
              {selectedRate?.actualPrice}{" "}
              <small className="text-lg font-normal text-gray-500">
                {selectedRate?.currency}
              </small>
            </span>
          </div>
        </div>

        <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="min-w-[200px] ml-auto bg-green-600 hover:bg-green-700 border-transparent shadow-lg shadow-green-200"
            onClick={handleBook}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">Processing...</span>
            ) : (
              <span className="flex items-center gap-2">
                <FiCreditCard /> Pay & Book
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
