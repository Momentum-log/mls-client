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
import { PhoneInputComponent } from "@/components/ui/phone-input";
import VerifyPhoneModal from "./VerifyPhoneModal";
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
  defaultCustomsType: z.enum(["S", "I"]).optional(),
});

/**
 * Form for updating user profile details.
 */
const ProfileForm = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingValues, setPendingValues] = useState<any>(null);

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
      defaultCustomsType: user?.defaultCustomsType || "S",
    },
    enableReinitialize: !isEditing,
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);

      const isPhoneChanged = values.phone !== user?.phone;

      try {
        const response = await updateProfile(values);
        if (response.data?.user) {
          updateUser(response.data.user);

          if (isPhoneChanged) {
            setPendingValues(values);
            setIsPhoneModalOpen(true);
            addToast({
              title: "Phone Updated",
              message: "Please verify your new phone number.",
              type: "info",
            });
          } else {
            addToast({
              title: "Success",
              message: "Profile updated successfully",
              type: "success",
            });
            setIsEditing(false);
          }
        }
      } catch (error: any) {
        setServerError(
          error.response?.data?.error || "Update failed. Please try again.",
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

  const handleSave = async (
    values: any,
    setSubmitting: (val: boolean) => void,
  ) => {
    try {
      const response = await updateProfile(values);
      if (response.data?.user) {
        updateUser(response.data.user);
        addToast({
          title: "Success",
          message: "Profile updated successfully",
          type: "success",
        });
        setIsEditing(false);
      }
    } catch (error: any) {
      setServerError(
        error.response?.data?.error || "Update failed. Please try again.",
      );
      addToast({
        title: "Error",
        message: "Failed to update profile",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneVerified = () => {
    setIsEditing(false);
    setPendingValues(null);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Personal Information
          </h3>
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  formik.resetForm();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

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
              disabled={!isEditing || formik.isSubmitting}
              placeholder="John Doe"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500">
                {formik.errors.name as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <PhoneInputComponent
              label="Phone Number"
              value={formik.values.phone}
              onChange={(phone) => formik.setFieldValue("phone", phone)}
              onBlur={() => formik.setFieldTouched("phone", true)}
              disabled={!isEditing || formik.isSubmitting}
              error={formik.errors.phone as string}
              touched={formik.touched.phone as boolean}
            />
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
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEmailModalOpen(true)}
              >
                Change
              </Button>
            )}
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
              disabled={!isEditing || formik.isSubmitting}
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
                disabled={!isEditing || formik.isSubmitting}
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
                disabled={!isEditing || formik.isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Customs Preferences
          </h4>
          <div className="space-y-2">
            <Label htmlFor="defaultCustomsType">Default Customs Entity</Label>
            <select
              id="defaultCustomsType"
              name="defaultCustomsType"
              value={formik.values.defaultCustomsType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditing || formik.isSubmitting}
              className="w-full text-sm font-semibold h-12 rounded-xl bg-gray-50 border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent px-4 py-2 transition-all text-gray-900 disabled:opacity-50"
            >
              <option value="S">Business (Simplified)</option>
              <option value="I">Individual</option>
            </select>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Used automatically when creating international shipments
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting || !formik.dirty}
              isLoading={formik.isSubmitting}
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>

      <EmailChangeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      <VerifyPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        tempPhone={pendingValues?.phone}
        onVerified={handlePhoneVerified}
      />
    </>
  );
};

export default ProfileForm;
