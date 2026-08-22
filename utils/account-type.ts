/**
 * Account type — the sign-up answer that replaces the per-shipment
 * "business or individual?" question.
 *
 * `accountType` is captured once at registration and returned on every
 * user-shaped response. It decides which branch of the `customs` discriminated
 * union a shipment is filed under, so the derivation lives here rather than in
 * the form — the customs form, the estimate step and anything added later must
 * agree, and a second copy of the rule is a second place for it to drift.
 *
 * @module utils/account-type
 */

import { AccountType, User } from "@/types/auth";

/** Whether the signed-in account is a business. */
export const isBusinessAccount = (user: User | null | undefined): boolean =>
  user?.accountType === "BUSINESS";

/**
 * Maps an account onto its customs clearance branch.
 *
 * Total — there is no third case, and an absent user falls to the individual
 * branch, which is also the server's registration default.
 */
export const customsTypeForUser = (
  user: User | null | undefined,
): "S" | "I" => (isBusinessAccount(user) ? "S" : "I");

/** Human label for the clearance branch, shown read-only on the customs form. */
export const customsTypeLabel = (customsType: "S" | "I"): string =>
  customsType === "S" ? "Business (Simplified)" : "Individual";

/** Human label for the account type itself, shown read-only on the profile. */
export const accountTypeLabel = (accountType: AccountType): string =>
  accountType === "BUSINESS" ? "Business" : "Individual";

export interface ItemCategory {
  value: string;
  label: string;
}

/**
 * Customs item categories, per clearance branch.
 *
 * `31` (Return Goods) and `91` (Commercial Goods) are business-only — the
 * individual branch's schema enum does not accept them.
 *
 * @remarks `91` is business-only in `openapi.json` and in every v4.3 guide, but
 * none of them gives it a customer-facing name. "Commercial Goods" is this
 * client's wording and is worth confirming with the backend team, since the
 * customer reads it on a customs declaration.
 */
const BUSINESS_ITEM_CATEGORIES: ItemCategory[] = [
  { value: "9", label: "Document" },
  { value: "11", label: "Gift" },
  { value: "21", label: "Commercial Sample" },
  { value: "31", label: "Return Goods" },
  { value: "32", label: "Other" },
  { value: "91", label: "Commercial Goods" },
];

const INDIVIDUAL_ITEM_CATEGORIES: ItemCategory[] = [
  { value: "9", label: "Document" },
  { value: "11", label: "Gift" },
  { value: "21", label: "Commercial Sample" },
  { value: "32", label: "Other" },
];

/** The categories the given clearance branch accepts. */
export const itemCategoriesFor = (customsType: "S" | "I"): ItemCategory[] =>
  customsType === "S" ? BUSINESS_ITEM_CATEGORIES : INDIVIDUAL_ITEM_CATEGORIES;

/**
 * Whether a stored category is still valid on the given branch.
 *
 * Guards the case where customs details were captured under one branch and the
 * account type changed before the shipment was submitted — a retained `"31"`
 * would be rejected on the individual branch.
 */
export const isCategoryAllowed = (
  customsType: "S" | "I",
  value: string,
): boolean => itemCategoriesFor(customsType).some((c) => c.value === value);
