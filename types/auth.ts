export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  postalCode?: string;
  country?: string;
}

export type AddressRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

/**
 * Whether an account belongs to a business or a private individual.
 *
 * Set once at sign-up and only an admin can change it, because it decides which
 * customs declaration the user is shown. Defaults to `"INDIVIDUAL"` server-side
 * when registration omits it.
 */
export type AccountType = "INDIVIDUAL" | "BUSINESS";

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
  accountType: AccountType;
  /** Always `null` — never absent — on an individual account. */
  companyName?: string | null;
  /** Polish NIP / EU VAT ID. Only ever set on business accounts. */
  nip?: string | null;
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
  /** Omit to accept the server default of `"INDIVIDUAL"`. */
  accountType?: AccountType;
  /**
   * Business accounts only, 1-100 chars. The server rejects these outright on an
   * individual account rather than dropping them, so omit the keys entirely
   * rather than sending empty strings.
   */
  companyName?: string;
  /** Business accounts only, 1-20 chars. */
  nip?: string;
}

export interface VerifyPhoneData {
  code: string;
}
