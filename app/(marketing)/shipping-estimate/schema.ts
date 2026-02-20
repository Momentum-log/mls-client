import { z } from "zod";

// Shared schemas
export const contactSchema = z.object({
  personName: z.string().default("Estimate"),
  companyName: z.string().default(""),
  phoneNumber: z.string().default(""),
  email: z.string().email().optional().or(z.literal("")),
});

export const addressSchema = z.object({
  postalCode: z.string().min(1, "Postal code is required"),
  countryCode: z.string().min(2, "Country code is required"),
  streetLines: z.array(z.string()).min(1, "Street lines are required"),
  city: z.string().min(1, "City is required"),
  stateOrProvinceCode: z.string().min(2, "State/Province code is required"),
  residential: z.boolean().default(false),
  contact: contactSchema,
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
  userCountryCode: z.string().length(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// The simpler form schema (what the user interacts with)
export const shippingFormSchema = z.object({
  pickup: z.object({
    countryCode: z.string().min(2, "Country is required"),
    stateOrProvinceCode: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Zip code is required"),
    street: z.string().min(1, "Street address is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  }),
  dropoff: z.object({
    countryCode: z.string().min(2, "Country is required"),
    stateOrProvinceCode: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Zip code is required"),
    street: z.string().min(1, "Street address is required"),
  }),
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
