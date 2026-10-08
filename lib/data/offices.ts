import type { Office } from "@/types";

// CLIENT-APPROVED SOURCE OF TRUTH (2026-10-08). Every contact detail on the
// site — footer, /contact, legal pages, enquiry screens, 404, JSON-LD — reads
// from here. Change them here, not in the components.
export const COMPANY = {
  legalName: "Poddar Plumbing System Pvt. Ltd.",
  email: "hello@poddarpipes.com",
  phone: { display: "+91 98888 22333", href: "tel:+919888822333" },
  /** Registered office, in the client's own wording. */
  address: {
    street: "#1202, 100 Ft Road, HAL 2nd Stage, Domlur, Indiranagar",
    city: "Bengaluru",
    postalCode: "560008",
    region: "Karnataka",
    country: "India",
    oneLine:
      "#1202, 100 Ft Road, HAL 2nd Stage, Domlur, Indiranagar, Bengaluru - 560008, Karnataka, India",
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
  },
  /** Careers: no openings are listed; interested people write here. */
  hrEmail: "kusuma.kt@poddarpipes.com",
} as const;

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
