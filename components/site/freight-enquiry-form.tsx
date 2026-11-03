"use client";

import React, { FC, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitInquiry } from "@/hooks/inquiries/use-inquiries";
import type { FreightType } from "@/types/inquiry";
import { handleApiError } from "@/utils/error-handler";
import type { SiteCopy } from "@/components/site/copy";

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
}

const EMPTY: FormState = { name: "", company: "", email: "", phone: "", description: "" };

const MODES: FreightType[] = ["ROAD", "SEA", "AIR"];

/** Freight enquiry form. Posts to `POST /inquiries` for the freight team. */
const FreightEnquiryForm: FC<{ copy: SiteCopy["freight"]["form"] }> = ({ copy }) => {
  const { mutateAsync: submitInquiry, isPending } = useSubmitInquiry();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [mode, setMode] = useState<FreightType>("ROAD");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    try {
      await submitInquiry({
        name: form.name,
        companyName: form.company,
        email: form.email,
        phone: form.phone,
        freightTypes: [mode],
        description: form.description,
      });
      setIsSubmitted(true);
    } catch (submitError) {
      setError(handleApiError(submitError).message);
    }
  };

  const modeLabels: Record<FreightType, string> = {
    ROAD: copy.road,
    SEA: copy.sea,
    AIR: copy.air,
  };

  const cardClass =
    "flex min-w-0 flex-[2_1_560px] flex-col gap-5 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8";

  if (isSubmitted) {
    return (
      <div className={cn(cardClass, "items-center justify-center text-center")} role="status">
        <span className="inline-flex rounded-full bg-success-bg p-4 text-success">
          <Check className="h-[30px] w-[30px]" aria-hidden="true" />
        </span>
        <h3 className="m-0 font-satoshi text-2xl font-bold text-gray-900">
          {copy.thanks}
          {form.name ? `, ${form.name.split(" ")[0]}` : ""}!
        </h3>
        <p className="m-0 max-w-[360px] text-base leading-relaxed text-gray-600">{copy.success}</p>
        <Button
          variant="outline"
          onClick={() => {
            setForm(EMPTY);
            setIsSubmitted(false);
          }}
        >
          {copy.another}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="enq-h" className={cardClass}>
      {error && (
        <div role="alert" className="rounded-xl border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label={copy.fullName} placeholder={copy.fullName} value={form.name} onChange={setField("name")} required />
        <Input
          label={copy.companyName}
          placeholder={copy.companyName}
          value={form.company}
          onChange={setField("company")}
          required
        />
        <Input
          label={copy.email}
          type="email"
          placeholder={copy.emailPlaceholder}
          value={form.email}
          onChange={setField("email")}
          required
        />
        <Input
          label={copy.phone}
          type="tel"
          placeholder={copy.phonePlaceholder}
          value={form.phone}
          onChange={setField("phone")}
          required
        />
      </div>
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="mb-2.5 p-0 text-sm font-semibold text-gray-900">{copy.freightType}</legend>
        <div className="grid grid-cols-3 gap-2.5">
          {MODES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              aria-pressed={item === mode}
              className={cn(
                "h-12 rounded-xl bg-white text-[15px] font-bold",
                item === mode
                  ? "border-2 border-brand-blue bg-brand-blue-tint text-brand-blue"
                  : "border border-gray-200 text-gray-700",
              )}
            >
              {modeLabels[item]}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="enq-desc" className="text-sm font-semibold text-gray-900">
          {copy.description}
        </label>
        <textarea
          id="enq-desc"
          rows={5}
          placeholder={copy.descriptionPlaceholder}
          value={form.description}
          onChange={setField("description")}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] leading-[22px] text-foreground placeholder:text-gray-400 focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-gray-500">{copy.replyNote}</span>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? copy.sending : copy.send}
        </Button>
      </div>
    </form>
  );
};

export default FreightEnquiryForm;
