"use client";

import React from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRegister } from "@/hooks/auth/use-auth";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInputComponent from "@/components/ui/phone-input";
import { AccountType, RegisterData } from "@/types/auth";

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "BUSINESS", label: "Business" },
];

const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"),
    phone: z.string().min(1, "Phone number is required"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    accountType: z.enum(["INDIVIDUAL", "BUSINESS"]),
    // Optional even on a business account — worth prompting for, not worth
    // blocking sign-up on.
    companyName: z
      .string()
      .max(100, "Company name must be 100 characters or fewer"),
    nip: z.string().max(20, "NIP must be 20 characters or fewer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  // The server rejects company details on an individual account rather than
  // dropping them silently, so a wiring bug here would surface as an opaque 400.
  // Catch it before the request instead.
  .refine(
    (data) => data.accountType === "BUSINESS" || !data.companyName.trim(),
    {
      message: "Company name is only allowed on a business account",
      path: ["companyName"],
    },
  )
  .refine((data) => data.accountType === "BUSINESS" || !data.nip.trim(), {
    message: "NIP is only allowed on a business account",
    path: ["nip"],
  });

import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

// ... imports

const RegisterForm = () => {
  const { mutateAsync: register } = useRegister();
  const router = useRouter();
  const { addToast } = useToast();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      accountType: "INDIVIDUAL" as AccountType,
      companyName: "",
      nip: "",
    },
    validate: (values) => {
      try {
        registerSchema.parse(values);
        return {};
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          const formikErrors: Record<string, string> = {};
          error.issues.forEach((issue) => {
            const path = issue.path[0] as string;
            if (!formikErrors[path]) {
              formikErrors[path] = issue.message;
            }
          });
          return formikErrors;
        }
        return {};
      }
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        addToast({
          type: "info",
          title: "Creating Account",
          message: "Please wait while we register your account...",
          duration: 2000,
        });

        const isBusiness = values.accountType === "BUSINESS";
        const companyName = values.companyName.trim();
        const nip = values.nip.trim();

        // Built key by key rather than spread: the server rejects `companyName`
        // and `nip` on an individual account, and rejects empty strings on a
        // business one, so both must be absent unless they carry a value.
        const registerData: RegisterData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          accountType: values.accountType,
          ...(isBusiness && companyName ? { companyName } : {}),
          ...(isBusiness && nip ? { nip } : {}),
        };

        await register(registerData);

        addToast({
          type: "success",
          title: "Registration Successful",
          message: "Account created! Redirecting to login...",
          duration: 3000,
        });

        // Small delay to let user see the success message before redirecting
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 1500);
      } catch (err) {
        const error = err as AxiosError<{ error: string; details?: string }>;

        // Default values
        let title = "Registration Failed";
        let msg = "Something went wrong. Please try again.";

        if (error.response?.status === 409) {
          title = "Account Already Exists";
          msg =
            "That email or phone number is already registered. Try signing in instead.";
        } else if (error.response?.data) {
          title = error.response.data.error || title;
          msg = error.response.data.details || error.message || msg;
        } else {
          msg = error.message || msg;
        }

        addToast({
          type: "error",
          title: title,
          message: msg,
          duration: 5000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isBusiness = formik.values.accountType === "BUSINESS";

  /**
   * Switching back to individual clears the company fields. Leaving stale
   * values behind would trip the schema guard on submit with inputs the user
   * can no longer see.
   */
  const handleAccountTypeChange = (accountType: AccountType) => {
    formik.setFieldValue("accountType", accountType);
    if (accountType === "INDIVIDUAL") {
      formik.setFieldValue("companyName", "");
      formik.setFieldValue("nip", "");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Removed inline error display */}

      {/* Account type. Captured once here so the shipment flow never has to ask
          whether a declaration is business or individual. Only an admin can
          change it afterwards. */}
      <div className="space-y-2">
        <Label>Account Type</Label>
        <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
          {ACCOUNT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAccountTypeChange(option.value)}
              disabled={formik.isSubmitting}
              aria-pressed={formik.values.accountType === option.value}
              className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                formik.values.accountType === option.value
                  ? "bg-brand-blue text-white shadow-md"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {isBusiness
            ? "We'll use your company details on customs declarations."
            : "Shipping for a company? Switch to Business."}
        </p>
      </div>

      {isBusiness && (
        <div className="space-y-5 p-4 rounded-xl bg-gray-50 border border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name (optional)</Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Kowalski Sp. z o.o."
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.companyName && formik.errors.companyName
                  ? "border-red-500"
                  : ""
              }
              disabled={formik.isSubmitting}
            />
            {formik.touched.companyName && formik.errors.companyName ? (
              <div className="text-xs text-red-500">
                {formik.errors.companyName}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nip">NIP Number (optional)</Label>
            <Input
              id="nip"
              name="nip"
              type="text"
              placeholder="1234563218"
              value={formik.values.nip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.nip && formik.errors.nip ? "border-red-500" : ""
              }
              disabled={formik.isSubmitting}
            />
            {formik.touched.nip && formik.errors.nip ? (
              <div className="text-xs text-red-500">{formik.errors.nip}</div>
            ) : null}
            <p className="text-xs text-gray-500">
              Add it now and we won&apos;t ask for it on every international
              shipment.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.name && formik.errors.name ? "border-red-500" : ""
          }
          disabled={formik.isSubmitting}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-xs text-red-500">{formik.errors.name}</div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.email && formik.errors.email ? "border-red-500" : ""
          }
          disabled={formik.isSubmitting}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-xs text-red-500">{formik.errors.email}</div>
        ) : null}
      </div>
      {/* Added phone input */}
      <div className="space-y-2">
        <PhoneInputComponent
          label="Phone Number"
          value={formik.values.phone}
          onChange={(value) => formik.setFieldValue("phone", value)}
          onBlur={() => formik.setFieldTouched("phone", true)}
          error={formik.errors.phone}
          touched={formik.touched.phone}
          disabled={formik.isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="••••••••"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.password && formik.errors.password
              ? "border-red-500"
              : ""
          }
          disabled={formik.isSubmitting}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-xs text-red-500">{formik.errors.password}</div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? "border-red-500"
              : ""
          }
          disabled={formik.isSubmitting}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="text-xs text-red-500">
            {formik.errors.confirmPassword}
          </div>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={formik.isSubmitting}
        variant="primary"
      >
        {formik.isSubmitting ? "Creating account..." : "Sign up"}
      </Button>

      <div className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-brand-blue font-semibold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
