"use client";

import React from "react";
import { useFormik } from "formik";
import { z } from "zod";
// import { toFormikValidationSchema } from "zod-formik-adapter";
import { useLogin } from "@/hooks/auth/use-auth";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: z.string().min(1, "Password is required"),
});
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { setPersistencePreference } from "@/utils/secure-storage";

const LoginForm = () => {
  const { mutateAsync: login } = useLogin();
  const router = useRouter();
  const { addToast } = useToast();

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      try {
        loginSchema.parse(values);
        return {};
      } catch (error: unknown) {
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
        setPersistencePreference(values.rememberMe ? "local" : "session");

        addToast({
          type: "info",
          title: "Signing in...",
          message: "Please wait while we verify your credentials.",
          duration: 2000,
        });

        await login({
          identifier: values.identifier,
          password: values.password,
        });

        // Check for redirect param
        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect",
        );
        router.push(redirectUrl || "/app/dashboard");
      } catch (err) {
        const error = err as AxiosError<{ error: string; details?: string }>;

        // Default values
        let title = "Login Failed";
        let msg = "An unexpected error occurred.";

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
        <Label htmlFor="identifier">Email or Phone Number</Label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          placeholder="name@example.com or +48..."
          value={formik.values.identifier}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.identifier && formik.errors.identifier
              ? "border-red-500"
              : ""
          }
          disabled={formik.isSubmitting}
        />
        {formik.touched.identifier && formik.errors.identifier ? (
          <div className="text-xs text-red-500">{formik.errors.identifier}</div>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-brand-blue hover:underline"
          >
            Forgot password?
          </Link>
        </div>
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

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={formik.values.rememberMe}
          onChange={formik.handleChange}
          className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
        />
        <Label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me for 7 days
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={formik.isSubmitting}
        variant="primary"
      >
        {formik.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-center text-sm text-gray-500 mt-4">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-brand-blue font-semibold hover:underline"
        >
          Create account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
