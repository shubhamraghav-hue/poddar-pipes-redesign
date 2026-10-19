/**
 * Hindi DISPLAY labels for the partner form's dropdowns (lib/forms/shared.ts).
 *
 * Display only: the option VALUES posted to /api/enquiry (and validated there
 * with `oneOf`) stay the English strings, and the sales sheet keeps reading
 * English. Keyed by that English value; anything missing shows the English.
 */
export const PARTNER_OPTION_LABELS_HI: Record<string, string> = {
  // PARTNER_COUNTRIES
  India: "भारत",
  Nepal: "नेपाल",
  Bhutan: "भूटान",
  Bangladesh: "बांग्लादेश",
  "Sri Lanka": "श्रीलंका",
  "United Arab Emirates": "संयुक्त अरब अमीरात",
  Other: "अन्य",

  // PARTNER_BUSINESS_TYPES ("Other" above)
  "Wholesaler / Distributor": "थोक विक्रेता / वितरक",
  "Retail Store Owner": "रिटेल स्टोर मालिक",
  "E-commerce Reseller": "ई-कॉमर्स रीसेलर",
  "Importer / Exporter": "आयातक / निर्यातक",

  // PARTNER_YEARS
  "Under 1 year": "1 वर्ष से कम",
  "1–3 years": "1–3 वर्ष",
  "3–5 years": "3–5 वर्ष",
  "5+ years": "5+ वर्ष",

  // INDIAN_STATES
  "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीपसमूह",
  "Andhra Pradesh": "आंध्र प्रदेश",
  "Arunachal Pradesh": "अरुणाचल प्रदेश",
  Assam: "असम",
  Bihar: "बिहार",
  Chandigarh: "चंडीगढ़",
  Chhattisgarh: "छत्तीसगढ़",
  "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली और दमन और दीव",
  Delhi: "दिल्ली",
  Goa: "गोवा",
  Gujarat: "गुजरात",
  Haryana: "हरियाणा",
  "Himachal Pradesh": "हिमाचल प्रदेश",
  "Jammu and Kashmir": "जम्मू और कश्मीर",
  Jharkhand: "झारखंड",
  Karnataka: "कर्नाटक",
  Kerala: "केरल",
  Ladakh: "लद्दाख",
  Lakshadweep: "लक्षद्वीप",
  "Madhya Pradesh": "मध्य प्रदेश",
  Maharashtra: "महाराष्ट्र",
  Manipur: "मणिपुर",
  Meghalaya: "मेघालय",
  Mizoram: "मिज़ोरम",
  Nagaland: "नागालैंड",
  Odisha: "ओडिशा",
  Puducherry: "पुडुचेरी",
  Punjab: "पंजाब",
  Rajasthan: "राजस्थान",
  Sikkim: "सिक्किम",
  "Tamil Nadu": "तमिलनाडु",
  Telangana: "तेलंगाना",
  Tripura: "त्रिपुरा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  Uttarakhand: "उत्तराखंड",
  "West Bengal": "पश्चिम बंगाल",
};
