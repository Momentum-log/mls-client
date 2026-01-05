import React, { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import apiClient from "@/api";
// import { ShippingEstimate, Address } from "@/types/shipping"; // Ensure types exist

// Simplified Schema for demo - should be more robust
const addressSchema = z.object({
  streetLines: z.string().min(1, "Street required"),
  city: z.string().min(1, "City required"),
  postalCode: z.string().min(1, "Postal Code required"),
  countryCode: z.string().length(2, "2-letter Country Code"),
  residential: z.boolean(),
});

const packageSchema = z.object({
  weight: z.number().min(0.1, "Weight required"),
  weightUnits: z.enum(["KG", "LB"]),
  length: z.number().min(1),
  width: z.number().min(1),
  height: z.number().min(1),
  dimUnits: z.enum(["CM", "IN"]),
});

const estimateFormSchema = z.object({
  pickup: addressSchema,
  dropoff: addressSchema,
  package: packageSchema,
});

interface EstimateFormProps {
  onEstimateSuccess: (estimate: any, formData: any) => void;
}

const EstimateForm: React.FC<EstimateFormProps> = ({ onEstimateSuccess }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      pickup: {
        streetLines: "",
        city: "",
        postalCode: "",
        countryCode: "PL",
        residential: false,
      },
      dropoff: {
        streetLines: "",
        city: "",
        postalCode: "",
        countryCode: "US",
        residential: true,
      },
      package: {
        weight: 1,
        weightUnits: "KG",
        length: 10,
        width: 10,
        height: 10,
        dimUnits: "CM",
      },
    },
    // validationSchema: toFormikValidationSchema(estimateFormSchema), // Skipping strict validation for brevity in demo, enable in prod
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const payload = {
          pickup: {
            ...values.pickup,
            streetLines: [values.pickup.streetLines],
          },
          dropoff: {
            ...values.dropoff,
            streetLines: [values.dropoff.streetLines],
          },
          package: {
            weight: {
              value: Number(values.package.weight),
              units: values.package.weightUnits,
            },
            dimensions: {
              length: Number(values.package.length),
              width: Number(values.package.width),
              height: Number(values.package.height),
              units: values.package.dimUnits,
            },
          },
        };

        const response = await apiClient.post("/shipping/estimate", payload);
        // Pass both the API response (rates) AND the form data (addresses) to the next step
        onEstimateSuccess(response.data, payload);
      } catch (error: any) {
        setServerError(
          error.response?.data?.error || "Failed to get estimate."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Address */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-700">Pickup Address</h3>
          <div className="space-y-2">
            <Label>Street</Label>
            <Input
              name="pickup.streetLines"
              onChange={formik.handleChange}
              value={formik.values.pickup.streetLines}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>City</Label>
              <Input
                name="pickup.city"
                onChange={formik.handleChange}
                value={formik.values.pickup.city}
                required
              />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input
                name="pickup.postalCode"
                onChange={formik.handleChange}
                value={formik.values.pickup.postalCode}
                required
              />
            </div>
          </div>
          <div>
            <Label>Country (2-letter)</Label>
            <Input
              name="pickup.countryCode"
              onChange={formik.handleChange}
              value={formik.values.pickup.countryCode}
              maxLength={2}
              required
            />
          </div>
        </div>

        {/* Dropoff Address */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-700">Dropoff Address</h3>
          <div className="space-y-2">
            <Label>Street</Label>
            <Input
              name="dropoff.streetLines"
              onChange={formik.handleChange}
              value={formik.values.dropoff.streetLines}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>City</Label>
              <Input
                name="dropoff.city"
                onChange={formik.handleChange}
                value={formik.values.dropoff.city}
                required
              />
            </div>
            <div>
              <Label>Postal Code</Label>
              <Input
                name="dropoff.postalCode"
                onChange={formik.handleChange}
                value={formik.values.dropoff.postalCode}
                required
              />
            </div>
          </div>
          <div>
            <Label>Country (2-letter)</Label>
            <Input
              name="dropoff.countryCode"
              onChange={formik.handleChange}
              value={formik.values.dropoff.countryCode}
              maxLength={2}
              required
            />
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-4">Package Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label>Weight</Label>
            <Input
              type="number"
              name="package.weight"
              onChange={formik.handleChange}
              value={formik.values.package.weight}
              required
            />
          </div>
          <div>
            <Label>Unit</Label>
            <select
              name="package.weightUnits"
              onChange={formik.handleChange}
              value={formik.values.package.weightUnits}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="KG">KG</option>
              <option value="LB">LB</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
          <div>
            <Label>L</Label>
            <Input
              type="number"
              name="package.length"
              onChange={formik.handleChange}
              value={formik.values.package.length}
              required
            />
          </div>
          <div>
            <Label>W</Label>
            <Input
              type="number"
              name="package.width"
              onChange={formik.handleChange}
              value={formik.values.package.width}
              required
            />
          </div>
          <div>
            <Label>H</Label>
            <Input
              type="number"
              name="package.height"
              onChange={formik.handleChange}
              value={formik.values.package.height}
              required
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <Label>Dim Unit</Label>
            <select
              name="package.dimUnits"
              onChange={formik.handleChange}
              value={formik.values.package.dimUnits}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="CM">CM</option>
              <option value="IN">IN</option>
            </select>
          </div>
        </div>
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={formik.isSubmitting}
        variant="primary"
      >
        {formik.isSubmitting ? "Calculating Rates..." : "Get Rates"}
      </Button>
    </form>
  );
};

export default EstimateForm;
