import type { Certification } from "@/types";

// NOTE: These reference the industry-standard certifications applicable to
// uPVC/CPVC/SWR/UGD/tank manufacturing in India. Replace with your facility's
// actual certificate numbers and issuing bodies before publishing.
export const certifications: Certification[] = [
  {
    id: "c1",
    code: "ASTM D1785 / D2466 / D2467",
    name: "uPVC Gold Plumbing Pipes",
    description: "Schedule 40 / Schedule 80 pipe and fitting standard for lead-free uPVC solvent-weld plumbing.",
  },
  {
    id: "c2",
    code: "ISI Mark — IS 13592 / IS 14735",
    name: "SWR Drainage Pipes & Fittings",
    description: "BIS certification covering soil, waste, and rainwater drainage pipes (IS 13592) and fittings (IS 14735).",
  },
  {
    id: "c3",
    code: "IS 16098 (Part 1) / EN 1401-1",
    name: "UGD Underground Drainage Pipes",
    description: "Foam-core underground drainage pipe standard, with ring stiffness classes SN2, SN4, and SN8.",
  },
  {
    id: "c4",
    code: "ISO 9001",
    name: "Quality Management System",
    description: "Certified quality management practices across manufacturing operations.",
  },
  {
    id: "c5",
    code: "ISO 14001",
    name: "Environmental Management System",
    description: "Independently audited environmental management practices at manufacturing facilities.",
  },
  {
    id: "c6",
    code: "IS 15778",
    name: "CPVC Pipes for Hot & Cold Water",
    description: "Standard compliance for chlorinated PVC pipes used in plumbing applications.",
  },
  {
    id: "c7",
    code: "ISO 21702:2019 / ASTM G-29 / G21-2015",
    name: "Anti-Viral, Anti-Algae & Anti-Fungal Tanks",
    description: "Compliance testing for the Nano-Silver antibacterial layer used across the water storage tank range.",
  },
  {
    id: "c8",
    code: "ISI Mark — IS 4985 / IS 7834",
    name: "Agri Gold Pressure Pipes & Fittings",
    description: "BIS certification for lead-free uPVC agricultural water supply pipes (IS 4985) and fittings (IS 7834).",
  },
];
