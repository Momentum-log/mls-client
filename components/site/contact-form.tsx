"use client";

import React, { FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContactMessage } from "@/api/contact";
import { handleApiError } from "@/utils/error-handler";
import type { SiteLocale } from "@/utils/site-locale";

export interface ContactFormCopy {
  firstName: string;
  lastName: string;
  email: string;
  emailPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  replyNote: string;
  send: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
}

interface ContactFormProps {
  copy: ContactFormCopy;
  locale: SiteLocale;
}

/** The contact page message form. Posts to the API; staff answer by email. */
const ContactForm: FC<ContactFormProps> = ({ copy, locale }) => {
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending, isSuccess } = useMutation({ mutationFn: sendContactMessage });

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const value = (key: string): string => String(form.get(key) ?? "").trim();
    mutate(
      {
        name: `${value("first_name")} ${value("last_name")}`.trim(),
        email: value("email"),
        subject: value("subject"),
        message: value("message"),
        locale: locale === "pl" ? "pl" : "en",
        website: value("website"),
      },
      { onError: (e) => setError(handleApiError(e).message) },
    );
  };

  if (isSuccess) {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-xl bg-gray-50 p-5">
        <h3 className="m-0 text-lg font-bold text-gray-900">{copy.sentTitle}</h3>
        <p className="m-0 text-[15px] text-gray-600">{copy.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input name="first_name" label={copy.firstName} placeholder={copy.firstName} required />
        <Input name="last_name" label={copy.lastName} placeholder={copy.lastName} required />
      </div>
      <Input
        name="email"
        type="email"
        label={copy.email}
        placeholder={copy.emailPlaceholder}
        required
      />
      <Input name="subject" label={copy.subject} placeholder={copy.subjectPlaceholder} required />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="msg-body" className="text-sm font-semibold text-gray-700">
          {copy.message}
        </label>
        <textarea
          id="msg-body"
          name="message"
          rows={6}
          required
          minLength={5}
          maxLength={5000}
          placeholder={copy.messagePlaceholder}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] leading-[22px] text-foreground placeholder:text-gray-400 focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20"
        />
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="msg-website">Website</label>
        <input id="msg-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {error && (
        <p role="alert" className="m-0 rounded-xl bg-warning-bg px-3.5 py-3 text-sm font-medium text-warning-fg">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-gray-500">{copy.replyNote}</span>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? copy.sending : copy.send}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
