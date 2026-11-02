import { notFound } from "next/navigation";
import { isSiteLocale, SITE_LOCALES } from "@/utils/site-locale";
import LocaleAutoDetect from "@/components/site/locale-auto-detect";

/**
 * Language segment for the company and freight pages (`/en/...`, `/pl/...`).
 * Header and footer come from `app/(marketing)/layout.tsx`.
 */
export function generateStaticParams() {
  return SITE_LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isSiteLocale(lang)) notFound();

  return (
    <div lang={lang}>
      <LocaleAutoDetect locale={lang} />
      {children}
    </div>
  );
}
