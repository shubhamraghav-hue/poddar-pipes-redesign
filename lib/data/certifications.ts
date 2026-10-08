import type { Certification } from "@/types";

// The standards each product line is DESIGNED to — not certifications. Per the
// client (Oct 2026), the company currently holds no certifications (no ISI/BIS
// licence, no ISO 9001/14001, no third-party test certificates), so copy here
// must stay as design intent ("designed to", "manufactured to ... specifications")
// and never say certified / compliant / marked / approved. The ISO 9001 and
// ISO 14001 entries (c4, c5) were removed for that reason; ids are kept stable
// because /quality maps each id to its `quality.cert{n}` message key.
export const certifications: Certification[] = [
  {
    id: "c1",
    code: "ASTM D1785 / D2466 / D2467",
    name: "uPVC Gold Plumbing Pipes",
    description: "Designed to the Schedule 40 / Schedule 80 pipe and fitting specifications for lead-free uPVC solvent-weld plumbing.",
  },
  {
    id: "c2",
    code: "IS 13592 / IS 14735",
    name: "SWR Drainage Pipes & Fittings",
    description: "Soil, waste, and rainwater drainage pipes designed to IS 13592, with fittings designed to IS 14735.",
  },
  {
    id: "c3",
    code: "IS 16098 (Part 1) / EN 1401-1",
    name: "UGD Underground Drainage Pipes",
    description: "Foam-core underground drainage pipe designed to these specifications, in ring stiffness classes SN2, SN4, and SN8.",
  },
  {
    id: "c6",
    code: "IS 15778",
    name: "CPVC Pipes for Hot & Cold Water",
    description: "Chlorinated PVC plumbing pipes manufactured to IS 15778 specifications.",
  },
  {
    id: "c7",
    code: "ISO 21702:2019 / ASTM G-29 / G21-2015",
    name: "Anti-Viral, Anti-Algae & Anti-Fungal Tanks",
    description: "Test-method standards the Nano-Silver antibacterial layer in our water storage tanks is designed against.",
  },
  {
    id: "c8",
    code: "IS 4985 / IS 7834",
    name: "Agri Gold Pressure Pipes & Fittings",
    description: "Lead-free uPVC agricultural water supply pipes designed to IS 4985, with fittings designed to IS 7834.",
  },
];
