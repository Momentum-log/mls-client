import React, { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAuthStore } from "@/store/auth-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/button";
import apiClient from "@/api";
// import { User } from "@/types/auth"; // Might need if we type the response

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  // Address updates can be complex, skipping for simple profile form unless required
});

const ProfileForm = () => {
  const { user, updateUser } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
    enableReinitialize: true, // important to load user data when it becomes available
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        const response = await apiClient.patch("/auth/profile", values);
        // Response format: { user: User }
        if (response.data?.user) {
          updateUser(response.data.user);
          setSuccessMessage("Profile updated successfully.");
        }
      } catch (error: any) {
        setServerError(
          error.response?.data?.error || "Update failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Profile Settings
        </h2>
        <p className="text-sm text-gray-500">
          Update your personal information
        </p>
      </div>

      {serverError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md border border-green-100">
          {successMessage}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
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
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1234567890"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          value={user.email}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500">
          Email cannot be changed directly.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={formik.isSubmitting || !formik.dirty}
        variant="primary"
      >
        {formik.isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default ProfileForm;
