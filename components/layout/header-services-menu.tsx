"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { SITE_CONTACT, type SiteCopy } from "@/components/site/copy";
import { localePath, type SiteLocale } from "@/utils/site-locale";
import type { ServiceLink } from "./header-services";

interface HeaderServicesMenuProps {
  copy: SiteCopy;
  locale: SiteLocale;
  services: ServiceLink[];
  onNavigate: () => void;
}

/**
 * Full-width Services panel under the desktop header. Hovering or focusing a
 * service swaps the preview on the right.
 */
const HeaderServicesMenu: FC<HeaderServicesMenuProps> = ({
  copy,
  locale,
  services,
  onNavigate,
}) => {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId) ?? services[0];
  const ActiveIcon = active.icon;

  return (
    <div
      id="services-menu"
      className="absolute inset-x-0 top-full border-y border-gray-100 bg-white shadow-2xl shadow-gray-900/15"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap gap-8 px-6 pb-8 pt-7">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-1.5">
          <span className="px-3 pb-2 text-[13px] font-bold uppercase leading-4 tracking-[0.15em] text-brand-blue">
            {copy.nav.services}
          </span>
          {services.map((service) => {
            const isActive = service.id === active.id;
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                onClick={onNavigate}
                onMouseEnter={() => setActiveId(service.id)}
                onFocus={() => setActiveId(service.id)}
                className={cn(
                  "flex items-center gap-3.5 rounded-2xl p-3 no-underline",
                  isActive && "bg-brand-blue-tint",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    isActive
                      ? "bg-brand-blue text-white"
                      : "bg-gray-100 text-brand-blue",
                  )}
                >
                  <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <strong className="text-[17px] font-bold leading-[22px] text-gray-900">
                    {service.title}
                  </strong>
                  <span className="text-sm leading-5 text-gray-600">
                    {service.blurb}
                  </span>
                </span>
                <ArrowRight
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive ? "text-brand-blue" : "text-gray-300",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-[1.4_1_520px] flex-col justify-between gap-6 rounded-3xl bg-brand-blue-tint p-8">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue text-white">
            <ActiveIcon className="h-8 w-8" aria-hidden="true" />
          </span>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex max-w-[440px] flex-col gap-2">
              <strong className="font-satoshi text-2xl font-bold leading-8 text-gray-900">
                {active.title}
              </strong>
              <span className="text-[15px] font-medium leading-[22px] text-gray-700">
                {active.detail}
              </span>
            </div>
            <Link
              href={active.href}
              onClick={onNavigate}
              className="inline-flex h-11 items-center rounded-xl bg-foreground px-[18px] text-sm font-bold text-white no-underline hover:bg-gray-800"
            >
              {active.cta}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-3 px-6 py-3.5 text-sm font-medium text-gray-600">
          <span>
            {copy.nav.heavy}{" "}
            <Link
              href={localePath(locale, "/freight")}
              onClick={onNavigate}
              className="font-bold text-brand-blue hover:text-brand-blue-dark"
            >
              {copy.nav.heavyLink}
            </Link>
          </span>
          <a
            href={SITE_CONTACT.whatsappHref}
            className="font-bold text-brand-blue no-underline hover:text-brand-blue-dark"
          >
            WhatsApp {SITE_CONTACT.phone}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderServicesMenu;
