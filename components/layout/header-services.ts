import { Leaf, MapPin, Package, Truck, type LucideIcon } from "lucide-react";
import type { SiteCopy } from "@/components/site/copy";
import { localePath, type SiteLocale } from "@/utils/site-locale";

export type ServiceId = "ship" | "track" | "freight" | "sustainability";

export interface ServiceLink {
  id: ServiceId;
  href: string;
  icon: LucideIcon;
  title: string;
  blurb: string;
  cta: string;
  detail: string;
}

const ICONS: Record<ServiceId, LucideIcon> = {
  ship: Package,
  track: MapPin,
  freight: Truck,
  sustainability: Leaf,
};

/** Tracking is English only, so it has no language segment. */
const hrefFor = (id: ServiceId, locale: SiteLocale): string =>
  id === "track" ? "/track-shipment" : localePath(locale, `/${id}`);

/** The four Services entries shown in the mega menu and the mobile menu. */
export const getServiceLinks = (
  copy: SiteCopy,
  locale: SiteLocale,
): ServiceLink[] =>
  copy.nav.serviceItems.map((item) => {
    const id = item.id as ServiceId;
    return { ...item, id, icon: ICONS[id], href: hrefFor(id, locale) };
  });

const SERVICE_PATHS = [
  "/ship",
  "/freight",
  "/sustainability",
  "/track-shipment",
  "/shipping-estimate",
];

/** Whether the current page belongs under Services in the nav. */
export const isServicesPath = (pathname: string): boolean =>
  SERVICE_PATHS.some((path) => pathname.includes(path));
