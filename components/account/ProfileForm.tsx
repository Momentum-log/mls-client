"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAuthStore } from "@/store/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import { updateProfile } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import EmailChangeModal from "./EmailChangeModal";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

/**
 * Form for updating user profile details.
 */
const ProfileForm = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zip: user?.address?.zip || "",
        country: user?.address?.country || "Poland",
      },
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const response = await updateProfile(values);
        if (response.data?.user) {
          updateUser(response.data.user);
          addToast({
            title: "Success",
            message: "Profile updated successfully",
            type: "success",
          });
        }
      } catch (error: any) {
        setServerError(
          error.response?.data?.error || "Update failed. Please try again."
        );
        addToast({
          title: "Error",
          message: "Failed to update profile",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {serverError && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              placeholder="John Doe"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500">
                {formik.errors.name as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
              placeholder="+48 123 456 789"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-red-500">
                {formik.errors.phone as string}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <div className="flex gap-2">
            <Input
              value={user?.email}
              disabled
              className="bg-gray-50 cursor-not-allowed flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEmailModalOpen(true)}
            >
              Change
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Email is used for account recovery and notifications
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Default Address
          </h4>

          <div className="space-y-2">
            <Label htmlFor="address.street">Street Address</Label>
            <Input
              id="address.street"
              name="address.street"
              value={formik.values.address.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                name="address.city"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.zip">Postal Code</Label>
              <Input
                id="address.zip"
                name="address.zip"
                value={formik.values.address.zip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting || !formik.dirty}
            variant="primary"
          >
            {formik.isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <EmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </>
  );
};

export default ProfileForm;
