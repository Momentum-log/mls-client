/**
 * Address Help Diagnosis Utility.
 *
 * @module utils/address-help
 */

import { getUseAddressCountryMode, isAddressCountryFeatureActive } from "./feature-flags";
import { printAddressResolutionLogs } from "./address-country-helper";

/**
 * Runs a full diagnostic help utility for Address-Based Country Override.
 */
export async function runAddressHelp(): Promise<void> {
  console.group("🔍 MLS Address Override Diagnosis");
  console.log("1. Environment settings:");
  console.log("   - USE_ADDRESS_COUNTRY mode:", getUseAddressCountryMode());
  console.log("   - Feature Active:", isAddressCountryFeatureActive());

  console.log("2. Printing resolution history:");
  printAddressResolutionLogs();
  console.groupEnd();
}
