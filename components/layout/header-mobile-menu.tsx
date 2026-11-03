"use client";

import React, { FC } from "react";
import Link from "next/link";
import type { SiteCopy } from "@/components/site/copy";
import type { ServiceLink } from "./header-services";

interface NavLink {
  href: string;
  label: string;
}

interface HeaderMobileMenuProps {
  copy: SiteCopy;
  services: ServiceLink[];
  links: NavLink[];
  account: NavLink;
  onNavigate: () => void;
}

/** Drop-down navigation under the header below the `lg` breakpoint. */
const HeaderMobileMenu: FC<HeaderMobileMenuProps> = ({
  copy,
  services,
  links,
  account,
  onNavigate,
}) => (
  <nav
    id="mobile-menu"
    aria-label="Mobile menu"
    className="absolute inset-x-0 top-full flex max-h-[calc(100vh-64px)] flex-col gap-1.5 overflow-y-auto border-b border-gray-200 bg-white p-4 shadow-xl lg:hidden"
  >
    <span className="px-1 pb-2 pt-1 text-[13px] font-bold uppercase leading-4 tracking-[0.15em] text-brand-blue">
      {copy.nav.services}
    </span>
    {services.map((service) => {
      const Icon = service.icon;
      return (
        <Link
          key={service.id}
          href={service.href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl p-2 text-gray-900 no-underline hover:bg-gray-50"
        >
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-blue-tint text-brand-blue">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-0.5">
            <strong className="text-base font-bold leading-[22px]">
              {service.title}
            </strong>
            <span className="text-[13px] leading-[18px] text-gray-600">
              {service.blurb}
            </span>
          </span>
        </Link>
      );
    })}
    <div className="my-1.5 h-px bg-gray-100" />
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={onNavigate}
        className="flex min-h-12 items-center px-2 text-base font-semibold text-gray-900 no-underline"
      >
        {link.label}
      </Link>
    ))}
    <Link
      href={account.href}
      onClick={onNavigate}
      className="mt-1.5 flex h-12 items-center justify-center rounded-xl border-2 border-gray-200 text-[15px] font-bold text-foreground no-underline"
    >
      {account.label}
    </Link>
    <Link
      href="/shipping-estimate"
      onClick={onNavigate}
      className="flex h-12 items-center justify-center rounded-xl bg-brand-blue text-[15px] font-bold text-white no-underline"
    >
      {copy.nav.quote}
    </Link>
  </nav>
);

export default HeaderMobileMenu;
