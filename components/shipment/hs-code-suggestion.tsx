"use client";

import React from "react";
import { FiZap } from "react-icons/fi";
import { useMatchHsCodes } from "@/hooks/shipments/use-shipments";
import { extractApiError } from "@/utils/error-handler";

interface HsCodeSuggestionProps {
  /** The item description the code is matched against. */
  description: string;
  destinationCountry?: string;
  originCountry?: string;
  /** Receives the six-digit code, digits only (e.g. `610910`). */
  onPick: (code: string) => void;
}

/** `6109.10.00.10` → `610910`: the six-digit international HS heading. */
const toHeading = (code: string) => code.replace(/\D/g, "").slice(0, 6);

/**
 * "Suggest a code" for one customs item, backed by the server's HS matcher.
 *
 * A suggestion fills the field but stays editable: the shipper is still the one
 * declaring it. Vague descriptions are refused server-side with tips, which are
 * shown instead of a guess.
 */
export default function HsCodeSuggestion({
  description,
  destinationCountry,
  originCountry,
  onPick,
}: HsCodeSuggestionProps) {
  const { mutate, data, error, isPending, reset } = useMatchHsCodes();
  const result = data?.results[0];

  const handleSuggest = () => {
    if (!destinationCountry) return;
    mutate(
      {
        destinationCountry,
        originCountry,
        items: [{ itemIndex: 0, description }],
      },
      {
        onSuccess: (response) => {
          const match = response.results[0];
          if (match?.status === "MATCHED" && match.tariffCode) {
            onPick(toHeading(match.tariffCode));
          }
        },
      },
    );
  };

  const alternatives = (result?.candidates ?? [])
    .map((candidate) => ({ ...candidate, heading: toHeading(candidate.tariffCode) }))
    .filter(
      (candidate, index, all) =>
        candidate.heading !== toHeading(result?.tariffCode ?? "") &&
        all.findIndex((other) => other.heading === candidate.heading) === index,
    )
    .slice(0, 3);

  return (
    <div className="mt-2 space-y-2">
      <button
        type="button"
        onClick={handleSuggest}
        disabled={isPending || !destinationCountry || !description.trim()}
        className="inline-flex items-center text-[11px] font-bold text-brand-blue hover:underline disabled:opacity-50 disabled:no-underline"
      >
        <FiZap className="mr-1" />
        {isPending ? "Finding a code..." : "Suggest a code"}
      </button>

      {error && (
        <p className="text-[11px] text-red-600 font-medium">
          {extractApiError(error).message || "Couldn't suggest a code right now."}
        </p>
      )}

      {result?.status === "MATCHED" && (
        <div className="text-[11px] text-gray-600 font-medium space-y-1">
          <p>
            Filled in from: {result.standardDescription}
            {result.confidence != null &&
              ` (${Math.round(result.confidence * 100)}% match)`}
            . Please check it fits.
          </p>
          {alternatives.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {alternatives.map((candidate) => (
                <button
                  key={candidate.heading}
                  type="button"
                  title={candidate.description}
                  onClick={() => {
                    onPick(candidate.heading);
                    reset();
                  }}
                  className="px-2 py-1 rounded-lg border border-gray-200 bg-white hover:border-brand-blue text-gray-700"
                >
                  {candidate.heading}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {result?.status === "VALIDATION_FAILED" && result.error && (
        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
          <p className="font-bold">{result.error.message}</p>
          {result.error.suggestions.length > 0 && (
            <ul className="list-disc pl-4 mt-1">
              {result.error.suggestions.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}
          <p className="mt-1">
            You can change the description in the package step.
          </p>
        </div>
      )}

      {result?.status === "LOOKUP_FAILED" && (
        <p className="text-[11px] text-gray-600 font-medium">
          No code found for this description. Use the HS code finder instead.
        </p>
      )}
    </div>
  );
}
