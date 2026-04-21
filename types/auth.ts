export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  postalCode?: string;
  country?: string;
}

export type AddressRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  userCode: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: UserAddress | null;
  addressVerifiedAt?: string | null;
  currentAddressRequestId?: string | null;
  addressRequestStatus?: AddressRequestStatus | null;
  addressRejectionFeedback?: string | null;
  defaultCustomsType?: "S" | "I";
  is_verified: boolean;
  is_phone_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  guestUserId?: string;
}

export interface VerifyPhoneData {
  code: string;
}
