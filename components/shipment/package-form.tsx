"use client";

import React, { useEffect } from "react";
import { useFormik, FormikProvider, FieldArray, FormikErrors, FormikTouched } from "formik";
import { z } from "zod";
import Button from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { Package } from "@/store/shipment-store";
import { v4 as uuidv4 } from "uuid";

// Package Presets
const PACKAGE_PRESETS = [
  {
    id: "envelope",
    name: "Envelope",
    icon: "✉️",
    dims: { length: 35, width: 25, height: 2 },
    weight: 0.5,
  },
  {
    id: "book-box",
    name: "Book Box",
    icon: "📚",
    dims: { length: 30, width: 20, height: 15 },
    weight: 2,
  },
  {
    id: "laptop-box",
    name: "Laptop Box",
    icon: "💻",
    dims: { length: 45, width: 35, height: 10 },
    weight: 3,
  },
  {
    id: "luggage",
    name: "Luggage",
    icon: "🧳",
    dims: { length: 70, width: 50, height: 30 },
    weight: 20,
  },
  {
    id: "custom",
    name: "Custom",
    icon: "📦",
    dims: { length: 0, width: 0, height: 0 },
    weight: 0,
  },
];

const createPackageItemSchema = (isInternational: boolean) => z.object({
  id: z.string(),
  length: z.coerce.number().positive("Must be > 0"),
  width: z.coerce.number().positive("Must be > 0"),
  height: z.coerce.number().positive("Must be > 0"),
  weight: z.coerce.number().positive("Must be > 0"),
  value: isInternational ? z.coerce.number().positive("Declared value is required for international shipments") : z.coerce.number().min(0, "Value cannot be negative"),
  description: z.string().min(1, "Description is required"),
  currency: z.string(),
});

const createPackagesFormSchema = (isInternational: boolean) => z.object({
  globalWeightUnit: z.enum(["KG", "LB"]),
  globalDimUnit: z.enum(["CM", "IN"]),
  packages: z.array(createPackageItemSchema(isInternational)).min(1, "At least one package is required"),
});

interface PackageFormProps {
  initialValues: Package[] | null;
  onSubmit: (pkgs: Package[]) => void;
  onSync?: (pkgs: Package[]) => void; // For real-time store updates
  onBack: () => void;
  submitLabel?: string;
  isInternational?: boolean;
  currency?: string;
}

export default function PackageForm({
  initialValues,
  onSubmit,
  onSync,
  onBack,
  submitLabel = "Calculate Rates",
  isInternational = false,
  currency = "EUR",
}: PackageFormProps) {
  // Detect matching preset or default to first preset/custom
  const findPresetId = (val: Package | null) => {
    if (!val) return PACKAGE_PRESETS[0].id;
    const match = PACKAGE_PRESETS.find(
      (p) =>
        p.id !== "custom" &&
        p.dims.length === val.length &&
        p.dims.width === val.width &&
        p.dims.height === val.height &&
        p.weight === val.weight
    );
    return match ? match.id : "custom";
  };

  // Sync with store in real-time (Requirement: "I want that to be updating every time I update")
  const lastEmailedValues = React.useRef<string>("");

  const getInitialPackages = () => {
    if (initialValues && initialValues.length > 0) {
      return initialValues;
    }
    return [
      {
        id: uuidv4(),
        length: PACKAGE_PRESETS[0].dims.length,
        width: PACKAGE_PRESETS[0].dims.width,
        height: PACKAGE_PRESETS[0].dims.height,
        weight: PACKAGE_PRESETS[0].weight,
        description: "",
        value: 0,
        currency: currency,
      },
    ];
  };

  const formik = useFormik({
    initialValues: {
      globalWeightUnit: "KG" as "KG" | "LB",
      globalDimUnit: "CM" as "CM" | "IN",
      packages: getInitialPackages(),
    },
    enableReinitialize: false,
    validate: (values) => {
      const schema = createPackagesFormSchema(isInternational);
      try {
        schema.parse(values);
        return {};
      } catch (error: unknown) {
        const formikErrors: { packages?: Record<string, string>[] } = {};
        if (error instanceof z.ZodError) {
          const innerErrors = error.issues.filter((i) => i.path.length > 1);
          if (innerErrors.length > 0) {
            formikErrors.packages = [];
            innerErrors.forEach((err) => {
              if (err.path[0] === "packages") {
                const index = err.path[1] as number;
                const field = err.path[2] as string;
                if (!formikErrors.packages![index]) {
                  formikErrors.packages![index] = {};
                }
                formikErrors.packages![index][field] = err.message;
              }
            });
          }
        }
        return formikErrors;
      }
    },
    onSubmit: (values) => {
      onSubmit(values.packages as Package[]);
    },
  });

  // Real-time synchronization Effect
  useEffect(() => {
    const currentValuesStr = JSON.stringify(formik.values.packages);
    if (currentValuesStr !== lastEmailedValues.current) {
      lastEmailedValues.current = currentValuesStr;
      if (onSync) {
        onSync(formik.values.packages as Package[]);
      }
    }
  }, [formik.values.packages, onSync]);

  const labelStyles = "text-xs font-black uppercase tracking-tight text-gray-700 block mb-2";
  const errorStyles = "text-red-500 text-[11px] font-bold mt-1 ml-1 block";

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Package Details
            </h2>
            <p className="text-sm text-gray-500">{"Tell us what you're shipping."}</p>
          </div>
          {/* Global Unit Selector */}
          <div className="flex gap-2 p-1 bg-gray-50 border border-gray-200 rounded-xl">
            <button
              type="button"
              onClick={() => {
                formik.setFieldValue("globalWeightUnit", "KG");
                formik.setFieldValue("globalDimUnit", "CM");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                formik.values.globalWeightUnit === "KG"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Metric (KG/CM)
            </button>
            <button
              type="button"
              onClick={() => {
                formik.setFieldValue("globalWeightUnit", "LB");
                formik.setFieldValue("globalDimUnit", "IN");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                formik.values.globalWeightUnit === "LB"
                  ? "bg-brand-blue text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Imperial (LB/IN)
            </button>
          </div>
        </div>

        <FieldArray
          name="packages"
          render={(arrayHelpers) => (
            <div className="space-y-8">
              {formik.values.packages.map((pkg, index) => {
                const pkgPreset = findPresetId(pkg);
                const errorsBag = (formik.errors.packages as Array<FormikErrors<Package> | undefined>)?.[index] || {};
                const touchedBag = (formik.touched.packages as Array<FormikTouched<Package> | undefined>)?.[index] || {};

                return (
                  <div
                    key={pkg.id || index}
                    className="p-6 border border-gray-200 rounded-2xl relative bg-gray-50/50 space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                        Package #{index + 1}
                      </span>
                      {formik.values.packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Preset Selection (High-contrast Buttons) */}
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-tight text-gray-700">
                        Quick Presets
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {PACKAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              formik.setFieldValue(`packages.${index}.selectedPreset`, preset.id);
                              if (preset.id !== "custom") {
                                formik.setFieldValue(`packages.${index}.length`, preset.dims.length);
                                formik.setFieldValue(`packages.${index}.width`, preset.dims.width);
                                formik.setFieldValue(`packages.${index}.height`, preset.dims.height);
                                formik.setFieldValue(`packages.${index}.weight`, preset.weight);
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                              pkgPreset === preset.id
                                ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-2 ring-brand-blue/10"
                                : "border-gray-100 hover:border-brand-blue/30 text-gray-500 bg-white"
                            }`}
                          >
                            <span className="text-2xl mb-2">{preset.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Dimensions Group */}
                      <div className="space-y-4">
                        <label className={labelStyles}>
                          Physical Dimensions ({formik.values.globalDimUnit})
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "length", label: "Length" },
                            { id: "width", label: "Width" },
                            { id: "height", label: "Height" },
                          ].map((dim) => (
                            <div key={dim.id} className="space-y-1">
                              <input
                                type="number"
                                name={`packages.${index}.${dim.id}`}
                                value={pkg[dim.id as keyof Package]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 rounded-xl border text-center font-bold bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all ${
                                  pkgPreset !== "custom"
                                    ? "opacity-50 pointer-events-none bg-gray-50"
                                    : "border-gray-200"
                                }`}
                                placeholder={dim.label[0]}
                              />
                              <span className="text-[10px] uppercase font-black text-gray-400 block text-center tracking-widest">
                                {dim.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weight & Value Group */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className={labelStyles}>
                              Weight ({formik.values.globalWeightUnit})
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                name={`packages.${index}.weight`}
                                value={pkg.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-5 py-3.5 rounded-2xl border font-bold bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all ${
                                  pkgPreset !== "custom"
                                    ? "opacity-50 pointer-events-none bg-gray-50"
                                    : "border-gray-200"
                                }`}
                                placeholder="0.00"
                              />
                              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                {formik.values.globalWeightUnit}
                              </span>
                            </div>
                            {touchedBag.weight && errorsBag.weight && (
                              <p className={errorStyles}>
                                {errorsBag.weight}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className={labelStyles}>
                              Declared Value ({currency})
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                name={`packages.${index}.value`}
                                value={pkg.value}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 font-bold bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                                placeholder="0.00"
                              />
                              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                {currency}
                              </span>
                            </div>
                            {touchedBag.value && errorsBag.value && (
                              <p className={errorStyles}>
                                {errorsBag.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Description - Full Width */}
                    <div className="space-y-2">
                      <label className={labelStyles}>
                        Content Description
                      </label>
                      <input
                        type="text"
                        name={`packages.${index}.description`}
                        value={pkg.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-medium bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                        placeholder="What's inside? (e.g. Cotton T-shirts, Electronics, etc.)"
                      />
                      {touchedBag.description && errorsBag.description && (
                        <p className={errorStyles}>
                          {errorsBag.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  arrayHelpers.push({
                    id: uuidv4(),
                    length: PACKAGE_PRESETS[0].dims.length,
                    width: PACKAGE_PRESETS[0].dims.width,
                    height: PACKAGE_PRESETS[0].dims.height,
                    weight: PACKAGE_PRESETS[0].weight,
                    description: "",
                    value: 0,
                    currency: currency,
                  })
                }
                className="w-full h-12 border-dashed border-2 border-brand-blue/30 text-brand-blue font-bold hover:bg-brand-blue/5 rounded-xl flex items-center justify-center bg-white"
              >
                <FiPlus className="mr-2" /> Add Another Package
              </Button>
            </div>
          )}
        />

        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="text-gray-500 font-bold"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="min-w-[180px] shadow-xl shadow-brand-blue/20"
          >
            {submitLabel} <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}
