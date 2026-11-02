/** Self-check for the locale helpers. Run: `bun utils/site-locale.check.ts` */
import assert from "node:assert/strict";
import {
  localeFromAcceptLanguage,
  localeFromPath,
  switchLocalePath,
} from "./site-locale";

assert.equal(localeFromAcceptLanguage("pl-PL,pl;q=0.9,en;q=0.8"), "pl");
assert.equal(localeFromAcceptLanguage("en-PL,en;q=0.9"), "pl");
assert.equal(localeFromAcceptLanguage("en-US,pl;q=0.5"), "en");
assert.equal(localeFromAcceptLanguage("en-NG"), "en");
assert.equal(localeFromAcceptLanguage(null), "en");

assert.equal(localeFromPath("/pl/ship"), "pl");
assert.equal(localeFromPath("/shipping-estimate"), null);

assert.equal(switchLocalePath("/en/about", "pl"), "/pl/about");
assert.equal(switchLocalePath("/en", "pl"), "/pl");
assert.equal(switchLocalePath("/track-shipment", "pl"), "/pl");

console.log("site-locale: ok");
