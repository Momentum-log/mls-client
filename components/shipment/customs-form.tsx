"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { z } from "zod";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FiArrowRight,
  FiArrowLeft,
  FiHelpCircle,
} from "react-icons/fi";
import {
  CustomsData,
  ItemDetail,
} from "@/types/shipping";
import { Package, Address } from "@/store/shipment-store";
import { AccountVerificationModal } from "@/components/shipment/account-verification-modal";
import { useVerification } from "@/hooks/shipments/useVerification";
import {
  customsTypeForUser,
  customsTypeLabel,
  isCategoryAllowed,
  itemCategoriesFor,
} from "@/utils/account-type";

/**
 * The declarations the shipper makes about the parcel.
 *
 * The two `not*Goods` keys are typed `enum [true]` server-side — the schema
 * rejects `false` outright. They are attestations, not toggles, so an unticked
 * box blocks submit rather than being sent as `false`.
 */
const AGREEMENTS: Record<
  "S" | "I",
  { name: AgreementKey; label: string }[]
> = {
  S: [
    {
      name: "notExceedValue",
      label: "The declared value of the goods is accurate.",
    },
    {
      name: "notProhibitedGoods",
      label: "The parcel contains no prohibited goods.",
    },
    {
      name: "notRestrictedGoods",
      label: "The parcel contains no restricted goods.",
    },
    {
      name: "invoiceContent",
      label: "The invoice matches the contents of the parcel.",
    },
  ],
  I: [
    {
      name: "notProhibitedGoods",
      label: "The parcel contains no prohibited goods.",
    },
    {
      name: "notRestrictedGoods",
      label: "The parcel contains no restricted goods.",
    },
  ],
};

type AgreementKey =
  | "notExceedValue"
  | "notProhibitedGoods"
  | "notRestrictedGoods"
  | "invoiceContent";

const createCustomsSchema = (type: "S" | "I") =>
  z.object({
    firstName: z
      .string()
      .min(1, "Item description is required")
      .max(30, "Must be 30 characters or fewer"),
    secondaryName: z
      .string()
      .min(1, "Sender Last Name is required")
      .max(30, "Must be 30 characters or fewer"),
    categoryOfItem: z
      .string()
      .min(1, "Category is required")
      .refine((value) => isCategoryAllowed(type, value), {
        message: "Category is not available for this declaration type",
      }),
    grossWeight: z.number().min(0.1, "Total weight required"),
    nipNr:
      type === "S"
        ? z.string().min(1, "NIP number is required for Businesses")
        : z.string().optional(),
    // `z.literal(true)` is what blocks submit — the same validator as every
    // other field, rather than an ad-hoc guard in the submit handler.
    notProhibitedGoods: z.literal(true, {
      message: "You must confirm this to continue",
    }),
    notRestrictedGoods: z.literal(true, {
      message: "You must confirm this to continue",
    }),
    notExceedValue:
      type === "S"
        ? z.literal(true, { message: "You must confirm this to continue" })
        : z.boolean(),
    invoiceContent:
      type === "S"
        ? z.literal(true, { message: "You must confirm this to continue" })
        : z.boolean(),
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
  packages: Package[];
  sender: Address | null;
  currency?: string;
  onSubmit: (values: CustomsData) => void;
  onBack?: () => void;
}

export default function CustomsForm({
  initialValues,
  packages = [],
  sender,
  currency = "EUR",
  onSubmit,
  onBack,
}: CustomsFormProps) {
  const {
    user,
    isVerificationRequired,
    triggerVerification,
    verificationStatusChanged,
  } = useVerification();

  // The declaration branch comes from the account, never from the customer.
  // Asking again would let them file a business declaration on an individual
  // account, which the server accepts but which is wrong.
  const customsType = customsTypeForUser(user);
  const categories = itemCategoriesFor(customsType);
  const profileNip = user?.nip?.trim() || "";

  const [showVerificationModal, setShowVerificationModal] = useState(
    isVerificationRequired,
  );

  // Update modal visibility when verification status changes
  React.useEffect(() => {
    setShowVerificationModal(isVerificationRequired);
  }, [isVerificationRequired]);

  // Auto-close modal when verification status changes from required to not required
  React.useEffect(() => {
    if (verificationStatusChanged && !isVerificationRequired) {
      setShowVerificationModal(false);
    }
  }, [verificationStatusChanged, isVerificationRequired]);

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
    return packages.map((pkg) => ({
      nameEn: pkg.description || "Package Item",
      tariffCode: "",
    }));
  };

  const totalPackagesWeight = packages.reduce((acc, p) => acc + p.weight, 0);

  const formik = useFormik({
    initialValues: {
      firstName: initialValues?.firstName || packages[0]?.description || "Multiple Package Shipment",
      secondaryName:
        initialValues?.secondaryName ||
        (sender ? sender.name.split(" ").slice(1).join(" ") : ""),
      // A stored category can become invalid if the account type changed after
      // customs were captured — "31"/"91" are business-only.
      categoryOfItem:
        initialValues?.categoryOfItem &&
        isCategoryAllowed(customsType, initialValues.categoryOfItem)
          ? initialValues.categoryOfItem
          : "11",
      grossWeight: initialValues?.grossWeight || totalPackagesWeight || 1,
      // Prefilled from the profile when the NIP was captured at sign-up, so the
      // field never has to be shown again.
      nipNr:
        (initialValues && "nipNr" in initialValues
          ? (initialValues as { nipNr?: string }).nipNr || ""
          : "") || profileNip,
      notExceedValue: false,
      notProhibitedGoods: false,
      notRestrictedGoods: false,
      invoiceContent: false,
      customsItem: getInitialItems(),
    },
    enableReinitialize: false,
    validate: (values) => {
      const schema = createCustomsSchema(customsType);
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
            if (!formikErrors.customsItem || typeof formikErrors.customsItem === "string") {
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
      // Re-map the flattened items to the strict backend structure
      const formattedItems = values.customsItem.map((item, idx) => {
        const pkgItem = packages[idx] || packages[0];
        return {
          item: [
            {
              nameEn: item.nameEn || pkgItem.description || "Package Item",
              quantity: 1,
              weight: pkgItem.weight,
              value: pkgItem.value,
              tariffCode: item.tariffCode,
            },
          ],
        };
      });

      const basePayload = {
        customsType,
        currency,
        categoryOfItem: values.categoryOfItem,
        grossWeight: Number(values.grossWeight),
        firstName: values.firstName,
        secondaryName: values.secondaryName,
        customsItem: formattedItems,
      };

      // `customAgreements` is all-or-nothing: send the object and every key in
      // that branch is required, so each branch builds its own.
      if (customsType === "S") {
        onSubmit({
          ...basePayload,
          nipNr: values.nipNr,
          customAgreements: {
            notExceedValue: values.notExceedValue,
            notProhibitedGoods: true,
            notRestrictedGoods: true,
            invoiceContent: values.invoiceContent,
          },
        } as CustomsData);
      } else {
        onSubmit({
          ...basePayload,
          customAgreements: {
            notProhibitedGoods: true,
            notRestrictedGoods: true,
          },
        } as CustomsData);
      }
    },
  });

  const labelStyles =
    "text-xs font-black uppercase tracking-tight text-gray-700 block mb-2";
  const errorStyles = "text-red-500 text-[11px] font-bold mt-1 ml-1 block";

  // The account can arrive or change after this form has mounted — the session
  // is refreshed in the background on app open. `customsType` itself is derived
  // on every render so it never goes stale, but the chosen category is real form
  // state and "31"/"91" are business-only, so a branch change can strand an
  // option the new branch will not accept.
  React.useEffect(() => {
    if (!isCategoryAllowed(customsType, formik.values.categoryOfItem)) {
      formik.setFieldValue("categoryOfItem", "11");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customsType, formik.values.categoryOfItem]);

  const handleVerifyAccount = () => {
    triggerVerification();
  };

  return (
    <>
      <AccountVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerifyAccount}
        requiresAddressUpdate={false}
        requiresEmailVerification={true}
      />

      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          className={`space-y-8 transition-opacity duration-200 ${
            showVerificationModal ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Customs Details
            </h2>
            <p className="text-sm text-gray-500">
              Mandatory information for international shipping clearance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 space-y-6">
            {/* Declaration type. Read-only — it follows the account type, which
                only an admin can change. */}
            <div className="p-4 bg-gray-50 rounded-xl mb-6 border border-gray-200">
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">
                Declaration Type
              </p>
              <p className="font-bold text-gray-900 leading-tight">
                {customsTypeLabel(customsType)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Taken from your account type. Contact support to change it.
              </p>
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
                {formik.touched.secondaryName &&
                  formik.errors.secondaryName && (
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
                  className="w-full text-sm font-semibold h-12 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent px-4 py-2 transition-all text-gray-900 placeholder:text-gray-400"
                >
                  {categories.map((cat) => (
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

              {/* Business only, and only when the profile has no NIP — a NIP
                  captured at sign-up is prefilled and never asked for again. */}
              {customsType === "S" && !profileNip && (
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
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                Customs Declarations (1-to-1 sync with packages)
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <FieldArray
              name="customsItem"
              render={() => (
                <div className="space-y-6">
                  {formik.values.customsItem.map((item, index) => {
                    const errorBag =
                      (formik.errors.customsItem as ItemDetail[] | undefined)?.[
                        index
                      ] || {};
                    const touchedBag =
                      (
                        formik.touched.customsItem as ItemDetail[] | undefined
                      )?.[index] || {};

                    return (
                      <div
                        key={index}
                        className="p-5 border border-gray-200 rounded-2xl relative bg-gray-50/50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-1">
                            <label className={labelStyles}>
                              Item Name / Description (Package #{index + 1})
                            </label>
                            <Input
                              name={`customsItem.${index}.nameEn`}
                              value={item.nameEn}
                              disabled
                              className="bg-gray-100 opacity-70 cursor-not-allowed font-semibold text-gray-600"
                              placeholder="Pre-populated from Package"
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
                </div>
              )}
            />
          </div>

          {/* Shipper declarations. Sent as `customAgreements`, which is
              all-or-nothing — the branch's full key set or nothing at all. */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 space-y-4">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                Your Declarations
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Confirm each statement below. These are declarations to customs
                about your parcel.
              </p>
            </div>

            <div className="space-y-3">
              {AGREEMENTS[customsType].map((agreement) => {
                const hasError =
                  formik.touched[agreement.name] &&
                  formik.errors[agreement.name];

                return (
                  <label
                    key={agreement.name}
                    htmlFor={agreement.name}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      hasError
                        ? "border-red-500 bg-red-50/50"
                        : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                    }`}
                  >
                    <input
                      id={agreement.name}
                      name={agreement.name}
                      type="checkbox"
                      checked={Boolean(formik.values[agreement.name])}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-brand-blue cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700 leading-snug">
                      {agreement.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {AGREEMENTS[customsType].some(
              (agreement) =>
                formik.touched[agreement.name] && formik.errors[agreement.name],
            ) && (
              <span className={errorStyles}>
                All declarations must be confirmed before you can continue.
              </span>
            )}
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
    </>
  );
}
