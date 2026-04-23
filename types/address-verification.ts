import { AddressRequestStatus, UserAddress } from "@/types/auth";

/**
 * File payload sent to backend when submitting an address update request.
 */
export interface AddressProofFilePayload {
  fileName: string;
  mimeType: "application/pdf" | "image/png" | "image/jpeg";
  base64Content: string;
  size: number;
}

/**
 * Request body for creating an address update request.
 */
export interface AddressUpdateRequestPayload {
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  proofFile: AddressProofFilePayload;
}

/**
 * Normalized address request metadata used in client UI.
 */
export interface AddressRequestMeta {
  id: string;
  status: AddressRequestStatus;
  createdAt?: string;
  reviewedAt?: string;
  feedback?: string | null;
  newAddress?: UserAddress | null;
}

/**
 * Response shape for current address verification status endpoint.
 */
export interface AddressStatusResponse {
  activeAddress: UserAddress | null;
  addressVerifiedAt?: string | null;
  latestRequest: AddressRequestMeta | null;
}
