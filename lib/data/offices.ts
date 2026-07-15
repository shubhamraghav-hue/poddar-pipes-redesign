import type { Office } from "@/types";

// NOTE: HQ address, city, and email are verified from Poddar Pipes' own
// product catalogues (CIN: 29AAECO2313F1ZQ). Regional office placeholders
// still need phone numbers and verified locations before publishing.
export const offices: Office[] = [
  {
    id: "hq",
    city: "Bengaluru",
    country: "India",
    type: "Registered & Corporate Office",
    address: "4th Floor, 1202, HAL 2nd Stage, Domlur, 100 Feet Road, Indiranagar, Bengaluru, Karnataka – 560008",
    phone: "+91 [XXXXX XXXXX]",
    email: "poddarpipes@gmail.com",
  },
  {
    id: "north",
    city: "[North India Regional Office City]",
    country: "India",
    type: "North India Regional Office",
    address: "[Street Address], [City] – [PIN Code]",
    phone: "+91 [XXXXX XXXXX]",
    email: "north@poddarpipes.com",
  },
  {
    id: "west",
    city: "[West India Regional Office City]",
    country: "India",
    type: "West India Regional Office",
    address: "[Street Address], [City] – [PIN Code]",
    phone: "+91 [XXXXX XXXXX]",
    email: "west@poddarpipes.com",
  },
  {
    id: "south",
    city: "[South India Regional Office City]",
    country: "India",
    type: "South India Regional Office",
    address: "[Street Address], [City] – [PIN Code]",
    phone: "+91 [XXXXX XXXXX]",
    email: "south@poddarpipes.com",
  },
];
