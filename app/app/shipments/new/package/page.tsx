"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShipmentStore, Package } from "@/store/shipment-store";
import Button from "@/components/ui/button";
import {
  FiArrowRight,
  FiArrowLeft,
  FiPackage,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const PackageSchema = z.object({
  weight: z.number().positive("Must be positive"),
  length: z.number().positive("Must be positive"),
  width: z.number().positive("Must be positive"),
  height: z.number().positive("Must be positive"),
  description: z.string().min(1, "Description is required"),
  value: z.number().positive("Must be positive"),
});

export default function PackagePage() {
  const router = useRouter();
  const { packages, setPackages, addPackage, removePackage, setStep } =
    useShipmentStore();
  const [isAdding, setIsAdding] = useState(packages.length === 0);

  useEffect(() => {
    setStep(2); // 2 index for third step
  }, [setStep]);

  const formik = useFormik({
    initialValues: {
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
      description: "",
      value: 0,
      currency: "PLN",
    },
    validationSchema: toFormikValidationSchema(PackageSchema),
    onSubmit: (values) => {
      addPackage({
        id: uuidv4(),
        ...values,
      });
      setIsAdding(false);
      formik.resetForm();
    },
  });

  const handleNext = () => {
    if (packages.length === 0) {
      setIsAdding(true);
      return;
    }
    router.push("/app/shipments/new/service");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-blue/10 rounded-full">
          <FiPackage className="w-6 h-6 text-brand-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
          <p className="text-sm text-gray-500">What are we shipping?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Existing Packages List */}
        {packages.length > 0 && (
          <div className="grid gap-4">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Package #{index + 1}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {pkg.description} — {pkg.weight}kg
                  </p>
                  <p className="text-xs text-gray-400">
                    {pkg.length}x{pkg.width}x{pkg.height} cm • Value:{" "}
                    {pkg.value} {pkg.currency}
                  </p>
                </div>
                <button
                  onClick={() => removePackage(pkg.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Package Form */}
        {(isAdding || packages.length === 0) && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              {packages.length > 0 ? "Add Another Package" : "Add Package"}
            </h3>
            <form
              id="package-form"
              onSubmit={formik.handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    onChange={formik.handleChange}
                    value={formik.values.weight}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Declared Value (USD)
                  </label>
                  <input
                    type="number"
                    name="value"
                    onChange={formik.handleChange}
                    value={formik.values.value}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    name="length"
                    onChange={formik.handleChange}
                    value={formik.values.length}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    name="width"
                    onChange={formik.handleChange}
                    value={formik.values.width}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    onChange={formik.handleChange}
                    value={formik.values.height}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  placeholder="e.g. Clothes, Documents"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.description}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {packages.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="secondary" size="sm">
                  <FiPlus className="mr-2" /> Add Package
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Action Button to add more if list is present */}
        {!isAdding && packages.length > 0 && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={() => setIsAdding(true)}
          >
            <FiPlus className="mr-2" /> Add Another Package
          </Button>
        )}

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
            className="min-w-[150px] ml-auto"
            onClick={handleNext}
            disabled={packages.length === 0 || isAdding}
          >
            Next Step <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
