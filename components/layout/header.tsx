"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import logoLandscape from "@/public/images/logo-landscape.svg";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { useCountryStore } from "@/store/country-store";
import { useSiteLocale } from "@/hooks/use-site-locale";
import { localePath } from "@/utils/site-locale";
import { getServiceLinks, isServicesPath } from "./header-services";
import HeaderServicesMenu from "./header-services-menu";
import HeaderRegionMenu from "./header-region-menu";
import HeaderMobileMenu from "./header-mobile-menu";

type OpenPanel = "services" | "region" | "mobile" | null;

const navItemClass =
  "inline-flex h-11 items-center gap-1.5 rounded-xl px-3.5 text-[15px] font-semibold no-underline transition-colors";

/**
 * Marketing site header: Services mega menu, language and region menu, and a
 * drop-down menu on small screens. Only one panel is open at a time.
 */
const Header: FC = () => {
  const pathname = usePathname() ?? "/";
  const { locale, copy } = useSiteLocale();
  const { isAuthenticated } = useAuthStore();
  const { currency } = useCountryStore();
  const [open, setOpen] = useState<OpenPanel>(null);
  const headerRef = useRef<HTMLElement>(null);

  const close = (): void => setOpen(null);
  const toggle = (panel: Exclude<OpenPanel, null>) => (): void =>
    setOpen((current) => (current === panel ? null : panel));

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent): void => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const services = getServiceLinks(copy, locale, isAuthenticated);
  const links = [
    { href: localePath(locale, "/about"), label: copy.nav.about },
    { href: `${localePath(locale, "/about")}#faq`, label: copy.nav.faq },
    { href: localePath(locale, "/contact"), label: copy.nav.contact },
  ];
  const account = isAuthenticated
    ? { href: "/app/dashboard", label: copy.nav.account }
    : { href: "/login", label: copy.nav.signIn };
  const servicesActive = open === "services" || isServicesPath(pathname);
  const regionLabel = `${locale.toUpperCase()} · ${currency}`;

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => open === "services" && close()}
      className="relative z-50 border-b border-gray-100 bg-white font-satoshi text-foreground"
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-2.5 sm:px-6 lg:gap-8 lg:py-3.5">
        <Link
          href={localePath(locale)}
          aria-label={copy.nav.home}
          className="flex shrink-0 items-center"
          onClick={close}
        >
          <Image
            src={logoLandscape}
            alt="Momentum Logistics Service"
            className="h-[30px] w-auto lg:h-10"
            priority
          />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          <button
            type="button"
            onMouseEnter={() => setOpen("services")}
            onClick={toggle("services")}
            aria-expanded={open === "services"}
            aria-controls="services-menu"
            className={cn(
              navItemClass,
              servicesActive
                ? "bg-brand-blue-tint text-brand-blue"
                : "text-gray-700 hover:text-brand-blue",
            )}
          >
            {copy.nav.services}
            <ChevronDown
              className={cn("h-3.5 w-3.5", open === "services" && "rotate-180")}
              aria-hidden="true"
            />
          </button>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => open === "services" && close()}
              className={cn(
                navItemClass,
                pathname === link.href
                  ? "bg-brand-blue-tint text-brand-blue"
                  : "text-gray-700 hover:text-brand-blue",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0 lg:gap-3">
          <button
            type="button"
            onClick={toggle("region")}
            aria-expanded={open === "region"}
            aria-haspopup="dialog"
            aria-label={`${copy.nav.regionButton}: ${regionLabel}`}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] font-bold text-foreground lg:gap-2 lg:px-3.5 lg:text-sm lg:font-semibold"
          >
            <Globe className="h-[18px] w-[18px] text-brand-blue" aria-hidden="true" />
            <span>{regionLabel}</span>
            <ChevronDown
              className="hidden h-3.5 w-3.5 text-gray-500 lg:block"
              aria-hidden="true"
            />
          </button>
          <Link
            href={account.href}
            className="hidden h-11 items-center px-3 text-sm font-semibold text-foreground no-underline hover:text-brand-blue lg:inline-flex"
          >
            {account.label}
          </Link>
          <Link
            href="/shipping-estimate"
            className="hidden h-11 items-center rounded-xl bg-brand-blue px-5 text-sm font-bold text-white no-underline shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-dark lg:inline-flex"
          >
            {copy.nav.quote}
          </Link>
          <button
            type="button"
            onClick={toggle("mobile")}
            aria-expanded={open === "mobile"}
            aria-controls="mobile-menu"
            aria-label={open === "mobile" ? copy.nav.closeMenu : copy.nav.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-foreground lg:hidden"
          >
            {open === "mobile" ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open === "services" && (
        <div className="hidden lg:block">
          <HeaderServicesMenu
            copy={copy}
            locale={locale}
            services={services}
            onNavigate={close}
          />
        </div>
      )}
      {open === "region" && (
        <HeaderRegionMenu copy={copy} locale={locale} onClose={close} />
      )}
      {open === "mobile" && (
        <HeaderMobileMenu
          copy={copy}
          services={services}
          links={links}
          account={account}
          onNavigate={close}
        />
      )}
    </header>
  );
};

export default Header;
