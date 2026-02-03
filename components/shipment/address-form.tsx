"use client";

import React from "react";
import { useFormik, FormikProvider } from "formik";
import { z } from "zod";
import Button from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Address } from "@/store/shipment-store";
import AddressFields from "@/components/shared/address-fields";
import { Input } from "@/components/ui/input";

/**
 * Base Validation Schema using Zod.
 */
const createAddressSchema = (isStateRequired: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    street: z
      .string()
      .min(1, "Street address is required")
      .max(35, "Street address cannot exceed 35 characters"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    stateOrProvinceCode: isStateRequired
      ? z.string().min(1, "State/Province is required")
      : z.string().optional(),
    phone: z.string().min(1, "Phone number is required"),
  });

interface AddressFormProps {
  initialValues?: Partial<Address>;
  onSubmit: (values: Address) => void;
  onBack?: () => void;
  type: "pickup" | "dropoff";
}

export default function AddressForm({
  initialValues,
  onSubmit,
  onBack,
  type,
}: AddressFormProps) {
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || "",
      company: initialValues?.company || "",
      street: initialValues?.street || "",
      city: initialValues?.city || "",
      stateOrProvinceCode: initialValues?.stateOrProvinceCode || "",
      postalCode: initialValues?.postalCode || "",
      country: initialValues?.country || "",
      phone: initialValues?.phone || "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const isStateRequired =
        values.country === "US" || values.country === "CA";
      const schema = createAddressSchema(isStateRequired);
      try {
        schema.parse(values);
        return {};
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors as Record<
            string,
            string[] | undefined
          >;
          const formikErrors: Record<string, string> = {};
          Object.keys(fieldErrors).forEach((key) => {
            const messages = fieldErrors[key];
            if (messages && messages.length > 0) {
              formikErrors[key] = messages[0];
            }
          });
          return formikErrors;
        }
        return {};
      }
    },
    onSubmit: (values) => {
      onSubmit(values as Address);
    },
  });

  const title = type === "pickup" ? "Pick-up Details" : "Drop-off Details";
  const subtitle =
    type === "pickup"
      ? "Where should we collect the package?"
      : "Where is the package going?";

  const labelStyles =
    "text-xs font-black uppercase tracking-tight text-gray-700 block mb-2";

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8  border-gray-100 space-y-6">
          {/* Contact Person Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                Contact Person
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelStyles}>Full Name</label>
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. John Doe"
                  className={
                    formik.touched.name && formik.errors.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className={labelStyles}>Company (Optional)</label>
                <Input
                  name="company"
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Phone Number</label>
                <Input
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="+48 000 000 000"
                  className={
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">
                    {formik.errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Address Section */}
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                Physical Address
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddressFields />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          {onBack ? (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="text-gray-500 font-bold"
            >
              <FiArrowLeft className="mr-2" /> Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="min-w-[180px] shadow-xl shadow-brand-blue/20 bg-brand-blue text-white"
          >
            Continue <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}
