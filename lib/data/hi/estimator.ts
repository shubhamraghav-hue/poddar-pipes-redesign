import { ESTIMATOR_TABS, type EstimatorInput, type EstimatorTab } from "@/lib/data/estimator";
import type { Overlay } from "@/lib/i18n/localize";

/**
 * Hindi overlay for lib/data/estimator.ts (merged with `localizeList` on the
 * tab id). Only visitor-facing LABELS are translated here; ids, option values,
 * min/max and rates are copied from the English file, so the engine and any
 * future rate change stay in one place. Arrays (inputs, items, assumptions)
 * replace the English ones wholesale, which is why they are rebuilt from it.
 */

const TABS: Record<string, { label: string; title: string }> = {
  "home-plumbing": { label: "घरेलू प्लंबिंग", title: "घरेलू प्लंबिंग अनुमानक" },
  "drainage-swr": { label: "जल निकासी (SWR)", title: "जल निकासी अनुमानक" },
  "underground-drainage": { label: "भूमिगत जल निकासी", title: "भूमिगत जल निकासी अनुमानक" },
  agriculture: { label: "कृषि और सिंचाई", title: "कृषि और सिंचाई अनुमानक" },
};

/** Keyed `${tabId}:${inputId}` — "bathrooms" means different things per tab. */
const INPUTS: Record<string, string> = {
  "home-plumbing:bathrooms": "बाथरूम की संख्या",
  "home-plumbing:kitchens": "किचन की संख्या",
  "home-plumbing:pipeType": "आंतरिक प्लंबिंग चुनें",
  "drainage-swr:floors": "मंज़िलों की संख्या",
  "drainage-swr:bathrooms": "प्रति मंज़िल बाथरूम",
  "underground-drainage:runMetres": "ट्रेंच की लंबाई (मीटर)",
  "underground-drainage:chambers": "इंस्पेक्शन चैंबर",
  "agriculture:acres": "क्षेत्रफल (एकड़)",
  "agriculture:outlets": "आउटलेट की संख्या",
};

/** Table column labels, keyed by column id. */
const COLUMNS: Record<string, string> = {
  bathroom: "बाथरूम",
  kitchen: "किचन",
  floor: "प्रति मंज़िल",
  run: "प्रति मीटर",
  chamber: "चैंबर",
  acre: "प्रति एकड़",
  outlet: "आउटलेट",
};

/** Pipe-type choice labels, keyed by option value. */
const OPTIONS: Record<string, string> = {
  cpvc: "CPVC",
  upvc: "uPVC",
  combination: "संयोजन",
};

/** Line items, keyed by item id. */
const ITEMS: Record<string, string> = {
  cpvc: "CPVC",
  "cpvc-brass": "CPVC ब्रास फिटिंग्स",
  "cpvc-fittings": "CPVC फिटिंग्स",
  "cpvc-cement": "CPVC सॉल्वेंट सीमेंट",
  upvc: "uPVC",
  "upvc-brass": "uPVC ब्रास फिटिंग्स",
  "upvc-fittings": "uPVC फिटिंग्स",
  "upvc-cement": "uPVC सॉल्वेंट सीमेंट",
  "swr-pipe": "SWR पाइप",
  "swr-fittings": "SWR फिटिंग्स",
  "swr-traps": "ट्रैप्स और ग्रेटिंग्स",
  "swr-clamps": "क्लैम्प्स और ब्रैकेट्स",
  "swr-lubricant": "रबर लुब्रिकेंट",
  "ugd-pipe": "UGD पाइप",
  "ugd-fittings": "UGD फिटिंग्स",
  "ugd-chamber": "इंस्पेक्शन चैंबर",
  "ugd-cover": "कवर और फ्रेम",
  "ugd-lubricant": "रबर लुब्रिकेंट",
  "agri-main": "Agri प्रेशर पाइप",
  "agri-fittings": "Agri फिटिंग्स",
  "agri-drip": "ड्रिप लेटरल",
  "agri-emitters": "एमिटर और कनेक्टर",
  "agri-valves": "कंट्रोल वाल्व",
};

/**
 * Same order as the English `INDICATIVE`. The second keeps "MRP" in Latin
 * script — the material list drops assumptions matching /\bMRP\b/ while
 * prices are unpublished, in either language.
 */
const ASSUMPTIONS: Record<string, string> = {
  "The above estimation is for a typical bathroom and kitchen.":
    "उपरोक्त अनुमान एक सामान्य बाथरूम और किचन के लिए है।",
  "The above estimates are at MRP value and are only indicative.":
    "उपरोक्त अनुमान MRP मूल्य पर हैं और केवल सांकेतिक हैं।",
};

function input(tabId: string, i: EstimatorInput): EstimatorInput {
  const label = INPUTS[`${tabId}:${i.id}`] ?? i.label;
  if (i.kind === "choice") {
    return {
      ...i,
      label,
      options: i.options.map((o) => ({ ...o, label: OPTIONS[o.value] ?? o.label })),
    };
  }
  return {
    ...i,
    label,
    column: i.column && { ...i.column, label: COLUMNS[i.column.id] ?? i.column.label },
  };
}

export const ESTIMATOR_TABS_HI: Overlay<EstimatorTab> = Object.fromEntries(
  ESTIMATOR_TABS.map((tab) => [
    tab.id,
    {
      ...TABS[tab.id],
      inputs: tab.inputs.map((i) => input(tab.id, i)),
      items: tab.items.map((it) => ({ ...it, label: ITEMS[it.id] ?? it.label })),
      assumptions: tab.assumptions.map((a) => ASSUMPTIONS[a] ?? a),
    } satisfies Partial<EstimatorTab>,
  ])
);
