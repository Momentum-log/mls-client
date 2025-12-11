import { z } from "zod";

// Shared schemas
export const addressSchema = z.object({
  postalCode: z.string().min(1, "Postal code is required"),
  countryCode: z.string().min(2, "Country code is required"),
  streetLines: z.array(z.string()).min(1, "Street lines are required"),
  city: z.string().min(1, "City is required"),
  stateOrProvinceCode: z.string().min(2, "State/Province code is required"),
  residential: z.boolean().default(false),
});

export const weightSchema = z.object({
  units: z.enum(["KG", "LB"]),
  value: z.number().min(0.1, "Weight must be at least 0.1"),
});

export const dimensionsSchema = z.object({
  length: z.number().min(1, "Length is required"),
  width: z.number().min(1, "Width is required"),
  height: z.number().min(1, "Height is required"),
  units: z.enum(["CM", "IN"]),
});

export const packageDetailsSchema = z.object({
  weight: weightSchema,
  dimensions: dimensionsSchema,
});

// The strict payload schema (what we send to mutation)
export const shippingEstimatePayloadSchema = z.object({
  pickup: addressSchema,
  dropoff: addressSchema,
  package: packageDetailsSchema,
  guestId: z.string().min(1, "Guest ID is required"),
});

// The simpler form schema (what the user interacts with)
export const shippingFormSchema = z.object({
  shippingMode: z.enum(["local", "import", "export"]),
  pickupLocation: z.string().min(2, "Please select a pickup location"),
  dropoffLocation: z.string().min(2, "Please select a drop-off location"),
  selectedPreset: z.string(),
  package: z.object({
    weight: z.number().min(0.1, "Weight must be greater than 0"),
    dimensions: z.object({
      length: z.number().min(1, "Length must be at least 1"),
      width: z.number().min(1, "Width must be at least 1"),
      height: z.number().min(1, "Height must be at least 1"),
    }),
  }),
  isStackable: z.boolean(),
});

export type ShippingFormValues = z.infer<typeof shippingFormSchema>;
