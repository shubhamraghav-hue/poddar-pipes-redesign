import type { Office } from "@/types";
import { hasOverlays } from "@/lib/i18n/localize";
import { companyAddressHi } from "@/lib/data/hi/offices";

// CLIENT-APPROVED SOURCE OF TRUTH (2026-10-08). Every contact detail on the
// site — footer, /contact, legal pages, enquiry screens, 404, JSON-LD — reads
// from here. Change them here, not in the components.
export const COMPANY = {
  legalName: "Poddar Plumbing System Pvt. Ltd.",
  email: "hello@poddarpipes.com",
  phone: { display: "+91 98888 22333", href: "tel:+919888822333" },
  /** Registered office, in the client's own wording (updated 2026-10-22). */
  address: {
    street: "#1202, HAL 2nd Stage Domlur, 100 Feet Road, Indiranagar",
    city: "Bengaluru",
    postalCode: "560008",
    region: "Karnataka",
    country: "India",
    oneLine:
      "#1202, HAL 2nd Stage Domlur, 100 Feet Road, Indiranagar, Bengaluru, Karnataka - 560008, India",
    /** The same address broken where the client breaks it (footer, /contact). */
    lines: ["#1202, HAL 2nd Stage Domlur, 100 Feet Road,", "Indiranagar, Bengaluru, Karnataka - 560008, India"],
  },
  /** The one manufacturing unit. */
  plant: {
    street: "Plot No. 96 & 97, Vemagal, 2nd Phase, KIADB Industrial Area",
    locality: "Vemagal",
    district: "Kolar Dist.",
    postalCode: "563157",
    region: "Karnataka",
    country: "India",
    oneLine:
      "Plot No. 96 & 97, Vemagal, 2nd Phase, KIADB Industrial Area, Kolar Dist., Karnataka - 563157, India",
    lines: ["Plot No. 96 & 97, Vemagal, 2nd Phase, KIADB Industrial Area,", "Kolar Dist., Karnataka - 563157, India"],
  },
  /** Careers: no openings are listed; interested people write here. */
  hrEmail: "kusuma.kt@poddarpipes.com",
} as const;

/**
 * The postal addresses as DISPLAYED for a locale (client, 2026-10-22: Hindi on
 * /hi; overlay in lib/data/hi/offices.ts). Only the visible text is swapped —
 * `street`, `oneLine`, `lines`; the structured parts stay English. JSON-LD
 * must keep reading `COMPANY.address` directly, never these.
 */
type DisplayAddress = { street: string; oneLine: string; lines: readonly string[] };

export function getAddress(locale: string): DisplayAddress {
  return hasOverlays(locale) ? companyAddressHi.address : COMPANY.address;
}

export function getPlant(locale: string): DisplayAddress {
  return hasOverlays(locale) ? companyAddressHi.plant : COMPANY.plant;
}

/** The registered office broken where the client breaks it (footer, /contact). */
export const getAddressLines = (locale: string) => getAddress(locale).lines;

/** The plant address, broken the same way. */
export const getPlantLines = (locale: string) => getPlant(locale).lines;

// The regional-office placeholders that used to live here were removed: the
// client has one office and one plant, and nothing renders regional offices.
export const offices: Office[] = [
  {
    id: "hq",
    city: COMPANY.address.city,
    country: COMPANY.address.country,
    type: "Registered & Corporate Office",
    address: COMPANY.address.oneLine,
    phone: COMPANY.phone.display,
    email: COMPANY.email,
  },
];
