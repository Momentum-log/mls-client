"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import { changePassword } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Form for changing user password.
 * Only for logged-in users.
 */
const ChangePasswordForm = () => {
  const { addToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(passwordSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setServerError(null);
      try {
        await changePassword({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        addToast({
          title: "Success",
          message: "Password changed successfully",
          type: "success",
        });
        resetForm();
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.error || "Failed to change password";
        setServerError(errorMsg);
        addToast({
          title: "Error",
          message: errorMsg,
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {serverError && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <p className="text-xs text-red-500">
            {formik.errors.currentPassword as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInput
            id="newPassword"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-xs text-red-500">
              {formik.errors.newPassword as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {formik.errors.confirmPassword as string}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          disabled={formik.isSubmitting || !formik.dirty}
          variant="primary"
        >
          {formik.isSubmitting ? "Changing Password..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
