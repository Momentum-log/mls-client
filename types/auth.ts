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

/**
 * Session metadata returned by login and refresh (server v6.0.0).
 */
export interface SessionInfo {
  /** Absolute 7-day deadline, ISO string. A refresh rotation does not move it. */
  expiresAt: string;
  /**
   * e.g. `"iPhone · Safari"`. Derived from the User-Agent server-side and
   * meant only for showing a human which device a session belongs to. It is
   * trivially spoofable and is never used for an authorization decision. Absent
   * from the refresh response, which only returns `expiresAt`.
   */
  deviceLabel?: string;
}

/**
 * The `reason` a 401 (or the 403 `USER_RESTRICTED`) carries since v6.0.0. It is
 * what separates "refresh and retry" from "sign the user out".
 *
 * @remarks Both spellings of the revoked and expired cases are listed on
 * purpose: `docs/user-session-guide.md` documents `REVOKED`/`EXPIRED` while the
 * OpenAPI description documents `SESSION_REVOKED`/`SESSION_EXPIRED`. They mean
 * the same thing and are handled identically.
 */
export type AuthFailureReason =
  | "TOKEN_UPGRADE_REQUIRED"
  | "NO_TOKEN"
  | "INVALID_TOKEN"
  | "REVOKED"
  | "SESSION_REVOKED"
  | "EXPIRED"
  | "SESSION_EXPIRED"
  | "NOT_FOUND"
  | "REUSE_DETECTED"
  | "USER_RESTRICTED";

/** The error body every authenticated endpoint returns on a 401 or 403. */
export interface AuthErrorBody {
  error: string;
  code: number;
  details?: string | null;
  reason?: AuthFailureReason;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  /** Absent on tokens issued before v6.0.0. */
  session?: SessionInfo;
}

export interface RefreshResponse {
  accessToken: string;
  /** Rotated on every call — the old one must be replaced with this. */
  refreshToken: string;
  /** The session id is unchanged by a rotation; only `expiresAt` is echoed. */
  session: SessionInfo;
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
