import { LoginData, RegisterData, VerifyPhoneData } from "@/types/auth";
import {
  AddressStatusResponse,
  AddressUpdateRequestPayload,
} from "@/types/address-verification";
import apiClient from "..";

/**
 * Registers a new user.
 */
export const register = (data: RegisterData) => {
  return apiClient.post("/auth/register-user", data);
};

/**
 * Logins a user.
 */
export const login = (data: LoginData) => {
  return apiClient.post("/auth/login-user", data);
};

/**
 * Logouts the current user and revokes refresh token.
 */
export const logout = (refreshToken: string) => {
  return apiClient.post("/auth/logout-user", { refreshToken });
};

/**
 * Gets the current authenticated user's profile.
 */
export const getCurrentUser = () => {
  return apiClient.get("/auth/get-current-user");
};

/**
 * Updates the current user's profile information.
 */
export const updateProfile = (data: {
  name?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}) => {
  return apiClient.patch("/auth/update-user-profile", data);
};

/**
 * Initiates an email change by sending a code to the new email.
 */
export const initiateEmailChange = (newEmail: string) => {
  return apiClient.post("/auth/initiate-email-change", { newEmail });
};

/**
 * Confirms an email change using the verification code.
 */
export const confirmEmailChange = (code: string) => {
  return apiClient.post("/auth/confirm-email-change", { code });
};

/**
 * Sends a verification code to the current email.
 */
export const sendVerificationCode = () => {
  return apiClient.post("/auth/send-verification-code");
};

/**
 * Verifies the email using the verification code.
 */
export const verifyEmail = (code: string) => {
  return apiClient.post("/auth/verify-email", { code });
};

/**
 * Sends a verification code to the registered phone number.
 */
export const sendPhoneOTP = (payload?: { phone?: string }) => {
  return apiClient.post("/auth/send-phone-otp", payload);
};

/**
 * Verifies the phone using the SMS code.
 */
export const verifyPhoneOTP = (data: VerifyPhoneData) => {
  return apiClient.post("/auth/verify-phone-otp", data);
};

/**
 * Changes the password for a logged-in user.
 */
export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return apiClient.post("/auth/change-password", data);
};

/**
 * Initiates the forgot password flow.
 */
export const forgotPassword = (email: string) => {
  return apiClient.post("/auth/forgot-password", { email });
};

/**
 * Resets the password using the reset code.
 */
export const resetPassword = (data: { code: string; newPassword: string }) => {
  return apiClient.post("/auth/reset-password", data);
};

/**
 * Submits an address update request with proof document for admin review.
 */
export const submitAddressUpdateRequest = (
  data: AddressUpdateRequestPayload,
) => {
  return apiClient.post("/auth/address/update-request", data);
};

/**
 * Gets current active address and latest address request status.
 */
export const getAddressStatus = async () => {
  const response = await apiClient.get<AddressStatusResponse>(
    "/auth/address/status",
  );

  const data = response.data as AddressStatusResponse & {
    status?: string;
    request?: AddressStatusResponse["latestRequest"];
    latestAddressRequest?: AddressStatusResponse["latestRequest"];
    active?: AddressStatusResponse["activeAddress"];
    activeAddressVerifiedAt?: string | null;
    latestRequest?:
      | (AddressStatusResponse["latestRequest"] & {
          adminFeedback?: string | null;
        })
      | null;
  };

  const normalizedActiveAddress = data.activeAddress ?? data.active ?? null;
  const hasMeaningfulActiveAddress = !!(
    normalizedActiveAddress?.street?.trim() ||
    normalizedActiveAddress?.city?.trim() ||
    normalizedActiveAddress?.postalCode?.trim() ||
    normalizedActiveAddress?.zip?.trim()
  );

  const normalizedLatestRequest =
    data.latestRequest ?? data.latestAddressRequest ?? data.request ?? null;

  return {
    activeAddress: hasMeaningfulActiveAddress ? normalizedActiveAddress : null,
    addressVerifiedAt:
      data.addressVerifiedAt ?? data.activeAddressVerifiedAt ?? null,
    latestRequest: normalizedLatestRequest
      ? {
          ...normalizedLatestRequest,
          feedback:
            normalizedLatestRequest.feedback ??
            (normalizedLatestRequest as { adminFeedback?: string | null })
              .adminFeedback ??
            null,
        }
      : null,
  } as AddressStatusResponse;
};
