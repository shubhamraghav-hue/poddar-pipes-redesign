import type { Plumber } from "@/types";

// NOTE: seed/sample directory data for the "Find My Plumber" launch — these
// are placeholder listings (fictional names/numbers), not a verified partner
// network yet. Swap for the real installer/partner directory feed once one
// exists; keep the shape (name, phone, pincode) stable for that migration.
export const plumbers: Plumber[] = [
  { id: "p01", name: "Ramesh Kumar", phone: "+91 98450 11223", pincode: "560001" },
  { id: "p02", name: "Suresh Plumbing Works", phone: "+91 98450 22334", pincode: "560001" },
  { id: "p03", name: "Manjunath H.", phone: "+91 98450 33445", pincode: "560008" },
  { id: "p04", name: "Indira Nagar Pipe Care", phone: "+91 98450 44556", pincode: "560008" },
  { id: "p05", name: "Venkatesh Raju", phone: "+91 98450 55667", pincode: "560008" },
  { id: "p06", name: "Koramangala Fix-It Plumbers", phone: "+91 98450 66778", pincode: "560034" },
  { id: "p07", name: "Anil Shetty", phone: "+91 98450 77889", pincode: "560034" },
  { id: "p08", name: "BTM Layout Sanitary Services", phone: "+91 98450 88990", pincode: "560068" },
  { id: "p09", name: "Prakash Naik", phone: "+91 98450 99001", pincode: "560068" },
  { id: "p10", name: "Whitefield Water Solutions", phone: "+91 98450 10112", pincode: "560066" },
  { id: "p11", name: "Deepak Poojary", phone: "+91 98450 21223", pincode: "560066" },
  { id: "p12", name: "Electronic City Plumbing Hub", phone: "+91 98450 32334", pincode: "560100" },
  { id: "p13", name: "Ravi Chandran", phone: "+91 98450 43445", pincode: "560100" },
  { id: "p14", name: "Jayanagar Pipeline Experts", phone: "+91 98450 54556", pincode: "560011" },
  { id: "p15", name: "Mahesh Achar", phone: "+91 98450 65667", pincode: "560011" },
  { id: "p16", name: "Malleswaram Tap & Pipe Service", phone: "+91 98450 76778", pincode: "560003" },
  { id: "p17", name: "Girish Rao", phone: "+91 98450 87889", pincode: "560003" },
];

export function getUniquePincodes(): string[] {
  return Array.from(new Set(plumbers.map((p) => p.pincode))).sort();
}

export function findPlumbersByPincode(pincode: string): Plumber[] {
  return plumbers.filter((p) => p.pincode === pincode.trim());
}
