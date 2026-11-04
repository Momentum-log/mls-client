/**
 * Package measurements as safe numbers.
 *
 * Formik stores an emptied `type="number"` input as `""`, so while a customer
 * clears the weight to retype it, `pkg.weight` is a string. Summing that with
 * `+` concatenates ("0" + 2 = "02") and `.toFixed` then throws, crashing the
 * page. Read every measurement through `toFiniteNumber` before doing maths.
 */
export const toFiniteNumber = (value: unknown): number => {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : 0;
};

export const totalPackageWeight = (packages: ReadonlyArray<{ weight: unknown }>): number =>
  packages.reduce((acc, p) => acc + toFiniteNumber(p.weight), 0);
