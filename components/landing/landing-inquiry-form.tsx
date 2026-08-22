"use client";

import React, { FC, useState } from "react";
import { Calculator, Check, FileText, Handshake } from "lucide-react";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Eyebrow from "@/components/landing/eyebrow";
import { useLandingCopy } from "@/hooks/use-landing-copy";
import { useSubmitInquiry } from "@/hooks/inquiries/use-inquiries";
import { FreightType } from "@/types/inquiry";
import { handleApiError } from "@/utils/error-handler";

/** Local shape of the form's controlled fields. */
interface InquiryFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  freight: string;
  description: string;
}

const emptyForm: InquiryFormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  freight: "",
  description: "",
};

/**
 * "Become a partner" freight enquiry section.
 *
 * This is a live lead-capture form: submitting posts to `POST /inquiries`
 * through the shared API client, so the operations team receives the enquiry.
 * Distinct from the instant shipment quote at `/shipping-estimate`.
 */
const LandingInquiryForm: FC = () => {
  const { copy } = useLandingCopy();
  const { mutateAsync: submitInquiry, isPending } = useSubmitInquiry();

  const [form, setForm] = useState<InquiryFormState>(emptyForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Curried change handler for the plain text inputs. */
  const setField =
    (field: keyof InquiryFormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError(null);

    // The freight picker is a custom control, so the browser's native `required`
    // validation does not cover it — guard here rather than spending a round
    // trip to have the API reject an empty `freightTypes`.
    if (!form.freight) {
      setError(copy.freightRequired);
      return;
    }

    try {
      await submitInquiry({
        name: form.name,
        companyName: form.company,
        email: form.email,
        phone: form.phone,
        // The select emits lowercase; the API expects an uppercase enum array.
        freightTypes: [form.freight.toUpperCase() as FreightType],
        description: form.description,
      });

      setIsSubmitted(true);
      window.scrollTo({
        top: (document.getElementById("partner-form")?.offsetTop ?? 0) - 40,
        behavior: "smooth",
      });
    } catch (submitError) {
      setError(handleApiError(submitError).message);
    }
  };

  const resetForm = (): void => {
    setForm(emptyForm);
    setIsSubmitted(false);
    setError(null);
  };

  const steps = [
    { icon: FileText, title: copy.step1Title, description: copy.step1Desc },
    { icon: Calculator, title: copy.step2Title, description: copy.step2Desc },
    { icon: Handshake, title: copy.step3Title, description: copy.step3Desc },
  ];

  return (
    <section
      id="partner-form"
      className="relative overflow-hidden bg-brand-blue py-20 md:py-[88px]"
    >
      <span
        className="absolute -right-[120px] -top-[120px] h-[360px] w-[360px] rounded-full bg-white/5"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left rail */}
          <div>
            <Eyebrow className="text-brand-yellow">
              {copy.becomePartner}
            </Eyebrow>
            <h2 className="my-4 font-work-sans text-[clamp(28px,5.2vw,42px)] font-extrabold leading-[1.12] text-white">
              {copy.moveFreight}
            </h2>
            <p className="mb-8 max-w-[420px] text-lg leading-relaxed text-white/80">
              {copy.formIntro}
            </p>

            <ul className="flex list-none flex-col gap-5 p-0">
              {steps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-work-sans font-extrabold text-brand-yellow">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-base font-bold text-white">
                      {step.title}
                    </div>
                    <div className="text-sm leading-relaxed text-white/80">
                      {step.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            {isSubmitted ? (
              <div className="px-2 py-4 text-center">
                <span className="inline-flex rounded-full bg-success-bg p-4 text-success">
                  <Check className="h-[30px] w-[30px]" aria-hidden="true" />
                </span>
                <h3 className="mb-2 mt-4 font-work-sans text-2xl font-extrabold text-gray-900">
                  {copy.thanks}
                  {form.name ? `, ${form.name.split(" ")[0]}` : ""}!
                </h3>
                <p className="mx-auto max-w-[360px] text-base leading-relaxed text-gray-500">
                  {copy.requestSuccess}
                </p>
                <div className="mt-6">
                  <Button variant="outline" rounded="full" onClick={resetForm}>
                    {copy.submitAnother}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={copy.fullName}
                    placeholder={copy.namePlaceholder}
                    value={form.name}
                    onChange={setField("name")}
                    required
                  />
                  <Input
                    label={copy.companyName}
                    placeholder={copy.companyPlaceholder}
                    value={form.company}
                    onChange={setField("company")}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={copy.emailAddress}
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    value={form.email}
                    onChange={setField("email")}
                    required
                  />
                  <Input
                    label={copy.phoneNumber}
                    type="tel"
                    placeholder={copy.phonePlaceholder}
                    value={form.phone}
                    onChange={setField("phone")}
                    required
                  />
                </div>

                <Select
                  label={copy.freightType}
                  value={form.freight}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, freight: value }))
                  }
                  placeholder={copy.selectFreight}
                  options={[
                    { label: copy.roadFreight, value: "road" },
                    { label: copy.seaFreight, value: "sea" },
                    { label: copy.airFreight, value: "air" },
                  ]}
                />

                <div>
                  <label
                    htmlFor="inquiry-description"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    {copy.description}
                  </label>
                  <textarea
                    id="inquiry-description"
                    rows={4}
                    placeholder={copy.placeholderDesc}
                    value={form.description}
                    onChange={setField("description")}
                    className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-foreground transition-all duration-200 placeholder:text-gray-400 focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  rounded="full"
                  type="submit"
                  disabled={isPending}
                  className="mt-1 w-full disabled:opacity-70"
                >
                  {isPending ? copy.sending : `${copy.ctaPrimary} →`}
                </Button>

                <p className="m-0 text-center text-[13px] text-gray-400">
                  {copy.privacyNotice}
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LandingInquiryForm;
