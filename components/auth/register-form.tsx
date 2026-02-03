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
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
      password: "",
      confirmPassword: "",
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...registerData } = values;
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

        if (error.response?.data) {
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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Removed inline error display */}

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
