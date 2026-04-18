import { deepBrandCarrierDisplay } from "@/utils/carrier-branding";

/**
 * Deeply transforms response data to brand carrier names as MLS for display.
 *
 * IMPORTANT:
 * - This is UI-only branding.
 * - Do not use transformed values when constructing API payloads.
 */
export function deepTransformData<T>(data: T): T {
  return deepBrandCarrierDisplay(data);
}
