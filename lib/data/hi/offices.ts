/**
 * Hindi overlay for the two postal addresses in lib/data/offices.ts (client
 * feedback 2026-10-22: "The address should be in Hindi"). Read through
 * `getAddress` / `getPlant` / `getAddressLines` there, never directly.
 *
 * Display only. Numerals stay as digits and the line breaks match the English
 * `lines`. The Organization JSON-LD keeps the English `COMPANY.address` — the
 * schema is not localised.
 */
export const companyAddressHi = {
  address: {
    street: "#1202, एचएएल 2nd स्टेज डोमलूर, 100 फीट रोड, इंदिरानगर",
    oneLine: "#1202, एचएएल 2nd स्टेज डोमलूर, 100 फीट रोड, इंदिरानगर, बेंगलुरु, कर्नाटक - 560008, भारत",
    lines: ["#1202, एचएएल 2nd स्टेज डोमलूर, 100 फीट रोड,", "इंदिरानगर, बेंगलुरु, कर्नाटक - 560008, भारत"],
  },
  plant: {
    street: "प्लॉट नंबर 96 और 97, वेमगल, 2nd फेज़, KIADB औद्योगिक क्षेत्र",
    oneLine: "प्लॉट नंबर 96 और 97, वेमगल, 2nd फेज़, KIADB औद्योगिक क्षेत्र, कोलार ज़िला, कर्नाटक - 563157, भारत",
    lines: ["प्लॉट नंबर 96 और 97, वेमगल, 2nd फेज़, KIADB औद्योगिक क्षेत्र,", "कोलार ज़िला, कर्नाटक - 563157, भारत"],
  },
} as const;
