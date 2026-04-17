"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { z } from "zod";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FiArrowRight,
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiHelpCircle,
} from "react-icons/fi";
import {
  CustomsData,
  IndividualClearanceData,
  ItemDetail,
} from "@/types/shipping";
import { Package, Address } from "@/store/shipment-store";

const ITEM_CATEGORIES = [
  { value: "9", label: "Document" },
  { value: "11", label: "Gift" },
  { value: "21", label: "Commercial Sample" },
  { value: "31", label: "Return Goods" },
  { value: "32", label: "Other" },
];

const createCustomsSchema = (type: "S" | "I") =>
  z.object({
    customsType: z.enum(["S", "I"]),
    firstName: z.string().min(1, "Item description is required"),
    secondaryName: z.string().min(1, "Sender Last Name is required"),
    categoryOfItem: z.string().min(1, "Category is required"),
    grossWeight: z.number().min(0.1, "Total weight required"),
    nipNr:
      type === "I"
        ? z.string().min(1, "NIP number is required for Individuals")
        : z.string().optional(),
    customsItem: z
      .array(
        z.object({
          nameEn: z.string().min(1, "Name required"),
          tariffCode: z.string().min(1, "Tariff Code required"),
        }),
      )
      .min(1, "At least one item must be declared"),
  });

interface CustomsFormProps {
  initialValues?: CustomsData | null;
  pkg: Package | null;
  sender: Address | null;
  currency?: string;
  onSubmit: (values: CustomsData) => void;
  onBack?: () => void;
  defaultCustomsType?: "S" | "I";
}

export default function CustomsForm({
  initialValues,
  pkg,
  sender,
  currency = "EUR",
  onSubmit,
  onBack,
  defaultCustomsType = "S",
}: CustomsFormProps) {
  const [activeTab, setActiveTab] = useState<"S" | "I">(
    initialValues?.customsType || defaultCustomsType,
  );

  const getInitialItems = () => {
    if (initialValues?.customsItem && initialValues.customsItem.length > 0) {
      return initialValues.customsItem.map(
        (ci: { item: ItemDetail | ItemDetail[] }) => {
          const payload = Array.isArray(ci.item) ? ci.item[0] : ci.item;
          return {
            nameEn: payload?.nameEn || "",
            tariffCode: payload?.tariffCode || "",
          };
        },
      );
    }
    return [
      {
        nameEn: pkg?.description || "",
        tariffCode: "",
      },
    ];
  };

  const formik = useFormik({
    initialValues: {
      customsType: activeTab,
      firstName: initialValues?.firstName || pkg?.description || "",
      secondaryName:
        initialValues?.secondaryName ||
        (sender ? sender.name.split(" ").slice(1).join(" ") : ""),
      categoryOfItem: initialValues?.categoryOfItem || "11",
      grossWeight: initialValues?.grossWeight || pkg?.weight || 1,
      nipNr: (initialValues as IndividualClearanceData)?.nipNr || "",
      customsItem: getInitialItems(),
    },
    enableReinitialize: false,
    validate: (values) => {
      const schema = createCustomsSchema(values.customsType as "S" | "I");
      try {
        schema.parse(values);
        return {};
      } catch (error: unknown) {
        type CustomsItemErrors = Record<string, string>;
        type CustomsFormErrors = {
          [key: string]: unknown;
          customsItem?: CustomsItemErrors[];
        };

        const formikErrors: CustomsFormErrors = {};
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors as Record<
            string,
            string[] | undefined
          >;

          Object.keys(fieldErrors).forEach((key) => {
            const messages = fieldErrors[key];
            if (messages && messages.length > 0) {
              formikErrors[key] = messages[0];
            }
          });

          // Handle array errors manually for formik
          const innerErrors = error.issues.filter((i) => i.path.length > 1);
          if (innerErrors.length > 0) {
            if (!formikErrors.customsItem) {
              formikErrors.customsItem = [];
            }

            innerErrors.forEach((err) => {
              if (err.path[0] === "customsItem") {
                const index = err.path[1] as number;
                const field = err.path[2] as string;

                if (!formikErrors.customsItem![index]) {
                  formikErrors.customsItem![index] = {};
                }

                formikErrors.customsItem![index][field] = err.message;
              }
            });
          }
        }
        return formikErrors;
      }
    },
    onSubmit: (values) => {
      // Auto-compute weight and value split evenly across items
      const itemCount = values.customsItem.length;
      const totalWeight = pkg?.weight || 1;
      const totalValue = pkg?.value || 1;

      const weightPerItem = Number((totalWeight / itemCount).toFixed(2));
      const valuePerItem = Number((totalValue / itemCount).toFixed(2));

      // Re-map the flattened items to the strict backend structure
      const formattedItems = values.customsItem.map((item) => ({
        item: [
          {
            nameEn: item.nameEn,
            quantity: 1,
            weight: weightPerItem,
            value: valuePerItem,
            tariffCode: item.tariffCode,
          },
        ],
      }));

      const basePayload = {
        customsType: values.customsType,
        currency,
        categoryOfItem: values.categoryOfItem,
        grossWeight: Number(values.grossWeight),
        firstName: values.firstName,
        secondaryName: values.secondaryName,
        customsItem: formattedItems,
      };

      if (values.customsType === "I") {
        onSubmit({
          ...basePayload,
          nipNr: values.nipNr,
        } as CustomsData);
      } else {
        onSubmit(basePayload as CustomsData);
      }
    },
  });

  const handleTypeChange = (type: "S" | "I") => {
    setActiveTab(type);
    formik.setFieldValue("customsType", type);
  };

  const labelStyles =
    "text-xs font-black uppercase tracking-tight text-gray-700 block mb-2";
  const errorStyles = "text-red-500 text-[11px] font-bold mt-1 ml-1 block";

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-1">
            Customs Details
          </h2>
          <p className="text-sm text-gray-500">
            Mandatory information for international shipping clearance.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border-gray-100 space-y-6">
          {/* Entity Toggle */}
          <div className="flex gap-4 p-1 bg-gray-50 rounded-xl mb-6 border border-gray-200">
            <button
              type="button"
              onClick={() => handleTypeChange("S")}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                activeTab === "S"
                  ? "bg-brand-blue text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Business (Simplified)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("I")}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                activeTab === "I"
                  ? "bg-brand-blue text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Individual
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Item Description</label>
              <Input
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Item Description (e.g., Cotton T-Shirt)"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <span className={errorStyles}>
                  {formik.errors.firstName as string}
                </span>
              )}
            </div>
            <div>
              <label className={labelStyles}>Last Name</label>
              <Input
                name="secondaryName"
                value={formik.values.secondaryName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Sender Last Name"
              />
              {formik.touched.secondaryName && formik.errors.secondaryName && (
                <span className={errorStyles}>
                  {formik.errors.secondaryName as string}
                </span>
              )}
            </div>

            <div>
              <label className={labelStyles}>Category of Item</label>
              <select
                name="categoryOfItem"
                value={formik.values.categoryOfItem}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full text-sm font-semibold h-12 rounded-xl bg-gray-50 border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent px-4 py-2 transition-all text-gray-900 placeholder:text-gray-400"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyles}>Total Gross Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                name="grossWeight"
                value={formik.values.grossWeight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 2.5"
              />
              {formik.touched.grossWeight && formik.errors.grossWeight && (
                <span className={errorStyles}>
                  {formik.errors.grossWeight as string}
                </span>
              )}
            </div>

            {activeTab === "I" && (
              <div className="md:col-span-2">
                <label className={labelStyles}>Sender NIP Number</label>
                <Input
                  name="nipNr"
                  value={formik.values.nipNr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 1234567890"
                />
                {formik.touched.nipNr && formik.errors.nipNr && (
                  <span className={errorStyles}>
                    {formik.errors.nipNr as string}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Declarations (Items) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border-gray-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
              Customs Declarations
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <FieldArray
            name="customsItem"
            render={(arrayHelpers) => (
              <div className="space-y-6">
                {formik.values.customsItem.map((item, index) => {
                  const errorBag =
                    (formik.errors.customsItem as ItemDetail[] | undefined)?.[
                      index
                    ] || {};
                  const touchedBag =
                    (formik.touched.customsItem as ItemDetail[] | undefined)?.[
                      index
                    ] || {};

                  return (
                    <div
                      key={index}
                      className="p-5 border border-gray-200 rounded-2xl relative bg-gray-50/50"
                    >
                      {formik.values.customsItem.length > 1 && (
                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                          <label className={labelStyles}>
                            Item Name / Description
                          </label>
                          <Input
                            name={`customsItem.${index}.nameEn`}
                            value={item.nameEn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="e.g. Cotton T-Shirt"
                          />
                          {(touchedBag as ItemDetail).nameEn &&
                            (errorBag as ItemDetail).nameEn && (
                              <span className={errorStyles}>
                                {(errorBag as ItemDetail).nameEn}
                              </span>
                            )}
                        </div>

                        <div className="md:col-span-1">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-black uppercase tracking-tight text-gray-700 block m-0">
                              Tariff / HS Code
                            </label>
                            <a
                              href="https://www.tariffnumber.com/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-brand-blue font-bold flex items-center hover:underline"
                            >
                              <FiHelpCircle className="mr-1" /> Find HS Code
                            </a>
                          </div>
                          <Input
                            name={`customsItem.${index}.tariffCode`}
                            value={item.tariffCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="e.g. 610910"
                          />
                          {(touchedBag as ItemDetail).tariffCode &&
                            (errorBag as ItemDetail).tariffCode && (
                              <span className={errorStyles}>
                                {(errorBag as ItemDetail).tariffCode}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    arrayHelpers.push({
                      nameEn: "",
                      tariffCode: "",
                    })
                  }
                  className="w-full h-12 border-dashed border-2 border-brand-blue/30 text-brand-blue font-bold hover:bg-brand-blue/5 rounded-xl"
                >
                  <FiPlus className="mr-2" /> Add Another Item
                </Button>
              </div>
            )}
          />
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
            Calculate Rates <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}
