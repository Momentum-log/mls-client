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
  /** Preview photo for the mega menu, with the crop that suits it. */
  image: { src: string; position: string };
}

const ICONS: Record<ServiceId, LucideIcon> = {
  ship: Package,
  track: MapPin,
  freight: Truck,
  sustainability: Leaf,
};

/**
 * Only two photos exist so far: Ship, Track and Freight share the hero photo
 * with different crops until dedicated ones arrive.
 */
const IMAGES: Record<ServiceId, ServiceLink["image"]> = {
  ship: { src: "/images/landing/hero-truck.jpg", position: "30% 50%" },
  track: { src: "/images/landing/hero-truck.jpg", position: "85% 40%" },
  freight: { src: "/images/landing/hero-truck.jpg", position: "60% 75%" },
  sustainability: { src: "/images/landing/sustainability.jpg", position: "50% 50%" },
};

/**
 * Tracking is English only, so it has no language segment. "Ship a parcel"
 * takes signed-in customers straight to the booking form; guests see the
 * Ship page first (D11).
 */
const hrefFor = (id: ServiceId, locale: SiteLocale, signedIn: boolean): string => {
  if (id === "track") return "/track-shipment";
  if (id === "ship" && signedIn) return "/app/shipments/new";
  return localePath(locale, `/${id}`);
};

/** The four Services entries shown in the mega menu and the mobile menu. */
export const getServiceLinks = (
  copy: SiteCopy,
  locale: SiteLocale,
  signedIn: boolean,
): ServiceLink[] =>
  copy.nav.serviceItems.map((item) => {
    const id = item.id as ServiceId;
    return {
      ...item,
      id,
      icon: ICONS[id],
      image: IMAGES[id],
      href: hrefFor(id, locale, signedIn),
    };
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
