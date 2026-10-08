/**
 * Material estimator — tab definitions, item taxonomy and per-fixture rates.
 *
 * THE MODEL IS DELIBERATELY TRIVIAL, and that is not a simplification on our
 * part. The reference implementation this design is drawn from
 * (ashirvad.com/plumbing-calculator) computes server-side, and probing it with
 * two input sets shows a strictly linear per-fixture lookup:
 *
 *     1 bathroom + 1 kitchen  -> CPVC 741.68,   bathroom column 33,327.86
 *     2 bathrooms + 1 kitchen -> CPVC 1,483.35, bathroom column 66,655.72
 *
 * i.e. exactly 2x, with the kitchen column unchanged. No tiering, no minimum
 * order, no diminishing return. So `cost(item, column) = count * rate` and the
 * totals are plain sums — which is all `estimate()` below does.
 *
 * ---------------------------------------------------------------------------
 * THE RATES BELOW ARE PLACEHOLDERS. REPLACE THEM BEFORE THIS GOES LIVE.
 * ---------------------------------------------------------------------------
 * They are round illustrative numbers, chosen so the tool demonstrably works
 * and so nobody can mistake them for a real price list. They are NOT Poddar
 * MRPs, and they are NOT lifted from the reference site — deliberately. That
 * site's line items are its own SKUs (Aqualife, Aqualife Reclaim, Concealed
 * Diverters, Flush Valves) for products Poddar does not make, so its numbers
 * would be both the wrong catalogue and someone else's commercial data. The
 * Figma mock already genericises the rows to Poddar's own CPVC/uPVC families,
 * which is what this file follows.
 *
 * To go live: fill in `rate` for every row from the Poddar price list. Nothing
 * else needs editing — the engine, the UI and the totals all read from here.
 */

/**
 * CLIENT DECISION (2026-10-08): prices/MRPs are NOT published on the site yet.
 * With this off the estimator still takes every input and still works out
 * which materials the job needs, but shows them as a MATERIAL LIST with no ₹
 * figures, and hands the list to the sales team for a quote. The placeholder
 * rates below are then only used to decide which rows apply (rate > 0).
 *
 * To publish prices: fill in the real rates, then set this to `true` — the
 * original cost table/cards come back unchanged.
 */
export const SHOW_PRICES = false;

export type PipeType = "cpvc" | "upvc" | "combination";

export type EstimatorItem = {
  id: string;
  label: string;
  /** Which pipe-type selections this row appears under. */
  families: PipeType[];
  /** Per-unit rate per input column, keyed by column id. 0 = not supplied. */
  rate: Record<string, number>;
};

export type StepperInput = {
  kind: "stepper";
  id: string;
  label: string;
  min: number;
  max: number;
  /** A stepper that declares a column contributes one column to the table. */
  column?: { id: string; label: string };
};

export type ChoiceInput = {
  kind: "choice";
  id: string;
  label: string;
  options: { value: PipeType; label: string }[];
};

export type EstimatorInput = StepperInput | ChoiceInput;

export type EstimatorTab = {
  id: string;
  /** Tab pill label. */
  label: string;
  /** Panel heading, e.g. "Home Plumbing Estimator". */
  title: string;
  inputs: EstimatorInput[];
  items: EstimatorItem[];
  /** Shown under the table, as the reference tool does. */
  assumptions: string[];
  /**
   * False for the three tabs Figma does not specify. Their inputs, columns and
   * row lists are INFERRED from the trade and are the first thing to check with
   * the designer — the shell and the engine are identical either way.
   */
  fromDesign: boolean;
};

const PIPE_CHOICE: ChoiceInput = {
  kind: "choice",
  id: "pipeType",
  label: "Select Internal Plumbing",
  options: [
    { value: "cpvc", label: "CPVC" },
    { value: "upvc", label: "uPVC" },
    { value: "combination", label: "Combination" },
  ],
};

const ALL: PipeType[] = ["cpvc", "upvc", "combination"];
const CPVC_ONLY: PipeType[] = ["cpvc", "combination"];
const UPVC_ONLY: PipeType[] = ["upvc", "combination"];

const INDICATIVE = [
  "The above estimation is for a typical bathroom and kitchen.",
  "The above estimates are at MRP value and are only indicative.",
];

export const ESTIMATOR_TABS: EstimatorTab[] = [
  {
    id: "home-plumbing",
    label: "Home Plumbing",
    title: "Home Plumbing Estimator",
    fromDesign: true,
    inputs: [
      {
        kind: "stepper",
        id: "bathrooms",
        label: "Number of Bathrooms",
        min: 0,
        max: 20,
        column: { id: "bathroom", label: "Bathroom" },
      },
      {
        kind: "stepper",
        id: "kitchens",
        label: "Number of Kitchens",
        min: 0,
        max: 20,
        column: { id: "kitchen", label: "Kitchen" },
      },
      PIPE_CHOICE,
    ],
    items: [
      { id: "cpvc", label: "CPVC", families: CPVC_ONLY, rate: { bathroom: 750, kitchen: 0 } },
      { id: "cpvc-brass", label: "CPVC Brass Fittings", families: CPVC_ONLY, rate: { bathroom: 360, kitchen: 0 } },
      { id: "cpvc-fittings", label: "CPVC Fittings", families: CPVC_ONLY, rate: { bathroom: 310, kitchen: 25 } },
      { id: "cpvc-cement", label: "CPVC Solvent Cement", families: CPVC_ONLY, rate: { bathroom: 220, kitchen: 0 } },
      { id: "upvc", label: "uPVC", families: UPVC_ONLY, rate: { bathroom: 1980, kitchen: 150 } },
      { id: "upvc-brass", label: "uPVC Brass Fittings", families: UPVC_ONLY, rate: { bathroom: 1740, kitchen: 250 } },
      { id: "upvc-fittings", label: "uPVC Fittings", families: UPVC_ONLY, rate: { bathroom: 540, kitchen: 105 } },
      { id: "upvc-cement", label: "uPVC Solvent Cement", families: UPVC_ONLY, rate: { bathroom: 260, kitchen: 0 } },
    ],
    assumptions: INDICATIVE,
  },
  {
    id: "drainage-swr",
    label: "Drainage (SWR)",
    title: "Drainage Estimator",
    fromDesign: false,
    inputs: [
      { kind: "stepper", id: "floors", label: "Number of Floors", min: 0, max: 30, column: { id: "floor", label: "Per Floor" } },
      {
        kind: "stepper",
        id: "bathrooms",
        label: "Bathrooms Per Floor",
        min: 0,
        max: 20,
        column: { id: "bathroom", label: "Bathroom" },
      },
    ],
    items: [
      { id: "swr-pipe", label: "SWR Pipe", families: ALL, rate: { floor: 1450, bathroom: 620 } },
      { id: "swr-fittings", label: "SWR Fittings", families: ALL, rate: { floor: 880, bathroom: 410 } },
      { id: "swr-traps", label: "Traps & Gratings", families: ALL, rate: { floor: 0, bathroom: 290 } },
      { id: "swr-clamps", label: "Clamps & Brackets", families: ALL, rate: { floor: 240, bathroom: 60 } },
      { id: "swr-lubricant", label: "Rubber Lubricant", families: ALL, rate: { floor: 90, bathroom: 0 } },
    ],
    assumptions: INDICATIVE,
  },
  {
    id: "underground-drainage",
    label: "Underground Drainage",
    title: "Underground Drainage Estimator",
    fromDesign: false,
    inputs: [
      { kind: "stepper", id: "runMetres", label: "Trench Run (metres)", min: 0, max: 500, column: { id: "run", label: "Per Metre" } },
      { kind: "stepper", id: "chambers", label: "Inspection Chambers", min: 0, max: 50, column: { id: "chamber", label: "Chamber" } },
    ],
    items: [
      { id: "ugd-pipe", label: "UGD Pipe", families: ALL, rate: { run: 410, chamber: 0 } },
      { id: "ugd-fittings", label: "UGD Fittings", families: ALL, rate: { run: 120, chamber: 580 } },
      { id: "ugd-chamber", label: "Inspection Chambers", families: ALL, rate: { run: 0, chamber: 2400 } },
      { id: "ugd-cover", label: "Covers & Frames", families: ALL, rate: { run: 0, chamber: 1150 } },
      { id: "ugd-lubricant", label: "Rubber Lubricant", families: ALL, rate: { run: 15, chamber: 0 } },
    ],
    assumptions: INDICATIVE,
  },
  {
    id: "agriculture",
    label: "Agriculture & Irrigation",
    title: "Agriculture & Irrigation Estimator",
    fromDesign: false,
    inputs: [
      { kind: "stepper", id: "acres", label: "Area (acres)", min: 0, max: 200, column: { id: "acre", label: "Per Acre" } },
      { kind: "stepper", id: "outlets", label: "Number of Outlets", min: 0, max: 200, column: { id: "outlet", label: "Outlet" } },
    ],
    items: [
      { id: "agri-main", label: "Agri Pressure Pipe", families: ALL, rate: { acre: 8600, outlet: 0 } },
      { id: "agri-fittings", label: "Agri Fittings", families: ALL, rate: { acre: 1950, outlet: 180 } },
      { id: "agri-drip", label: "Drip Lateral", families: ALL, rate: { acre: 5400, outlet: 0 } },
      { id: "agri-emitters", label: "Emitters & Connectors", families: ALL, rate: { acre: 0, outlet: 95 } },
      { id: "agri-valves", label: "Control Valves", families: ALL, rate: { acre: 0, outlet: 640 } },
    ],
    assumptions: INDICATIVE,
  },
];

export type EstimateRow = { id: string; label: string; cells: number[]; total: number };
export type EstimateResult = {
  columns: { id: string; label: string }[];
  rows: EstimateRow[];
  columnTotals: number[];
  grandTotal: number;
};

/** The columns a tab contributes to the table — every stepper that declares one. */
export function tabColumns(tab: EstimatorTab) {
  return tab.inputs
    .filter((i): i is StepperInput => i.kind === "stepper" && !!i.column)
    .map((i) => i.column!);
}

/**
 * `count * rate`, summed. See the note at the top of this file for why there is
 * nothing more to it — the reference tool measures as strictly linear.
 */
export function estimate(
  tab: EstimatorTab,
  counts: Record<string, number>,
  pipeType: PipeType
): EstimateResult {
  const steppers = tab.inputs.filter(
    (i): i is StepperInput => i.kind === "stepper" && !!i.column
  );
  const columns = steppers.map((s) => s.column!);
  const hasChoice = tab.inputs.some((i) => i.kind === "choice");

  const rows: EstimateRow[] = tab.items
    .filter((item) => !hasChoice || item.families.includes(pipeType))
    .map((item) => {
      const cells = steppers.map(
        (s) => (counts[s.id] ?? 0) * (item.rate[s.column!.id] ?? 0)
      );
      return {
        id: item.id,
        label: item.label,
        cells,
        total: cells.reduce((a, b) => a + b, 0),
      };
    });

  const columnTotals = columns.map((_, i) =>
    rows.reduce((sum, r) => sum + r.cells[i], 0)
  );

  return {
    columns,
    rows,
    columnTotals,
    grandTotal: columnTotals.reduce((a, b) => a + b, 0),
  };
}

/** Indian digit grouping, two decimals — the format the mock shows (1,89,999.11). */
export function formatINR(value: number): string {
  if (!value) return "-";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
