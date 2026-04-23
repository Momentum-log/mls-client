"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUploadCloud,
} from "react-icons/fi";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useAddressVerificationStatus,
  useSubmitAddressUpdateRequest,
} from "@/hooks/auth/use-address-verification";
import {
  useCountries,
  useAddressAutocomplete,
  usePlaceDetails,
} from "@/hooks/location/use-location";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import { AddressStatusResponse } from "@/types/address-verification";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];

interface FormValues {
  street: string;
  city: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
}

/**
 * Converts browser File object to base64 content accepted by backend endpoint.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const [, base64 = ""] = result.split(",");
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const mapStatusToUser = (user: User, status: AddressStatusResponse): User => {
  return {
    ...user,
    address: status.activeAddress ?? user.address,
    addressVerifiedAt: status.addressVerifiedAt ?? null,
    currentAddressRequestId: status.latestRequest?.id ?? null,
    addressRequestStatus: status.latestRequest?.status ?? null,
    addressRejectionFeedback: status.latestRequest?.feedback ?? null,
  };
};

/**
 * Account section for showing current verified address state and submitting update requests.
 */
export default function AddressVerificationSection() {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const { user, updateUser } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [formErrors, setFormErrors] = React.useState<Partial<FormValues>>({});
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [autocompleteInput, setAutocompleteInput] = React.useState("");
  const [showAutocompleteDropdown, setShowAutocompleteDropdown] =
    React.useState(false);
  const [sessionToken] = React.useState(() =>
    Math.random().toString(36).substr(2, 9),
  );

  const [values, setValues] = React.useState<FormValues>({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || user?.address?.zip || "",
    countryCode: user?.address?.country || "",
    countryName: user?.address?.country || "",
  });

  // Fetch all countries
  const { data: countries, isLoading: countriesLoading } = useCountries();

  // Fetch autocomplete suggestions for street address
  const { data: autocompleteSuggestions, isLoading: autocompleteLoading } =
    useAddressAutocomplete(autocompleteInput, sessionToken);

  // Fetch place details when user selects a suggestion
  const [selectedPlaceId, setSelectedPlaceId] = React.useState<string>("");
  const { data: placeDetails } = usePlaceDetails(selectedPlaceId, sessionToken);

  // When place details are fetched, populate the form
  React.useEffect(() => {
    if (placeDetails && selectedPlaceId) {
      const countryCode = placeDetails.countryCode?.toUpperCase() || "";
      const countryName =
        countries?.find((c) => c.isoCode === countryCode)?.name ||
        placeDetails.country ||
        "";

      setValues((prev) => ({
        ...prev,
        street: placeDetails.street || prev.street,
        city: placeDetails.city || prev.city,
        postalCode: placeDetails.zip || prev.postalCode,
        countryCode,
        countryName,
      }));

      setAutocompleteInput("");
      setShowAutocompleteDropdown(false);
      setSelectedPlaceId("");
    }
  }, [placeDetails, selectedPlaceId, countries]);

  const { data, isLoading, isFetching, refetch } =
    useAddressVerificationStatus();
  const { mutateAsync: submitAddressRequest, isPending } =
    useSubmitAddressUpdateRequest();

  // Initialize form values from user profile (only once on mount)
  React.useEffect(() => {
    if (user?.address) {
      const countryName =
        countries?.find((c) => c.isoCode === user.address?.country)?.name ||
        user.address?.country ||
        "";

      setValues((prev) => ({
        ...prev,
        street: user.address?.street || prev.street,
        city: user.address?.city || prev.city,
        postalCode:
          user.address?.postalCode || user.address?.zip || prev.postalCode,
        countryCode: user.address?.country || prev.countryCode,
        countryName: countryName || prev.countryName,
      }));
    }
  }, [user?.address, countries]);

  // Handle auto-open via search params
  React.useEffect(() => {
    const shouldOpen =
      searchParams.get("openAddressVerification") === "1" ||
      searchParams.get("focusAddress") === "1";

    if (shouldOpen) {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Update user store when address status data changes
  React.useEffect(() => {
    if (!data) {
      return;
    }

    // Get current user from store at call time to avoid circular dependency
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      return;
    }

    updateUser(mapStatusToUser(currentUser, data));
  }, [
    data,
    data?.activeAddress,
    data?.addressVerifiedAt,
    data?.latestRequest?.status,
    updateUser,
  ]);

  const latestRequest = data?.latestRequest;
  const requestStatus = latestRequest?.status || null;

  const activeAddressParts = [
    data?.activeAddress?.street,
    data?.activeAddress?.city,
    data?.activeAddress?.postalCode || data?.activeAddress?.zip,
    data?.activeAddress?.country,
  ].filter(Boolean);

  const hasMeaningfulActiveAddress = !!(
    data?.activeAddress?.street?.trim() ||
    data?.activeAddress?.city?.trim() ||
    data?.activeAddress?.postalCode?.trim() ||
    data?.activeAddress?.zip?.trim()
  );

  const validateForm = (input: FormValues) => {
    const nextErrors: Partial<FormValues> = {};

    if (!input.street.trim()) {
      nextErrors.street = "Street is required.";
    }

    if (!input.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!input.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required.";
    } else if (input.postalCode.trim().length < 3) {
      nextErrors.postalCode = "Postal code must be at least 3 characters.";
    }

    if (!input.countryCode.trim()) {
      nextErrors.countryCode = "Country is required.";
    } else if (!/^[A-Z]{2}$/.test(input.countryCode.trim().toUpperCase())) {
      nextErrors.countryCode = "Invalid country selection.";
    }

    return nextErrors;
  };

  const validateFile = (file: File | null): string | null => {
    if (!file) {
      return "A proof file is required.";
    }

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return "File must be PDF, PNG, or JPG.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be 10MB or less.";
    }

    return null;
  };

  const onFilePicked = (file: File | null) => {
    setFileError(null);
    setSelectedFile(file);
    const error = validateFile(file);
    if (error) {
      setFileError(error);
    }
  };

  const resetFormState = () => {
    setSelectedFile(null);
    setFileError(null);
    setFormErrors({});
  };

  const handleManualStatusCheck = async () => {
    try {
      const freshStatus = await refetch();
      if (freshStatus.data) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          updateUser(mapStatusToUser(currentUser, freshStatus.data));
        }
      }
    } catch {
      addToast({
        title: "Status Check Failed",
        message: "Unable to refresh address status right now.",
        type: "error",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setFormErrors(nextErrors);

    const proofError = validateFile(selectedFile);
    setFileError(proofError);

    if (Object.keys(nextErrors).length > 0 || proofError || !selectedFile) {
      return;
    }

    try {
      const base64Content = await fileToBase64(selectedFile);

      await submitAddressRequest({
        address: {
          street: values.street.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
          country: values.countryCode.trim().toUpperCase(),
        },
        proofFile: {
          fileName: selectedFile.name,
          mimeType: selectedFile.type as
            | "application/pdf"
            | "image/png"
            | "image/jpeg",
          base64Content,
          size: selectedFile.size,
        },
      });

      addToast({
        title: "Request Submitted",
        message: "Address update request has been sent for admin review.",
        type: "success",
      });

      const freshStatus = await refetch();
      if (freshStatus.data && user) {
        updateUser(mapStatusToUser(user, freshStatus.data));

        setValues((prev) => ({
          ...prev,
          street: freshStatus.data.activeAddress?.street || prev.street,
          city: freshStatus.data.activeAddress?.city || prev.city,
          postalCode:
            freshStatus.data.activeAddress?.postalCode ||
            freshStatus.data.activeAddress?.zip ||
            prev.postalCode,
          countryCode:
            freshStatus.data.activeAddress?.country || prev.countryCode,
          countryName: prev.countryName,
        }));
      }

      setIsModalOpen(false);
      resetFormState();
    } catch (error: unknown) {
      const responseError = error as {
        response?: { data?: { error?: string } };
      };
      addToast({
        title: "Submission Failed",
        message:
          responseError?.response?.data?.error ||
          "Unable to submit address update request. Please try again.",
        type: "error",
      });
    }
  };

  const statusBadge = (() => {
    if (requestStatus === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          <FiCheckCircle className="h-3.5 w-3.5" /> Approved
        </span>
      );
    }

    if (requestStatus === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          <FiXCircle className="h-3.5 w-3.5" /> Rejected
        </span>
      );
    }

    if (requestStatus === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-bold text-gray-800">
          <FiClock className="h-3.5 w-3.5" /> Pending Review
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
        <FiClock className="h-3.5 w-3.5" /> Not Submitted
      </span>
    );
  })();

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-gray-900">
              Address Verification
            </h4>
            <p className="text-sm text-gray-500">
              Shipments require an approved address with proof document.
            </p>
          </div>
          {statusBadge}
        </div>

        {isLoading ? (
          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ) : (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Current Active Address
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {hasMeaningfulActiveAddress && activeAddressParts.length > 0
                ? activeAddressParts.join(", ")
                : "No approved address on file yet."}
            </p>
            {latestRequest?.feedback ? (
              <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                Admin feedback: {latestRequest.feedback}
              </p>
            ) : null}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          Update Address
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={handleManualStatusCheck}
          className="w-full"
          isLoading={isFetching}
        >
          Check Status
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetFormState();
        }}
        title="Submit Address Update"
        disableBackdropDismiss={true}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Street Address with Autocomplete */}
          <div className="space-y-2 relative">
            <Label htmlFor="av-street">Street Address</Label>
            <Input
              id="av-street"
              value={autocompleteInput || values.street}
              onChange={(event) => {
                setAutocompleteInput(event.target.value);
                setShowAutocompleteDropdown(true);
              }}
              onFocus={() => setShowAutocompleteDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowAutocompleteDropdown(false), 200);
              }}
              placeholder="Type an address or select from suggestions"
              disabled={isPending}
            />

            {/* Autocomplete Dropdown */}
            {showAutocompleteDropdown && autocompleteInput && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {autocompleteLoading ? (
                  <div className="p-3 text-sm text-gray-500">
                    Loading suggestions...
                  </div>
                ) : autocompleteSuggestions &&
                  autocompleteSuggestions.length > 0 ? (
                  autocompleteSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.placeId}
                      type="button"
                      onClick={() => {
                        setSelectedPlaceId(suggestion.placeId);
                        setAutocompleteInput(suggestion.description);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {suggestion.mainText}
                      </p>
                      <p className="text-xs text-gray-500">
                        {suggestion.secondaryText}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}

            {formErrors.street ? (
              <p className="text-xs text-red-500">{formErrors.street}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="av-city">City</Label>
              <Input
                id="av-city"
                value={values.city}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, city: event.target.value }))
                }
                placeholder="E.g. Warsaw"
                disabled={isPending}
              />
              {formErrors.city ? (
                <p className="text-xs text-red-500">{formErrors.city}</p>
              ) : null}
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="av-postalCode">Postal Code</Label>
              <Input
                id="av-postalCode"
                value={values.postalCode}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    postalCode: event.target.value,
                  }))
                }
                placeholder="E.g. 00-001"
                disabled={isPending}
              />
              {formErrors.postalCode ? (
                <p className="text-xs text-red-500">{formErrors.postalCode}</p>
              ) : null}
            </div>
          </div>

          {/* Country Selector */}
          <div className="space-y-2">
            <Label htmlFor="av-country">Country</Label>
            <select
              id="av-country"
              value={values.countryCode}
              onChange={(event) => {
                const code = event.target.value;
                const country = countries?.find((c) => c.isoCode === code);
                setValues((prev) => ({
                  ...prev,
                  countryCode: code,
                  countryName: country?.name || "",
                }));
              }}
              disabled={isPending || countriesLoading}
              className="w-full text-sm font-medium h-12 rounded-xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent px-4 py-2 transition-all text-gray-900 disabled:opacity-50"
            >
              <option value="">Select a country...</option>
              {countries?.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {formErrors.countryCode ? (
              <p className="text-xs text-red-500">{formErrors.countryCode}</p>
            ) : null}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Proof File (PDF, PNG, JPG, max 10MB)</Label>
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                const file = event.dataTransfer.files?.[0] || null;
                onFilePicked(file);
              }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${
                isDragging
                  ? "border-brand-blue bg-brand-blue/5"
                  : "border-gray-300"
              }`}
            >
              <FiUploadCloud className="mb-2 h-6 w-6 text-brand-blue" />
              <p className="text-sm font-semibold text-gray-900">
                {selectedFile
                  ? selectedFile.name
                  : "Drag and drop file or click to browse"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Exactly one file is required.
              </p>
              <input
                type="file"
                className="hidden"
                accept="application/pdf,image/png,image/jpeg"
                onChange={(event) =>
                  onFilePicked(event.target.files?.[0] || null)
                }
                disabled={isPending}
              />
            </label>
            {fileError ? (
              <p className="text-xs text-red-500">{fileError}</p>
            ) : null}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                resetFormState();
              }}
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isPending}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
