// Real installation content from Poddar's product catalogues (the 6-step
// solvent-weld process is consistent, near word-for-word, across the Agri
// Gold, uPVC Gold, SWR Gold, UGD Gold, and CPVC Gold manuals).

export interface InstallStep {
  step: number;
  title: string;
  description: string;
}

export const installSteps: InstallStep[] = [
  {
    step: 1,
    title: "Cutting",
    description:
      "Measure the required pipe length and mark it clearly using a felt tip pen. Verify size compatibility before proceeding. Cut using a plywood saw, ratchet cutter, or wheel cutter, always at 90° to ensure an optimal bonding area. Inspect pipe ends thoroughly before jointing — if any crack or splintering is found, cut a minimum of 25mm beyond the visible damage before proceeding.",
  },
  {
    step: 2,
    title: "Deburring / Beveling",
    description:
      "Burrs on or inside the pipe end can obstruct flow and prevent proper contact between the pipe and fitting socket. Remove them carefully from both inner and outer surfaces using a 15mm half-round file, pen knife, or deburring tool. Applying a slight bevel to the pipe end eases its entry into the fitting socket during assembly.",
  },
  {
    step: 3,
    title: "Fitting Preparation",
    description:
      "Wipe all dirt, dust, and moisture thoroughly from the fitting sockets and pipe end using a clean, dry rag. Perform a dry fit to confirm the pipe enters fully and reaches the bottom of the socket without obstruction. Once confirmed, mark the pipe clearly at the socket entry point using a felt tip pen for accurate reference during final assembly.",
  },
  {
    step: 4,
    title: "One-Step Solvent Cement Procedure",
    description:
      "Use only genuine Poddar solvent cement conforming to ASTM D-2564 / IS 14182 for a reliable solvent weld joint. Apply a smooth, even coat uniformly across the pipe end and inside the fitting socket. Never use thickened or lumpy cement — it must flow freely with a consistency similar to syrup or paint for proper surface penetration.",
  },
  {
    step: 5,
    title: "Assembly",
    description:
      "Immediately after applying solvent cement, insert the pipe firmly into the fitting socket. Rotate the pipe a quarter to half turn while inserting to distribute the cement evenly across the joint surface. Hold the assembly firmly in position for a minimum of 3 seconds to allow the joint to begin setting and prevent push-out.",
  },
  {
    step: 6,
    title: "Finishing",
    description:
      "Check that a continuous bead of solvent cement has formed around the full circumference of the socket fitting entrance, confirming sufficient cement coverage and a fully sealed joint. Using a clean, dry cloth, wipe away excess solvent cement from the external surface of both the pipe and fitting for a clean, professional finish.",
  },
];

export const handlingStorage = [
  { title: "Inspect on arrival", description: "Thoroughly inspect every pipe for signs of transit damage — cracks, chips, or shifts in load — before accepting delivery or proceeding with installation." },
  { title: "Handle with care", description: "Never throw, drop, or drag pipes from a truck bed or elevated surface, and keep them away from sharp objects and edges at all times." },
  { title: "Choose the right storage location", description: "Store pipes indoors where possible, on a level, dry surface, shielded from direct sunlight to minimise UV exposure." },
  { title: "Stack and support correctly", description: "Position thicker-walled pipes at the bottom of the stack. If stored on racks, keep support spacing under 3 feet to prevent bowing." },
  { title: "Seal solvent cement after every use", description: "Replace and tighten the container lid immediately after each application to prevent evaporation and fume escape." },
  { title: "Ensure adequate ventilation", description: "Avoid inhaling solvent vapours for extended periods — maintain ventilation throughout the jointing process, especially in enclosed areas." },
  { title: "Protect eyes and skin", description: "Prevent direct contact with solvent cement. If eye contact occurs, flush thoroughly with clean water for at least 15 minutes and seek medical attention." },
  { title: "Store containers properly", description: "Keep solvent cement, primers, and cleaners tightly sealed except during active use, and dispose of used rags responsibly." },
  { title: "Keep away from ignition sources", description: "Store and use solvent cement well away from open flames, heat sources, sparks, and combustion-triggering equipment." },
];

export const hotWeatherTips = [
  "Store solvent cement in a cool or well-shaded location prior to use to maintain its consistency and effectiveness.",
  "Where possible, store pipes and fittings in a shaded area before applying solvent cement to prevent surfaces from becoming too warm.",
  "Cool down the surfaces to be joined using a clean, damp rag before beginning — ensure the surface is completely dry before applying solvent cement.",
  "Where possible, carry out solvent cement application during the cooler morning hours to allow better working time.",
  "Always confirm that both surfaces being joined are still visibly wet with solvent cement at the moment they are brought together.",
  "Vigorously stir or shake the solvent cement container thoroughly before each use to ensure a uniform consistency.",
  "Complete system anchoring and final pipe connections during the cooler parts of the day to account for thermal expansion and contraction.",
];

export const installationWarnings = [
  "Always perform a complete dry fit of all joints prior to applying any solvent cement, to confirm a proper and secure interference fit exists between components.",
  "Any fitting joint that does not demonstrate a correct interference fit during dry fitting must be discarded and replaced immediately.",
  "Do NOT apply solvent cement to any joint that feels either too loose or excessively tight — improper fit results in a weak or failed joint.",
  "Always use appropriate, purpose-made bevelling tools to correctly prepare all pipe ends before any solvent cement is applied.",
  "Do NOT apply solvent cement to any joint without first completing the bevelling of all pipe ends.",
  "Use only One-Step solvent cement when connecting all pipes, fittings, and accessories, to ensure a consistently strong, leak-proof joint.",
  "Do NOT use any primer in combination with One-Step solvent cement — primer is neither required nor compatible with this jointing system.",
  "Do NOT use any other brand or type of solvent cement to connect Poddar pipes, fittings, and accessories, as this may result in joint failure.",
];
