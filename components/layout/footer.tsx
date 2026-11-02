"use client";

import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useSiteLocale } from "@/hooks/use-site-locale";
import { SITE_CONTACT } from "@/components/site/copy";
import { localePath } from "@/utils/site-locale";

const linkClass =
  "text-[15px] font-medium leading-[22px] text-navy-fg no-underline hover:text-white";
const headingClass =
  "text-[13px] font-bold uppercase leading-4 tracking-[0.15em] text-brand-yellow";
const socialClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-navy-fg hover:text-white";

export default function Footer() {
  const { locale, copy } = useSiteLocale();
  const t = copy.footer;
  const freight = localePath(locale, "/freight");

  const columns = [
    {
      title: t.shipTitle,
      links: [
        { href: "/shipping-estimate", label: t.quote },
        { href: "/track-shipment", label: t.track },
        { href: localePath(locale, "/ship"), label: t.business },
        { href: "/login", label: t.signIn },
      ],
    },
    {
      title: t.freightTitle,
      links: [
        { href: freight, label: t.road },
        { href: freight, label: t.sea },
        { href: freight, label: t.air },
        { href: `${freight}#enquiry`, label: t.freightQuote },
      ],
    },
    {
      title: t.companyTitle,
      links: [
        { href: localePath(locale, "/about"), label: t.about },
        { href: localePath(locale, "/sustainability"), label: t.sustainability },
        { href: `${localePath(locale, "/about")}#faq`, label: t.faq },
        { href: localePath(locale, "/contact"), label: t.contact },
      ],
    },
  ];

  return (
    <footer className="w-full bg-brand-navy font-satoshi text-navy-fg">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 pb-8 pt-16 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Image
              src="/images/logo-landscape-white.svg"
              alt="Momentum Logistics Service"
              width={160}
              height={44}
              className="h-11 w-auto self-start"
            />
            <p className="m-0 max-w-[280px] text-sm leading-[22px] text-navy-muted">
              {t.tagline}
            </p>
            <div className="flex gap-2">
              <a href={SITE_CONTACT.social.x} aria-label="Momentum on X" className={socialClass}>
                <FaXTwitter className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
              <a
                href={SITE_CONTACT.social.instagram}
                aria-label="Momentum on Instagram"
                className={socialClass}
              >
                <FaInstagram className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
              <a
                href={SITE_CONTACT.social.linkedin}
                aria-label="Momentum on LinkedIn"
                className={socialClass}
              >
                <FaLinkedinIn className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <span className={headingClass}>{column.title}</span>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <span className={headingClass}>{t.talkTitle}</span>
            <a href={`mailto:${SITE_CONTACT.email}`} className={linkClass}>
              {SITE_CONTACT.email}
            </a>
            <a href={SITE_CONTACT.phoneHref} className={linkClass}>
              {SITE_CONTACT.phone}
            </a>
            <a href={SITE_CONTACT.whatsappHref} className={linkClass}>
              {t.whatsapp}
            </a>
            <span className="text-sm leading-[22px] text-navy-muted">
              {SITE_CONTACT.addressLines[1]}
              <br />
              {SITE_CONTACT.addressLines[2]}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-[13px] leading-5 text-navy-muted">
          <span>
            © {new Date().getFullYear()} {t.copyright}
          </span>
          <div className="flex flex-wrap gap-5">
            <Link href="/terms" className="text-navy-muted no-underline hover:text-white">
              {t.terms}
            </Link>
            <Link href="/privacy" className="text-navy-muted no-underline hover:text-white">
              {t.privacy}
            </Link>
            <Link href="/cookies" className="text-navy-muted no-underline hover:text-white">
              {t.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
