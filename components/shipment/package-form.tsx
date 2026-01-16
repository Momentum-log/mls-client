"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import Button from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft, FiBox } from "react-icons/fi";
import { Package } from "@/store/shipment-store";
import { v4 as uuidv4 } from "uuid";

// Package Presets ported from Quote Page
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

const packageSchema = z.object({
  length: z.coerce.number().positive("Must be > 0"),
  width: z.coerce.number().positive("Must be > 0"),
  height: z.coerce.number().positive("Must be > 0"),
  weight: z.coerce.number().positive("Must be > 0"),
  value: z.coerce.number().min(0, "Value cannot be negative"),
  description: z.string().min(1, "Description is required"),
});

interface PackageFormProps {
  initialValue: Package | null;
  onSubmit: (pkg: Package) => void;
  onSync?: (pkg: Package) => void; // For real-time store updates
  onBack: () => void;
}

export default function PackageForm({
  initialValue,
  onSubmit,
  onSync,
  onBack,
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

  const [selectedPreset, setSelectedPreset] = useState<string>(
    findPresetId(initialValue)
  );

  // Sync with store in real-time (Requirement: "I want that to be updating every time I update")
  // Using a ref to avoid infinite loops if parents re-render
  const lastEmailedValues = React.useRef<string>("");

  const formik = useFormik({
    initialValues: initialValue || {
      id: uuidv4(),
      length: PACKAGE_PRESETS[0].dims.length,
      width: PACKAGE_PRESETS[0].dims.width,
      height: PACKAGE_PRESETS[0].dims.height,
      weight: PACKAGE_PRESETS[0].weight,
      description: "",
      value: 0,
      currency: "USD",
    },
    enableReinitialize: false,
    validate: (values) => {
      try {
        packageSchema.parse(values);
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
            if (messages && messages.length > 0)
              formikErrors[key] = messages[0];
          });
          return formikErrors;
        }
        return {};
      }
    },
    onSubmit: (values) => {
      const parsedValues = packageSchema.parse(values);
      onSubmit({ ...values, ...parsedValues } as Package);
    },
  });

  // Real-time synchronization Effect
  useEffect(() => {
    const currentValuesStr = JSON.stringify(formik.values);
    if (currentValuesStr !== lastEmailedValues.current) {
      lastEmailedValues.current = currentValuesStr;
      // We don't parse here to avoid showing validation errors while typing,
      // but we do ensure the store has the latest visual data.
      if (onSync) {
        onSync(formik.values as Package);
      }
    }
  }, [formik.values, onSubmit]);

  const handlePresetChange = (id: string) => {
    setSelectedPreset(id);
    const preset = PACKAGE_PRESETS.find((p) => p.id === id);
    if (preset && id !== "custom") {
      formik.setFieldValue("length", preset.dims.length);
      formik.setFieldValue("width", preset.dims.width);
      formik.setFieldValue("height", preset.dims.height);
      formik.setFieldValue("weight", preset.weight);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-gray-900 mb-1">
          Package Details
        </h2>
        <p className="text-sm text-gray-500">Tell us what you're shipping.</p>
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
              onClick={() => handlePresetChange(preset.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                selectedPreset === preset.id
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
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Physical Dimensions (cm)
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
                  name={dim.id}
                  value={formik.values[dim.id as keyof typeof formik.values]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border text-center font-bold bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all ${
                    selectedPreset !== "custom"
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
              <label className="text-xs font-black uppercase tracking-tight text-gray-700">
                Weight (KG)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-5 py-3.5 rounded-2xl border font-bold bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all ${
                    selectedPreset !== "custom"
                      ? "opacity-50 pointer-events-none bg-gray-50"
                      : "border-gray-200"
                  }`}
                  placeholder="0.00"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">
                  KG
                </span>
              </div>
              {formik.touched.weight && formik.errors.weight && (
                <p className="text-[11px] text-red-500 font-bold ml-1">
                  {formik.errors.weight}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-tight text-gray-700">
                Declared Value (USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 font-bold bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                  placeholder="0.00"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">
                  USD
                </span>
              </div>
              {formik.touched.value && formik.errors.value && (
                <p className="text-[11px] text-red-500 font-bold ml-1">
                  {formik.errors.value}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Description - Full Width */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-tight text-gray-700">
          Content Description
        </label>
        <input
          type="text"
          {...formik.getFieldProps("description")}
          className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-medium bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
          placeholder="What's inside? (e.g. Cotton T-shirts, Electronics, etc.)"
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-[11px] text-red-500 font-bold ml-1">
            {formik.errors.description}
          </p>
        )}
      </div>

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
          Calculate Rates <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </form>
  );
}
