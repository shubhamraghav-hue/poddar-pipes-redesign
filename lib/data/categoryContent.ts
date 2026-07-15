import type { Product } from "@/types";

/**
 * Category-level landing content for the six product categories.
 *
 * Copy here is ORIGINAL, written from Poddar's own verified product data
 * (see lib/data/products.ts) and humanised for SEO — it is not lifted from any
 * competitor. Category structure and keyword themes were informed by
 * competitive research, but every spec and claim traces back to Poddar's
 * catalogues. These pages are rendered noindex until the site goes to
 * production (see the route's generateMetadata).
 */
export interface CategoryContent {
  /** Matches Product["category"] and is used as the route param. */
  category: Exclude<Product["category"], never>;
  label: string;
  /** Page H1. */
  h1: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Overview paragraphs (2). */
  intro: string[];
  /** "Why it works" points — category-level, drawn from the product specs. */
  highlights: { title: string; description: string }[];
  applications: string[];
  faqs: { question: string; answer: string }[];
}

export const categoryContent: CategoryContent[] = [
  {
    category: "upvc-pipes",
    label: "uPVC",
    h1: "uPVC Plumbing Pipes for Cold Water & Beyond",
    tagline: "Lead-free Schedule 40/80 systems that outlast metal — and cost a fraction to install.",
    metaTitle: "uPVC Plumbing Pipes in India — Lead-Free Cold Water Systems | Poddar Pipes",
    metaDescription:
      "Poddar uPVC Gold plumbing pipes: 100% lead-free, ASTM D1785 Schedule 40 & 80, sizes 15–150mm. Corrosion-free, leak-free cold water plumbing for homes, hotels and industry.",
    keywords: [
      "uPVC pipes for cold water",
      "uPVC plumbing pipes India",
      "lead-free uPVC pipes",
      "uPVC pipe sizes",
      "Schedule 40 uPVC pipe",
      "leak-free uPVC plumbing",
      "corrosion-free water pipes",
    ],
    intro: [
      "If you have ever replaced a rusted metal riser, you already know why uPVC won India's plumbing over. Poddar uPVC Gold pipes are extruded from a 100% lead-free compound, so the water that reaches your tap stays as clean as the water that left the tank — no rust, no scale, no metallic taste. It is a system built to be forgotten about, quietly working behind the wall for decades.",
      "Available in ASTM D1785 Schedule 40 and Schedule 80 wall thicknesses from 15mm to 150mm, the range carries roughly twice the pressure of threaded metal pipe while costing 50–60% less to install. A one-step solvent-cement joint and a self-alignment system — outlet fittings line up to the pipe's blue stripe — mean faster fit-outs and fewer callbacks on site.",
    ],
    highlights: [
      { title: "100% lead-free", description: "Extruded from a lead-free virgin uPVC compound — a preferred choice for potable water worldwide." },
      { title: "Twice the pressure of metal", description: "Higher pressure-bearing capacity than threaded metal pipe, with zero corrosion over its service life." },
      { title: "One-step jointing", description: "No separate primer needed — a single solvent cement coat sets a reliable joint in seconds." },
      { title: "Self-alignment system", description: "Fitting marks match the pipe's blue stripe, keeping concealed outlets square to the wall." },
    ],
    applications: [
      "Cold water plumbing in homes, hotels & hospitals",
      "Swimming pool circulation lines",
      "Salt-water and coastal installations",
      "Industrial process & semi-aggressive fluid lines",
    ],
    faqs: [
      { question: "Is uPVC pipe safe for drinking water?", answer: "Yes. Poddar uPVC Gold is manufactured from a lead-free compound, making it a favoured system for potable water supply worldwide." },
      { question: "How does uPVC compare to metal pipe on cost?", answer: "uPVC typically saves 50–60% versus metal pipework once faster installation and zero corrosion maintenance are factored in." },
    ],
  },
  {
    category: "cpvc-pipes",
    label: "CPVC",
    h1: "CPVC Pipes for Hot & Cold Water Plumbing",
    tagline: "Rated for continuous 82°C service — the hot-water backbone for villas, hotels and hospitals.",
    metaTitle: "CPVC Pipes for Hot Water Plumbing — BIS Certified | Poddar Pipes",
    metaDescription:
      "Poddar CPVC Gold pipes handle hot & cold water up to 82°C continuous (93°C short-term). IS 15778 / ASTM D2846, fire-retardant (LOI 60), NSF-certified jointing. Sizes 15–150mm.",
    keywords: [
      "CPVC pipes for hot water",
      "CPVC plumbing systems",
      "BIS certified CPVC pipes",
      "CPVC vs uPVC",
      "temperature-resistant plumbing pipes",
      "CPVC pipe sizes",
      "solar water heater pipes",
    ],
    intro: [
      "Hot water is where cheaper pipe gives up. Poddar CPVC Gold is engineered for the full temperature range of a modern home — chilled supply one moment, geyser or solar-heated water the next — holding pressure and flow at up to 82°C continuous and 93°C for short surges. It is the quiet reason a hotel's hot line still runs true years after handover.",
      "Made to IS 15778:2007 and ASTM D2846/F441 across 15mm to 150mm, CPVC Gold is fire-retardant (Limiting Oxygen Index of 60, so it self-extinguishes) and among the lowest for bacterial growth of any plumbing material. Its low thermal conductivity keeps heat in the water, not lost to the wall, and NSF/ANSI 61 certified solvent cement keeps the whole system drinking-water safe.",
    ],
    highlights: [
      { title: "82°C continuous rating", description: "Reliable pressure and flow for hot and cold lines, with 93°C short-term tolerance." },
      { title: "Fire-retardant (LOI 60)", description: "Self-extinguishing construction — it will not sustain a flame on its own." },
      { title: "Hygienic by design", description: "Lowest bacterial growth of common plumbing materials; no scaling, pitting or leaching." },
      { title: "Heat stays in the water", description: "Low thermal conductivity (0.14 W/mK) minimises heat loss from hot-water runs." },
    ],
    applications: [
      "Hot & cold water plumbing in homes and apartments",
      "Hospital & hotel water systems",
      "Solar water heater & geyser connections",
      "Concealed and exposed potable water lines",
    ],
    faqs: [
      { question: "What is the difference between CPVC and uPVC?", answer: "uPVC is built for cold water; CPVC is chlorinated to withstand hot water — rated to 82°C continuous — making it the right choice for geyser, solar and hot-supply lines." },
      { question: "Is Poddar CPVC Gold UV protected?", answer: "Yes, built-in UV protection is standard. For rooftop runs in intense sunlight, Poddar recommends covering the pipe or applying a water-based latex paint." },
    ],
  },
  {
    category: "swr-pipes",
    label: "SWR",
    h1: "SWR Drainage Pipes — Soil, Waste & Rainwater",
    tagline: "Low-noise, leak-proof drainage with self-aligning Pushfit and Solfit jointing.",
    metaTitle: "SWR Drainage Pipes — Soil & Waste Systems (IS 13592) | Poddar Pipes",
    metaDescription:
      "Poddar SWR Gold soil, waste & rainwater pipes to IS 13592:2013. Low-noise smooth bore, leak-proof Pushfit (O-ring) & Solfit joints, fire-retardant, sizes 40–315mm.",
    keywords: [
      "SWR drainage pipes",
      "soil and waste pipes",
      "SWR pipe fittings",
      "low-noise drainage pipe",
      "rainwater downpipe",
      "IS 13592 SWR pipe",
      "leak-proof drainage system",
    ],
    intro: [
      "Good drainage is the plumbing nobody notices — until it drips through a ceiling. Poddar SWR Gold moves soil, waste and rainwater through a smooth, low-noise bore that resists choking, so the only sign it is working is that everything simply drains away. Joints stay leak-proof under prolonged service, which is exactly what a concealed bathroom stack needs.",
      "Built to IS 13592:2013 (pipes) and IS 14735:1999 (fittings) from 40mm to 315mm, the range offers a choice of Pushfit O-ring joints or Solfit solvent-cement joints, plus self-alignment marks that keep outlet fittings square before the plaster goes on. UV-stabilised throughout and fire-retardant with a Limiting Oxygen Index of 45, it is equally at home on a rooftop downpipe or an internal waste line.",
    ],
    highlights: [
      { title: "Leak-proof for the long run", description: "Joints stay watertight under prolonged service — designed for concealed stacks you can't easily reach." },
      { title: "Quiet, choke-free flow", description: "Smooth-bore fittings maintain high flow rates and keep drainage noise down." },
      { title: "Pushfit or Solfit", description: "Choose O-ring Pushfit for speed and re-workability, or Solfit solvent cement for a permanent bond." },
      { title: "Fire-retardant & UV-stable", description: "Self-extinguishing (LOI 45) and UV-stabilised for reliable rooftop and outdoor use." },
    ],
    applications: [
      "Soil & waste stacks in buildings",
      "Rainwater downpipes",
      "Building drainage networks",
      "Leak-proof concealed bathroom lines",
    ],
    faqs: [
      { question: "Can I use SWR pipe for pressure water supply?", answer: "No — SWR fittings are designed for gravity, non-pressure drainage. Keep hot and cold water on a dedicated pressure system such as CPVC or uPVC." },
      { question: "How is alignment kept in concealed work?", answer: "Self-alignment marks on the fittings match a printed stripe on the pipe, holding outlets perpendicular to the wall even before plastering." },
    ],
  },
  {
    category: "tanks",
    label: "Water Tanks",
    h1: "Water Storage Tanks — Cleaner Water, Cooler Storage",
    tagline: "Food-grade, antibacterial rotomoulded tanks from 500L to 10,000L, including an insulated 4-layer range.",
    metaTitle: "Water Storage Tanks for Home & Industry — Food-Grade | Poddar Pipes",
    metaDescription:
      "Poddar rotomoulded water storage tanks: food-grade virgin plastic, Nano-Silver antibacterial layer, UV-stabilised. 4-layer insulated, 3-layer and ISI 2-layer, 500L–10,000L.",
    keywords: [
      "water storage tanks",
      "water tank for home",
      "food-grade water tank",
      "plastic water tanks",
      "insulated water tank",
      "ISI water tank",
      "overhead water tank sizes",
    ],
    intro: [
      "A water tank should do more than hold water — it should keep it safe to drink. Every Poddar tank is rotomoulded from 100% virgin, food-grade polyethylene with a Nano-Silver antibacterial inner layer, plus anti-viral, anti-algae and anti-fungal compliance, so stored water stays hygienic through the seasons. The rated capacity is the real capacity, and a dual-layer, insect-proof lid keeps what's inside clean.",
      "Pick the range to match the climate and the job: the insulated 4-Layer tank adds a foam core that holds stored water 13–15°C cooler than a 45°C rooftop; the 3-Layer range scales from 500L homes to 10,000L bulk storage with FEA-engineered ribs; and the ISI-certified 2-Layer tank suits tenders and projects that require certification. Eight colour options let the tank sit quietly on any rooftop.",
    ],
    highlights: [
      { title: "Antibacterial Nano-Silver layer", description: "Keeps stored water hygienic, with anti-viral, anti-algae and anti-fungal compliance to ISO/ASTM standards." },
      { title: "Cooler water in summer", description: "The insulated 4-layer range holds water 13–15°C below a 45°C ambient — noticeably cooler at the tap." },
      { title: "Genuinely food-grade", description: "100% virgin polyethylene inner layer with no heavy metals, suitable for drinking-water storage." },
      { title: "500L to 10,000L", description: "From single-household rooftops to bulk institutional storage, with an ISI-certified option for compliance." },
    ],
    applications: [
      "Residential rooftop water storage",
      "Hot-climate regions needing cooler stored water",
      "Commercial & institutional overhead tanks",
      "Government projects requiring ISI certification",
    ],
    faqs: [
      { question: "How much cooler does the insulated tank keep water?", answer: "The 4-layer foam-insulated tank keeps stored water 13–15°C lower than an ambient temperature of up to 45°C." },
      { question: "Are Poddar tanks food-safe?", answer: "Yes — the inner layer is 100% virgin food-grade polyethylene with a Nano-Silver antibacterial additive, suitable for potable water." },
    ],
  },
  {
    category: "ugd-pipes",
    label: "UGD",
    h1: "Underground Drainage (UGD) Pipes",
    tagline: "Foam-core sewer and storm-water systems with a choice of Pushfit or Solfit jointing.",
    metaTitle: "Underground Drainage Pipes (UGD) — IS 16098 Sewer Systems | Poddar Pipes",
    metaDescription:
      "Poddar UGD Gold underground drainage pipes to IS 16098 (Part 1). Three-layer foam-core, SN2/SN4/SN8 ring stiffness, leak-proof Pushfit (Black Seal) or Solfit joints, 110–315mm.",
    keywords: [
      "underground drainage system",
      "UGD pipes",
      "sewer pipe IS 16098",
      "UGD pipe specifications",
      "SN4 SN8 drainage pipe",
      "storm water drainage pipe",
      "foam core drainage pipe",
    ],
    intro: [
      "Underground drainage has to survive everything above it — traffic loads, soil movement, decades of buried service. Poddar UGD Gold uses a three-layer foam-core wall: solid uPVC skins around a lightweight foamed core, so the pipe gets the ring stiffness a buried sewer needs without the weight that makes handling and transport expensive. The smooth, rigid bore is rodent-proof and keeps flow moving.",
      "Manufactured to IS 16098 (Part 1):2013 with fittings to EN 1401-1:2009, the range spans 110mm to 315mm in SN2, SN4 and SN8 ring-stiffness classes. Choose Pushfit — a pre-fitted rubber Black Seal that joins by simply pushing the spigot home and can be reopened for maintenance — or Solfit, a solvent-welded permanent bond for the most demanding sewage lines.",
    ],
    highlights: [
      { title: "Three-layer foam core", description: "Ring stiffness where it's needed, at a lighter weight that cuts transport and handling cost." },
      { title: "Pushfit or Solfit", description: "Reopenable Black Seal push-fit joints, or a permanent solvent-welded bond for demanding lines." },
      { title: "SN2 / SN4 / SN8", description: "Match stiffness to duty — SN4 for housing lines, SN8 under roads and heavy traffic loading." },
      { title: "Rodent-proof & leak-proof", description: "Smooth rigid uPVC surface resists rodents; joints stay leak-proof under internal pressure." },
    ],
    applications: [
      "Municipal sewage networks",
      "Housing society UGD systems",
      "Storm-water drainage",
      "Rainwater harvesting collection lines",
    ],
    faqs: [
      { question: "Do UGD Pushfit joints need solvent cement?", answer: "No — the pre-fitted Black Seal in the socket groove creates a leak-proof joint simply by pushing the spigot home, and it can be reopened for realignment." },
      { question: "Which ring stiffness should I specify?", answer: "SN2 suits light-duty drainage, SN4 covers most residential and housing-society lines, and SN8 is recommended under roads or heavy traffic loading." },
    ],
  },
  {
    category: "agricultural-pipes",
    label: "Agriculture",
    h1: "Agriculture & Irrigation Pipes",
    tagline: "Lead-free pressure pipes and pressure-compensating drip lines built for Indian field conditions.",
    metaTitle: "Agriculture Irrigation Pipes — IS 4985 Pressure Pipe & Drip | Poddar Pipes",
    metaDescription:
      "Poddar Agri Gold uPVC pressure pipes to IS 4985:2000 (Class 2 & 3), plus Hariyali pressure-compensating drip lines saving up to 40% water. Lead-free, UV-resistant, 40–315mm.",
    keywords: [
      "agricultural irrigation pipes",
      "agri pipes",
      "drip irrigation",
      "IS 4985 pressure pipe",
      "farm water distribution",
      "uPVC agriculture pipe",
      "water-saving irrigation",
    ],
    intro: [
      "Water is a farmer's tightest input, and the pipe that carries it should waste none of it. Poddar Agri Gold is a lead-free uPVC pressure pipe and fittings system that moves clean, potable water across fields and irrigation mains without the corrosion or leaks of metal pipe — lighter to carry, quicker to lay, and safe for the water it delivers.",
      "The pressure range is built to IS 4985:2000 in Class 2 (4 kgf/cm²) and Class 3 (6 kgf/cm²) with fittings to IS 7834, from 40mm to 315mm. Pair it with Hariyali drip lines — pressure-compensating emitters that hold uniform discharge across long, sloping laterals — to cut water use by up to 40% versus flood irrigation while growing a more even crop.",
    ],
    highlights: [
      { title: "Lead-free & potable-safe", description: "A specially formulated lead-free compound keeps conveyed water safe for people and crops alike." },
      { title: "Up to 40% water savings", description: "Hariyali pressure-compensating drip lines deliver uniform discharge and slash water use versus flood irrigation." },
      { title: "IS 4985 pressure classes", description: "Class 2 (4 kgf/cm²) and Class 3 (6 kgf/cm²) pipe with IS 7834 fittings for reliable field mains." },
      { title: "Built for the field", description: "UV-resistant for prolonged outdoor exposure, corrosion-free, and light enough to cut transport cost." },
    ],
    applications: [
      "Agricultural water supply mains",
      "Bulk field & irrigation network distribution",
      "Drip irrigation for row crops, orchards & polyhouses",
      "Farm-level pressurised water networks",
    ],
    faqs: [
      { question: "How much water can drip irrigation save?", answer: "Switching from flood irrigation to Hariyali pressure-compensating drip lines can save up to 40% of water while improving crop uniformity." },
      { question: "Why choose lead-free agriculture pipe?", answer: "A lead-free compound keeps the conveyed water uncontaminated — the safest choice wherever field water may reach people, livestock or produce." },
    ],
  },
];

export function getCategoryContent(category: string) {
  return categoryContent.find((c) => c.category === category);
}
