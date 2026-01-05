import React, { useState } from "react";
import Button from "@/components/ui/button";
import apiClient from "@/api";
// import { ShippingEstimate, ShippingRate } from "@/types/shipping";

interface RateSelectionProps {
  estimate: any;
  shipmentData: any; // Contains pickup, dropoff, package
}

const RateSelection: React.FC<RateSelectionProps> = ({
  estimate,
  shipmentData,
}) => {
  const [selectedRateIndex, setSelectedRateIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateShipment = async () => {
    if (selectedRateIndex === null) return;
    const rate = estimate.rates[selectedRateIndex];
    setLoading(true);
    setError(null);

    try {
      // Prepare payload for POST /shipments
      // Needs contact info which we didn't collect in estimate form!
      // We mocked it or need to collect it now.
      // For simplicity, I'll add hardcoded contact info or assume prompts.
      // Let's assume we collected it or use placeholders.

      const contact = {
        personName: "John Doe",
        phoneNumber: "1234567890",
        companyName: "Self",
      };

      const payload = {
        carrierName: rate.carrier,
        pickupAddress: { ...shipmentData.pickup, contact },
        dropoffAddress: { ...shipmentData.dropoff, contact },
        package: shipmentData.package,
        rate: rate,
      };

      const response = await apiClient.post("/shipments", payload);
      const { checkoutUrl } = response.data;

      // Redirect to payment
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create shipment");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Select Shipping Rate</h2>

      {estimate.rates.length === 0 ? (
        <p>No rates available for this route.</p>
      ) : (
        <div className="space-y-3">
          {estimate.rates.map((rate: any, index: number) => (
            <div
              key={index}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                selectedRateIndex === index
                  ? "border-brand-blue bg-blue-50 ring-1 ring-brand-blue"
                  : "hover:border-gray-300"
              }`}
              onClick={() => setSelectedRateIndex(index)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">
                    {rate.carrier} - {rate.serviceName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {rate.deliveryDescription || "Standard Delivery"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-brand-blue">
                    {rate.actualPrice} {rate.currency}
                  </p>
                  {rate.carrierPrice < rate.actualPrice && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Secure
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        onClick={handleCreateShipment}
        disabled={selectedRateIndex === null || loading}
        variant="primary"
        className="w-full"
      >
        {loading ? "Processing..." : "Pay & Ship"}
      </Button>
    </div>
  );
};

export default RateSelection;
