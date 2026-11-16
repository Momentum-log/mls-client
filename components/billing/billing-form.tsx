"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { FaGlobe } from "react-icons/fa6";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { useCountries } from "@/hooks/location/use-location";
import { useSaveBillingProfile, useValidateTaxId } from "@/hooks/billing/use-billing";
import type {
  BillingPrefill,
  BillingProfile,
  TaxCheckStatus,
} from "@/types/billing";
import { taxCheckNotice, taxIdLabel } from "@/utils/billing";
import { extractApiError } from "@/utils/error-handler";

interface BillingFormValues {
  fullName: string;
  isBusiness: boolean;
  companyName: string;
  taxId: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email: string;
  phone: string;
}

const required = (label: string) => z.string().trim().min(1, `${label} is required`);

const billingSchema = z
  .object({
    fullName: required("Name").min(2, "Name is too short"),
    isBusiness: z.boolean(),
    companyName: z.string().trim(),
    taxId: z.string().trim(),
    street: required("Street address").min(2, "Street address is too short"),
    postalCode: required("Postcode"),
    city: required("City"),
    countryCode: required("Country"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().min(5, "Enter a valid phone number"),
  })
  .superRefine((values, ctx) => {
    if (!values.isBusiness) return;
    if (!values.companyName) {
      ctx.addIssue({ code: "custom", path: ["companyName"], message: "Company name is required" });
    }
    if (!values.taxId) {
      ctx.addIssue({ code: "custom", path: ["taxId"], message: "Tax ID is required" });
    }
  });

const validate = (values: BillingFormValues) => {
  const result = billingSchema.safeParse(values);
  if (result.success) return {};
  const errors: Partial<Record<keyof BillingFormValues, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof BillingFormValues | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
};

interface BillingFormProps {
  /** The saved profile; null when there is none yet. */
  profile: BillingProfile | null;
  /** Seeds an empty form from the account. */
  prefill: BillingPrefill | null;
  /** The account phone, used when nothing is saved. */
  defaultPhone?: string | null;
  submitLabel: string;
  onSaved: (profile: BillingProfile) => void;
  /** Shown above the form, e.g. when the server asked for billing details. */
  notice?: string | null;
}

const noticeStyles = {
  ok: "text-green-700",
  warn: "text-warning-fg",
  info: "text-gray-600",
} as const;

/**
 * Billing details: who the invoice is for. Saved on the account, so the
 * customer types them once. Ordering as a business adds a company name and a
 * tax ID, which is checked with the official register (Biała lista for a
 * Polish NIP, VIES for another EU VAT number). A register that is down never
 * blocks the order; the notice says we will verify it.
 */
export default function BillingForm({
  profile,
  prefill,
  defaultPhone,
  submitLabel,
  onSaved,
  notice,
}: BillingFormProps) {
  const { data: countries = [] } = useCountries();
  const { mutateAsync: save } = useSaveBillingProfile();
  const { mutateAsync: check, isPending: isChecking } = useValidateTaxId();
  const [serverError, setServerError] = useState<string | null>(null);
  const [checked, setChecked] = useState<{
    key: string;
    status: TaxCheckStatus;
  } | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);

  const formik = useFormik<BillingFormValues>({
    initialValues: {
      fullName: profile?.fullName ?? prefill?.fullName ?? "",
      isBusiness: profile?.isBusiness ?? prefill?.isBusiness ?? false,
      companyName: profile?.companyName ?? prefill?.companyName ?? "",
      taxId: profile?.taxId ?? prefill?.taxId ?? "",
      street: profile?.street ?? "",
      postalCode: profile?.postalCode ?? "",
      city: profile?.city ?? "",
      countryCode: profile?.countryCode ?? "",
      email: profile?.email ?? prefill?.email ?? "",
      phone: profile?.phone ?? defaultPhone ?? "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const business = values.isBusiness;
        const saved = await save({
          fullName: values.fullName.trim(),
          street: values.street.trim(),
          postalCode: values.postalCode.trim(),
          city: values.city.trim(),
          countryCode: values.countryCode,
          email: values.email.trim(),
          phone: values.phone.trim(),
          isBusiness: business,
          ...(business
            ? { companyName: values.companyName.trim(), taxId: values.taxId.trim() }
            : {}),
        });
        onSaved(saved.profile);
      } catch (error) {
        setServerError(
          extractApiError(error).message ||
            "We could not save your billing details. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, touched } = formik;
  const fieldError = (name: keyof BillingFormValues) =>
    touched[name] ? errors[name] : undefined;
  const errorId = (name: string) => `billing-${name}-error`;
  const inputProps = (name: keyof BillingFormValues) => ({
    name,
    id: `billing-${name}`,
    "aria-invalid": fieldError(name) ? true : undefined,
    "aria-describedby": fieldError(name) ? errorId(name) : undefined,
    onBlur: formik.handleBlur,
    className: fieldError(name) ? "border-red-400" : undefined,
  });
  const renderError = (name: keyof BillingFormValues) =>
    fieldError(name) ? (
      <p id={errorId(name)} role="alert" className="m-0 mt-1.5 text-xs font-medium text-red-600">
        {fieldError(name)}
      </p>
    ) : null;

  const taxLabel = taxIdLabel(values.countryCode);
  const taxKey = `${values.countryCode}:${values.taxId.trim()}`;
  const liveCheck = checked?.key === taxKey ? taxCheckNotice(checked.status) : null;
  // Before the customer changes anything, show what the saved number last got.
  const savedStatus =
    profile?.isBusiness && profile.taxId === values.taxId.trim()
      ? profile.lastValidation?.status
      : undefined;
  const taxNotice = liveCheck ?? (savedStatus ? taxCheckNotice(savedStatus) : null);

  const checkTaxId = async () => {
    const taxId = values.taxId.trim();
    if (!values.isBusiness || !taxId || !values.countryCode) return;
    setCheckFailed(false);
    try {
      const result = await check({ countryCode: values.countryCode, taxId });
      setChecked({ key: `${values.countryCode}:${taxId}`, status: result.status });
    } catch {
      // Too many checks, or the check itself failed: saving still checks it.
      setChecked(null);
      setCheckFailed(true);
    }
  };

  const countryOptions = countries.map((country) => ({
    label: country.name,
    value: country.isoCode,
    icon: <FaGlobe className="text-brand-blue/60" />,
  }));

  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
      {notice && (
        <p role="alert" className="m-0 rounded-xl bg-warning-bg px-4 py-3 text-sm font-medium text-warning-fg">
          {notice}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="billing-fullName" className={labelClass}>
            Full name
          </label>
          <Input
            {...inputProps("fullName")}
            autoComplete="name"
            value={values.fullName}
            onChange={formik.handleChange}
          />
          {renderError("fullName")}
        </div>
        <div>
          <label htmlFor="billing-email" className={labelClass}>
            Email
          </label>
          <Input
            {...inputProps("email")}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={formik.handleChange}
          />
          {renderError("email")}
        </div>
        <div>
          <label htmlFor="billing-phone" className={labelClass}>
            Phone
          </label>
          <PhoneInputComponent
            id="billing-phone"
            value={values.phone}
            onChange={(phone) => formik.setFieldValue("phone", phone)}
            onBlur={() => formik.setFieldTouched("phone", true)}
            error={errors.phone}
            touched={touched.phone}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="billing-street" className={labelClass}>
            Street address
          </label>
          <Input
            {...inputProps("street")}
            autoComplete="street-address"
            value={values.street}
            onChange={formik.handleChange}
          />
          {renderError("street")}
        </div>
        <div>
          <label htmlFor="billing-postalCode" className={labelClass}>
            Postcode
          </label>
          <Input
            {...inputProps("postalCode")}
            autoComplete="postal-code"
            value={values.postalCode}
            onChange={formik.handleChange}
          />
          {renderError("postalCode")}
        </div>
        <div>
          <label htmlFor="billing-city" className={labelClass}>
            City
          </label>
          <Input
            {...inputProps("city")}
            autoComplete="address-level2"
            value={values.city}
            onChange={formik.handleChange}
          />
          {renderError("city")}
        </div>
        <div className="md:col-span-2">
          <span id="billing-country-label" className={labelClass}>
            Country
          </span>
          <Select
            searchable
            value={values.countryCode}
            onChange={(code) => {
              formik.setFieldValue("countryCode", code);
              formik.setFieldTouched("countryCode", true, false);
            }}
            options={countryOptions}
            placeholder="Select a country"
          />
          {renderError("countryCode")}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-gray-900">
          <input
            type="checkbox"
            name="isBusiness"
            checked={values.isBusiness}
            onChange={formik.handleChange}
            className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
          />
          I&apos;m ordering as a business
        </label>

        {values.isBusiness && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="billing-companyName" className={labelClass}>
                Company name
              </label>
              <Input
                {...inputProps("companyName")}
                autoComplete="organization"
                value={values.companyName}
                onChange={formik.handleChange}
              />
              {renderError("companyName")}
            </div>
            <div>
              <label htmlFor="billing-taxId" className={labelClass}>
                {taxLabel}
              </label>
              <Input
                {...inputProps("taxId")}
                value={values.taxId}
                onChange={(event) => {
                  formik.handleChange(event);
                  setCheckFailed(false);
                }}
                onBlur={(event) => {
                  formik.handleBlur(event);
                  void checkTaxId();
                }}
              />
              {renderError("taxId")}
              <div aria-live="polite" className="mt-1.5 min-h-4 text-xs font-medium">
                {isChecking && <span className="text-gray-500">Checking…</span>}
                {!isChecking && taxNotice && (
                  <span className={noticeStyles[taxNotice.tone]}>{taxNotice.text}</span>
                )}
                {!isChecking && checkFailed && (
                  <span className="text-gray-600">
                    We could not check this number just now. We will check it when you save.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {serverError && (
        <p role="alert" className="m-0 rounded-xl bg-warning-bg px-4 py-3 text-sm font-medium text-warning-fg">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" isLoading={formik.isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
