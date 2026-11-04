"use client";

import React, { useId, useMemo, useState } from "react";
import { FiExternalLink, FiLoader } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSiteLocale } from "@/hooks/use-site-locale";
import { isHsSearchable, useSuggestHsCodes } from "@/hooks/shipments/use-shipments";
import type { CnSuggestion } from "@/types/shipping";

interface HsCodeComboboxProps {
  name: string;
  value: string;
  /** Called with the raw text as the customer types. */
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** The item's description, searched while the field is empty. */
  description: string;
}

/**
 * The tariff code field, with CN code suggestions while typing (W7).
 *
 * Type a product word or the first digits of a code; with the field empty, the
 * item's description is searched. Only full 8-digit codes can be picked: 4- and
 * 6-digit headings are shown as group labels. A picked code stays editable and
 * is flagged for the customer to check, because it is their customs
 * declaration. Follows the WAI-ARIA combobox pattern (list autocomplete).
 */
export default function HsCodeCombobox({
  name,
  value,
  onChange,
  onBlur,
  description,
}: HsCodeComboboxProps) {
  const listId = useId();
  const { locale } = useSiteLocale();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [picked, setPicked] = useState<CnSuggestion | null>(null);

  const typed = value.trim();
  const term = typed ? typed : description;
  const debounced = useDebounce(open ? term : "", 400);
  const { data, isFetching, isError } = useSuggestHsCodes(
    debounced,
    locale === "pl" ? "pl" : "en",
  );

  const suggestions = useMemo(() => data?.suggestions ?? [], [data]);
  const options = useMemo(() => suggestions.filter((s) => s.selectable), [suggestions]);
  const headings = suggestions.filter((s) => !s.selectable);
  const searchable = isHsSearchable(term);

  const choose = (suggestion: CnSuggestion) => {
    onChange(suggestion.code);
    setPicked(suggestion);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (options.length === 0 ? -1 : (i + 1) % options.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (options.length === 0 ? -1 : (i - 1 + options.length) % options.length));
    } else if (event.key === "Enter" && open && active >= 0 && options[active]) {
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const showList = open && searchable;
  const activeId = active >= 0 ? `${listId}-opt-${active}` : undefined;

  return (
    <div className="relative">
      <Input
        name={name}
        value={value}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList ? activeId : undefined}
        autoComplete="off"
        placeholder="Type a product or code, e.g. cotton t-shirt"
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(event.target.value);
          setPicked(null);
          setOpen(true);
          setActive(-1);
        }}
        onBlur={(event) => {
          // Let a click on an option land before the list closes.
          setTimeout(() => setOpen(false), 150);
          onBlur?.(event);
        }}
        onKeyDown={onKeyDown}
      />

      {showList && (
        <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {!typed && (
            <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Codes for &ldquo;{description}&rdquo;
            </p>
          )}
          {headings.length > 0 && (
            <p className="px-3 pt-2 text-[10px] font-semibold text-gray-500">
              In:{" "}
              {headings
                .slice(0, 2)
                .map((h) => `${h.code} ${h.description}`)
                .join(" · ")}
            </p>
          )}
          <ul id={listId} role="listbox" aria-label="Suggested HS codes" className="py-1">
            {options.map((option, index) => (
              <li
                key={option.code}
                id={`${listId}-opt-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
                className={`cursor-pointer px-3 py-2 text-xs ${
                  index === active ? "bg-brand-blue/10" : "hover:bg-gray-50"
                }`}
              >
                <span className="font-mono font-bold text-gray-900">{option.code}</span>
                <span className="ml-2 text-gray-600">{option.description}</span>
              </li>
            ))}
          </ul>
          <p role="status" aria-live="polite" className="px-3 pb-2 text-[11px] text-gray-500">
            {isFetching ? (
              <span className="inline-flex items-center gap-1">
                <FiLoader className="animate-spin" aria-hidden="true" /> Searching…
              </span>
            ) : isError || (data?.degraded && options.length === 0) ? (
              "Suggestions are unavailable right now. Enter the code yourself or use Suggest a code."
            ) : data && options.length === 0 ? (
              "No full codes found. Try another word, or more digits."
            ) : (
              ""
            )}
          </p>
        </div>
      )}

      {picked && picked.code === value && (
        <p className="mt-1.5 text-[11px] font-medium text-amber-800">
          Suggested code: {picked.description}. Please check it matches your item, as it
          goes on your customs declaration.
          {picked.url && (
            <>
              {" "}
              <a
                href={picked.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-bold text-brand-blue hover:underline"
              >
                Details <FiExternalLink aria-hidden="true" />
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}
