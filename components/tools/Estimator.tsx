"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToElement } from "@/hooks/useLenis";
import { CalculatorIcon, PhoneCallIcon, ShareSocialIcon } from "@/components/tools/EstimatorIcons";
import { CAP_TRIM } from "@/components/shared/capTrim";
import { EnquiryLink } from "@/components/enquiry/EnquiryProvider";
import {
  ESTIMATOR_TABS,
  estimate,
  formatINR,
  SHOW_PRICES,
  type EstimatorTab,
  type PipeType,
  type StepperInput,
} from "@/lib/data/estimator";

/**
 * Motion. One curve for everything that ENTERS (a strong ease-out: fast start,
 * soft landing), so the result and the stepper read as one system. Framer is
 * already wrapped in `MotionConfig reducedMotion="user"` site-wide, so every
 * transform below drops to an instant change for reduced-motion users.
 */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * The material estimator (Figma component set 1582:8480, variants
 * `Property 1=default` and `Property 1=selected`).
 *
 * TWO STATES, ONE COMPONENT. The mock draws them as separate variants, but the
 * only thing that differs is the right-hand pane: the `default` variant shows a
 * dashed placeholder with a "+" disc, and `selected` shows the table plus the
 * phone/share actions in the pane header. Everything on the left is identical,
 * so this is one component with a `result` that is null until CALCULATE
 * ESTIMATE is pressed — and it goes back to null whenever an input changes,
 * which is what stops a stale table sitting under fresh inputs.
 *
 * The 1212x800 frame is reproduced as a ratio-free layout rather than a fixed
 * box: the left rail is Figma's 479px (39.5% of 1212) from `lg` up and the
 * panes stack below it. The mock has no mobile frame, so the stacked order —
 * inputs first, result below — is the one that keeps the CTA reachable without
 * scrolling past a table.
 */
export function Estimator() {
  const [tabId, setTabId] = useState(ESTIMATOR_TABS[0].id);
  const tab = ESTIMATOR_TABS.find((t) => t.id === tabId)!;

  return (
    <div className="flex flex-col gap-6">
      <TabStrip activeId={tabId} onSelect={setTabId} />
      {/* `key` remounts the panel on tab change, which resets counts, the pipe
          selection and the result together. Carrying them across tabs would be
          meaningless — the inputs are not the same quantities. */}
      <EstimatorPanel key={tab.id} tab={tab} />
    </div>
  );
}

/**
 * The estimator's type switcher. TWO CONTROLS, one per breakpoint — the same
 * trade the footer makes with its desktop columns and mobile accordions.
 *
 * DESKTOP (lg+) is Figma node 1488:14339: the whole strip is ONE white pill,
 * not a bare row.
 *
 *   frame   1212x69, `bg-white`, 1px `#c0c0c0`, radius 100, px20 / py12, gap 20
 *   pill    h43, radius 100, px56, text 18px, `leading-[0.8]`
 *   active  `bg-[#171796]`, white, SemiBold
 *   rest    transparent, `#606060`, REGULAR — no border of its own; the only
 *           stroke on the row is the frame's
 *
 * The `min-[1512px]` gates are not arbitrary: at Figma's padding the four pills
 * plus gaps come to exactly 1212 — the full content column — and that column is
 * only 1212 wide at a 1512 viewport (944 at `lg`, 980 at `xl`). Below 1512
 * the gaps tighten to 8 and the pills to px-20: at Figma's spacing the row
 * overflowed by 28px at 1024 and clipped "AGRICULTURE & IRRIGATION" against
 * the frame with no hint there was more. It stays `overflow-x-auto` as a net.
 *
 * MOBILE (below lg) IS A DISCLOSURE, because the row does not survive a phone.
 * Measured at 375: the strip shows 327px of a 955px control, hiding 630px, with
 * exactly ONE pill visible and no affordance that the other three exist. A 2x2
 * grid does not rescue it either — the columns are 138px and "UNDERGROUND
 * DRAINAGE" needs 143px at 13px type.
 *
 * So it collapses the way the rest of the site collapses multi-item nav on a
 * phone: the footer's three link groups become `<details>` accordions, the
 * navbar becomes a hamburger. Here the active type sits in a full-width navy
 * pill with a chevron and the other three drop beneath it — any tab one tap
 * away, nothing hidden off-screen.
 */
function TabStrip({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = ESTIMATOR_TABS.find((t) => t.id === activeId)!;

  // Close on Escape and on a tap outside. A disclosure that can only be shut by
  // re-tapping its own trigger is the usual mobile-menu annoyance.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <>
      {/* ------------------------------------------------ mobile: disclosure */}
      <div ref={wrapRef} className="relative lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex h-[56px] w-full touch-manipulation select-none items-center justify-between gap-3 rounded-[100px] bg-[#171796] px-6 text-left text-[16px] font-semibold uppercase leading-none text-white transition-transform duration-100 ease-out active:scale-[0.99]"
        >
          <span className={`-my-1.5 truncate py-1.5 ${CAP_TRIM}`}>{active.label}</span>
          <ChevronDown
            aria-hidden="true"
            className={`size-5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* `grid-rows-[0fr]` -> `[1fr]` animates the height without measuring
            it in JS. `invisible` while closed so the collapsed rows cannot be
            tabbed into, which `overflow-hidden` alone does not prevent. */}
        <div
          id={panelId}
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="mt-2 flex flex-col gap-2 rounded-[25px] border border-[#c0c0c0] bg-white p-2">
              {ESTIMATOR_TABS.filter((t) => t.id !== activeId).map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                      onSelect(t.id);
                      setOpen(false);
                    }}
                    className="flex h-[48px] w-full touch-manipulation select-none items-center rounded-[100px] px-4 text-left text-[16px] uppercase leading-none text-[#606060] transition-colors duration-100 ease-out hover:bg-[#f5f5f5] hover:text-[#171796] active:bg-[#ebebeb]"
                  >
                    <span className={CAP_TRIM}>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- desktop: the row */}
      <div
        role="tablist"
        aria-label="Estimator type"
        className="hidden touch-pan-y items-center gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide rounded-[100px] border border-[#c0c0c0] bg-white px-[20px] py-[12px] lg:flex min-[1512px]:justify-center min-[1512px]:gap-[20px] min-[1512px]:overflow-visible"
      >
        {ESTIMATOR_TABS.map((t) => {
          const on = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(t.id)}
              className={`flex h-[44px] shrink-0 touch-manipulation select-none items-center justify-center rounded-[100px] px-5 text-[18px] uppercase leading-[0.8] transition-[background-color,color,transform,translate,scale] duration-100 ease-out active:scale-[0.97] min-[1512px]:h-[43px] min-[1512px]:px-[56px] ${
                on
                  ? "bg-[#171796] font-semibold text-white"
                  : "font-normal text-[#606060] hover:text-[#171796]"
              }`}
            >
              <span className={CAP_TRIM}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function EstimatorPanel({ tab }: { tab: EstimatorTab }) {
  const steppers = useMemo(
    () => tab.inputs.filter((i): i is StepperInput => i.kind === "stepper"),
    [tab]
  );
  const choice = tab.inputs.find((i) => i.kind === "choice");

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [pipeType, setPipeType] = useState<PipeType | null>(null);
  const [result, setResult] = useState<ReturnType<typeof estimate> | null>(null);
  const calcRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // BRING THE RESULT TO THE USER, but only when it landed somewhere else.
  // Stacked (below lg) the pane renders under the button, which on a 375 phone
  // sits at the fold — measured: the page did not move on press, the table
  // started 138px below the viewport and TOTAL COST 623px down. Side by side
  // (lg+) the pane is already level with the button, so nothing should jump.
  // Comparing the two boxes rather than reading a breakpoint keeps this true
  // whatever the layout does. Focus follows (without a second scroll) so a
  // screen reader lands on the answer, not back on the button.
  useEffect(() => {
    if (!result) return;
    const btn = calcRef.current;
    const pane = resultRef.current;
    if (!btn || !pane) return;
    if (pane.getBoundingClientRect().top < btn.getBoundingClientRect().bottom) return;
    // Through Lenis, not `scrollIntoView` — see `scrollToElement`.
    scrollToElement(pane);
    pane.focus({ preventScroll: true });
  }, [result]);

  // Any edit invalidates the shown estimate — see the note on the component.
  //
  // FUNCTIONAL UPDATE, and the clamp lives in here rather than in the Stepper.
  // The stepper used to compute `current + 1` from its props, which React
  // batches: two clicks before a re-render both read the same stale count and
  // the second one is swallowed. Deriving the next value from `c[id]` makes
  // each click independent of render timing.
  function stepCount(id: string, delta: number, min: number, max: number) {
    setCounts((c) => {
      const current = c[id] ?? 0;
      return { ...c, [id]: Math.max(min, Math.min(max, current + delta)) };
    });
    setResult(null);
  }

  const hasCounts = steppers.some((s) => (counts[s.id] ?? 0) > 0);
  const ready = hasCounts && (!choice || pipeType !== null);
  // Says WHY the button is disabled — it used to just sit greyed out.
  const notReadyHint = ready
    ? null
    : !hasCounts
      ? "Add at least one item above to calculate."
      : "Choose a pipe type to calculate.";

  return (
    <div className="overflow-hidden rounded-[25px] border border-[#c0c0c0] bg-white">
      {/* Panel header — 57px icon tile at `rgba(23,23,150,0.1)` with a 12px
          radius, then the title at 28px. */}
      <div className="flex items-center gap-[23px] border-b border-[#c0c0c0] px-4 pb-[11px] pt-[18px]">
        <span
          aria-hidden="true"
          className="flex size-[57px] shrink-0 items-center justify-center rounded-[12px] bg-[#171796]/10"
        >
          <CalculatorIcon className="shrink-0 text-[#171796]" />
        </span>
        <h2 className="font-display text-[20px] font-semibold uppercase leading-none text-[#606060] md:text-[28px]">
          {tab.title}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ------------------------------------------------ inputs (left rail) */}
        {/* Vertical rhythm is derived from the CONTROL boxes, not the text,
            because those are the unambiguous rectangles in the mock: stepper1
            y154, stepper2 y268, radio row 1 y382, row 2 y444 — a 114px pitch
            per group and 62px between the radio rows. A group is label (24) +
            8 + control (50) = 82, so the gap BETWEEN groups is 114 - 82 = 32,
            i.e. `gap-8`. Top pad is 154 - 87 - 24 - 8 = 35; the other three
            sides keep Figma's 39. */}
        <div className="flex flex-col gap-8 p-6 md:p-[39px] md:pt-[35px] lg:w-[39.5215%] lg:shrink-0">
          <div className="flex flex-col gap-8">
            {steppers.map((s) => (
              <Stepper
                key={s.id}
                input={s}
                value={counts[s.id]}
                onStep={(delta) => stepCount(s.id, delta, s.min, s.max)}
              />
            ))}

            {choice && choice.kind === "choice" && (
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 text-[16px] uppercase text-[#606060]">
                  {choice.label}
                </legend>
                {/* ONE COLUMN ON A PHONE. Figma's 2-up + 1 is a 195px-pill
                    layout; at 375 a half-width pill is 134px and "Combination"
                    needs 173 (105 of text + the 16 dot + 12 gap + 40 padding),
                    so the label was ellipsing to "Combi...". Full-width pills
                    fit it at 279 and give a bigger touch target. Two-up returns
                    at `sm`, where the rail is still full width (267px each).

                    ONE COLUMN AGAIN FROM `lg` UNTIL 1512. Side by side, the
                    rail is 39.5% of the column minus 78px of padding: 295px at
                    1024, 309 at 1280 — and two 195s plus the gap need 400. They
                    were spilling 105px out of the rail and under the result
                    pane's border. The rail only reaches 400 at a 1512 viewport
                    (the full 1212 column), the same gate the tab row uses.

                    Two traps in the classes. `lg:max-[1511px]:` rather than a
                    bare `lg:` — Tailwind v4 emits `lg:` AFTER `min-[1512px]:`,
                    so the one-column rule silently won at 1512 too. And
                    `minmax(0,195px)`, not a fixed 195: with a classic (Windows)
                    scrollbar the 1512 rail is 394px, and two fixed 195s plus
                    the 10px gap overflowed it by 6. */}
                <div className="grid grid-cols-1 gap-x-[10px] gap-y-[12px] sm:max-lg:grid-cols-2 lg:max-w-[400px] lg:max-[1511px]:grid-cols-1 min-[1512px]:grid-cols-[repeat(2,minmax(0,195px))]">
                  {choice.options.map((o) => {
                    const on = pipeType === o.value;
                    return (
                      <label
                        key={o.value}
                        className={`flex h-[50px] w-full cursor-pointer touch-manipulation select-none items-center gap-3 rounded-full border bg-white px-5 text-[18px] transition-[border-color,color,transform,translate,scale] duration-100 ease-out active:scale-[0.98] ${
                          on
                            ? "border-2 border-[#171796] font-medium text-[#171796]"
                            : "border-[#c0c0c0] text-[#4a4a4a] hover:border-[#171796]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pipeType-${tab.id}`}
                          value={o.value}
                          checked={on}
                          onChange={() => {
                            setPipeType(o.value);
                            setResult(null);
                          }}
                          className="sr-only"
                        />
                        {/* Ring + dot rather than an accent-coloured native
                            radio: the mock's ring is `#c0c0c0` at rest and
                            navy with a filled centre when chosen, which
                            `accent-color` cannot express on its own. */}
                        {/* `shrink-0` is load-bearing, not defensive. This is a
                            flex item and `flex-shrink` defaults to 1, so when
                            the label was too long for the pill the browser took
                            the space out of the CIRCLE — "Combination", the
                            longest of the three, rendered as a visible oval
                            while CPVC and uPVC stayed round. The text is what
                            should give, which is what `truncate` + `min-w-0`
                            below do: a flex item will not shrink past its
                            content without `min-w-0`. */}
                        <span
                          aria-hidden="true"
                          className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                            on ? "border-[#171796]" : "border-[#606060]"
                          }`}
                        >
                          {on && <span className="size-2 shrink-0 rounded-full bg-[#171796]" />}
                        </span>
                        <span className={`-my-1.5 min-w-0 truncate py-1.5 ${CAP_TRIM}`}>{o.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>

          {/* `mt-auto` pins this to the bottom of the rail, as Figma does
              (bottom: 31px) rather than letting it float under the last input. */}
          <button
            ref={calcRef}
            type="button"
            disabled={!ready}
            aria-describedby={notReadyHint ? "estimator-hint" : undefined}
            onClick={() => setResult(estimate(tab, counts, pipeType ?? "combination"))}
            className="mt-auto flex h-[46px] w-full touch-manipulation select-none items-center justify-center rounded-full bg-[#f28000] px-[14px] text-[18px] font-semibold uppercase leading-[1.08] text-[#0b0b52] transition-[filter,transform,translate,scale] duration-100 ease-out hover:brightness-95 active:scale-[0.98] active:brightness-90 disabled:cursor-not-allowed disabled:opacity-40 lg:max-w-[400px]"
          >
            <span className={CAP_TRIM}>Calculate Estimate</span>
          </button>
          {notReadyHint && (
            <p id="estimator-hint" className="-mt-1 text-[13px] leading-[1.4] text-[#606060]">
              {notReadyHint}
            </p>
          )}
        </div>

        {/* ----------------------------------------------- result (right pane) */}
        {/* `scroll-mt-24` clears the fixed navbar, as on /contact.
            `lg:min-w-0` is load-bearing: a flex item will not shrink below its
            content, so the table's `min-w` pushed this pane 40px past the
            panel at 1024 and the panel's `overflow-hidden` clipped the table's
            right edge. With it, the table's own wrapper scrolls instead. */}
        <div
          ref={resultRef}
          tabIndex={-1}
          className="scroll-mt-24 border-t border-[#c0c0c0] p-6 outline-none md:p-[39px] lg:min-w-0 lg:flex-1 lg:border-l lg:border-t-0"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-[20px] font-medium uppercase leading-none text-[#606060] md:text-[24px]">
              {SHOW_PRICES ? "Cost Breakdown" : "Material List"}
            </h3>
            {/* Only in the `selected` variant — the empty state has no actions
                because there is nothing yet to call about or share. */}
            {result && (
              <div className="flex shrink-0 gap-2">
                {/* Opens the enquiry pop-up with this estimate already in the
                    message, so the sales team sees what was calculated. */}
                <EnquiryLink
                  aria-label="Contact us about this estimate"
                  className={ACTION_BUTTON}
                  preset={{
                    message: estimateSummary(tab, steppers, counts, pipeType, result.grandTotal),
                  }}
                >
                  <PhoneCallIcon />
                </EnquiryLink>
                <ShareButton tab={tab} total={result.grandTotal} rows={result.rows} />
              </div>
            )}
          </div>

          {!result ? (
            <EmptyState />
          ) : SHOW_PRICES ? (
            <ResultTable tab={tab} result={result} />
          ) : (
            <MaterialList
              tab={tab}
              result={result}
              summary={inputsSummary(tab, steppers, counts, pipeType)}
              enquiryMessage={estimateSummary(tab, steppers, counts, pipeType, result.grandTotal)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** Figma 1582:8391 — a 400x50 pill with `#f5f5f5` end caps carrying - and +. */
function Stepper({
  input,
  value,
  onStep,
}: {
  input: StepperInput;
  value: number | undefined;
  /** +1 / -1 only — the parent owns the clamp, see `stepCount`. */
  onStep: (delta: number) => void;
}) {
  const shown = value === undefined ? "-" : value;
  const current = value ?? 0;

  // Which way the last step went, so the number slides WITH the press: up
  // for +, down for −. Set in the click handler, not derived during render —
  // a ref written in render reads back wrong under StrictMode's double render.
  const [dir, setDir] = useState(1);
  const step = (delta: 1 | -1) => {
    setDir(delta);
    onStep(delta);
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[16px] uppercase text-[#606060]">{input.label}</span>
      <div className="flex h-[50px] w-full max-w-[400px] items-stretch overflow-hidden rounded-full border border-[#c0c0c0] bg-white">
        <button
          type="button"
          aria-label={`Decrease ${input.label}`}
          disabled={current <= input.min}
          onClick={() => step(-1)}
          className="flex w-[50px] shrink-0 touch-manipulation items-center justify-center select-none bg-[#f5f5f5] text-[24px] font-medium text-[#4a4a4a] transition-colors duration-100 ease-out hover:bg-[#ebebeb] active:bg-[#e0e0e0] disabled:opacity-40"
        >
          <span className={CAP_TRIM}>&minus;</span>
        </button>
        {/* `overflow-hidden` clips the outgoing number as it slides away.
            `popLayout` takes it out of flow so the two never stack. */}
        <span
          aria-live="polite"
          className="relative flex flex-1 items-center justify-center overflow-hidden text-[18px] tabular-nums text-[#4a4a4a]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shown}
              initial={{ y: 12 * dir, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12 * dir, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className={`block ${CAP_TRIM}`}
            >
              {shown}
            </motion.span>
          </AnimatePresence>
        </span>
        <button
          type="button"
          aria-label={`Increase ${input.label}`}
          disabled={current >= input.max}
          onClick={() => step(1)}
          className="flex w-[50px] shrink-0 touch-manipulation items-center justify-center select-none bg-[#f5f5f5] text-[24px] font-medium text-[#4a4a4a] transition-colors duration-100 ease-out hover:bg-[#ebebeb] active:bg-[#e0e0e0] disabled:opacity-40"
        >
          <span className={CAP_TRIM}>+</span>
        </button>
      </div>
    </div>
  );
}

/** The `default` variant's right pane (Figma 1582:8479). */
function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[25px] border border-dashed border-[#c0c0c0] bg-[#f5f5f5]/35 px-8 py-16 text-center lg:min-h-[596px]">
      <span
        aria-hidden="true"
        className="mb-6 flex size-[52px] items-center justify-center rounded-full bg-[#171796]/10"
      >
        <Plus className="size-6 text-[#171796]" />
      </span>
      <p className="font-display text-[18px] font-bold uppercase text-[#4a4a4a] md:text-[20px]">
        Your estimate will appear here
      </p>
      <p className="mt-2 max-w-[340px] text-[14px] leading-[1.4] text-[#606060]">
        Enter your project details and choose the plumbing type to see the material
        breakdown.
      </p>
    </div>
  );
}

function ResultTable({
  tab,
  result,
}: {
  tab: EstimatorTab;
  result: ReturnType<typeof estimate>;
}) {
  return (
    // `@container`: cards or table is decided by the width THIS pane gets, not
    // the viewport. The two do not track each other — the pane is 480px at
    // 1024, 574 at 1180, then 520 at 1280 (the container gutter jumps at
    // `xl`) — so a viewport breakpoint picks the wrong one somewhere.
    // Rises in on Calculate. It mounts fresh each time — any input edit sets
    // `result` back to null — so this plays once per new answer, not on resize.
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="@container flex flex-col gap-4"
    >
      <ResultCards result={result} />

      {/* 540px+ only — below that it is `ResultCards`. The table needs ~530
          for "TOTAL COST (MRP)" to set on one line (145px of label + 64 of
          padding + three ~107px figure columns); at 1024's 480 it broke onto
          three lines and the item names onto two or three. `overflow-x-auto`
          stays as a safety net. The rounded border lives on
          the wrapper so the scroll clips inside it, which is what keeps the
          navy header and footer rows square to the radius. */}
      <div className="hidden touch-pan-y overflow-x-auto overscroll-x-contain rounded-[25px] border border-[#c0c0c0] bg-[#f5f5f5]/35 @min-[540px]:block">
        {/* No `min-w`: the 520px floor was for phones, which get `ResultCards`
            now, and the table only shows from 540px. `whitespace-nowrap` on
            the cells keeps every figure on one line. */}
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#171796] text-[14px] font-semibold uppercase text-white md:text-[18px]">
              <th scope="col" className="px-5 py-4 font-semibold md:max-[1511px]:px-8 min-[1512px]:px-[60px]">
                Items
              </th>
              {result.columns.map((c) => (
                <th key={c.id} scope="col" className="px-4 py-4 text-right font-semibold">
                  {c.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-4 pr-5 text-right font-semibold md:pr-8">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.id} className="border-t border-[#c0c0c0] text-[14px] text-[#606060] md:text-[16px]">
                <th scope="row" className="px-5 py-4 text-left font-normal md:max-[1511px]:px-8 min-[1512px]:px-[60px]">
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td
                    key={result.columns[i].id}
                    className="whitespace-nowrap px-4 py-4 text-right tabular-nums"
                  >
                    {formatINR(cell)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-4 pr-5 text-right font-medium tabular-nums text-[#4a4a4a] md:pr-8">
                  {formatINR(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#171796] text-[14px] font-semibold text-white md:text-[18px]">
              <th scope="row" className="px-5 py-4 text-left uppercase md:max-[1511px]:px-8 min-[1512px]:px-[60px]">
                Total Cost (MRP)
              </th>
              {result.columnTotals.map((total, i) => (
                <td
                  key={result.columns[i].id}
                  className="whitespace-nowrap px-4 py-4 text-right tabular-nums"
                >
                  {formatINR(total)}
                </td>
              ))}
              <td className="whitespace-nowrap px-4 py-4 pr-5 text-right tabular-nums md:pr-8">
                {formatINR(result.grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="text-[13px] leading-[1.5] text-[#86868c]">
        <p className="font-medium">Assumptions:</p>
        <ul className="list-inside list-disc">
          {tab.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        {/* The rates are placeholders until the Poddar price list lands — see
            the banner in lib/data/estimator.ts. Saying so in the UI is the
            honest default; delete this line once real MRPs are in. */}
        <p className="mt-2 font-medium text-[#f28000]">
          Indicative rates only — not yet loaded with live Poddar MRPs.
        </p>
      </div>
    </motion.div>
  );
}

/** `formatINR` returns a bare "-" for zero; with a rupee sign that reads "₹-". */
function rupees(value: number) {
  return value ? `₹${formatINR(value)}` : "—";
}

/**
 * The result when its pane is under 540px wide (phones, and the side-by-side
 * layout at 1024 and 1280): the table TRANSPOSED, one entry per line item.
 *
 * Why not the table: at 375 it was 520px wide in a 275px window — 245px of
 * sideways scroll on every row, the item name scrolled away from its numbers,
 * and the only figure anyone came for (TOTAL COST) sat in the last row, 623px
 * below the fold. So the order inverts:
 *
 *   1. the grand total first, as a navy summary card, with the per-column
 *      totals (Bathroom / Kitchen …) under a hairline — the table's tfoot
 *   2. then each line item: name left, its total right, and the per-column
 *      split as a quiet sub-line — the table's row, read across instead of
 *      scrolled across
 *
 * Single-column tabs drop the summary split; it would only repeat the total.
 */
function ResultCards({ result }: { result: ReturnType<typeof estimate> }) {
  const split = result.columns.length > 1;
  return (
    <div className="flex flex-col gap-3 @min-[540px]:hidden">
      <div className="rounded-[25px] bg-[#171796] px-5 py-5 text-white">
        <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.04em] text-white/70">
          Total Cost (MRP)
        </p>
        <p className="mt-2 font-display text-[32px] font-bold leading-none tabular-nums">
          {rupees(result.grandTotal)}
        </p>
        {split && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/20 pt-4">
            {result.columns.map((c, i) => (
              <div key={c.id} className="min-w-0">
                <dt className="text-[12px] uppercase leading-none text-white/70">{c.label}</dt>
                <dd className="mt-1.5 truncate text-[15px] font-medium leading-none tabular-nums">
                  {rupees(result.columnTotals[i])}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Line items follow the total in a short stagger (35ms apart, after a
          120ms beat), so the eye lands on the headline figure first. */}
      <motion.ul
        aria-label="Line items"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { delayChildren: 0.12, staggerChildren: 0.035 } } }}
        className="divide-y divide-[#c0c0c0] overflow-hidden rounded-[25px] border border-[#c0c0c0] bg-[#f5f5f5]/35"
      >
        {result.rows.map((row) => {
          // Non-zero fixtures only, and only when there are two or more — a
          // single part IS the row total, and "Kitchen —" is noise.
          const parts = result.columns
            .map((c, i) => ({ id: c.id, label: c.label, value: row.cells[i] }))
            .filter((p) => p.value);
          return (
            <motion.li
              key={row.id}
              variants={{
                hidden: { opacity: 0, y: 6 },
                shown: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_OUT } },
              }}
              className="px-5 py-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 text-[15px] leading-[1.3] text-[#4a4a4a]">{row.label}</span>
                <span className="shrink-0 text-[15px] font-semibold tabular-nums text-[#171796]">
                  {rupees(row.total)}
                </span>
              </div>
              {parts.length > 1 && (
                <p className="mt-1 flex flex-wrap gap-x-2 text-[13px] leading-[1.4] text-[#86868c] tabular-nums">
                  {parts.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && <span aria-hidden="true" className="mr-2">·</span>}
                      {p.label} {rupees(p.value)}
                    </span>
                  ))}
                </p>
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

/**
 * The estimate as plain text for the enquiry message — type, every input that
 * was set, the pipe family and the indicative total. Editable in the form.
 */
function estimateSummary(
  tab: EstimatorTab,
  steppers: StepperInput[],
  counts: Record<string, number>,
  pipeType: PipeType | null,
  total: number
) {
  const lines = steppers
    .filter((s) => (counts[s.id] ?? 0) > 0)
    .map((s) => `• ${s.label}: ${counts[s.id]}`);
  const choice = tab.inputs.find((i) => i.kind === "choice");
  if (choice && choice.kind === "choice" && pipeType) {
    const picked = choice.options.find((o) => o.value === pipeType);
    if (picked) lines.push(`• ${choice.label.replace(/^Select\s+/i, "")}: ${picked.label}`);
  }
  return [
    SHOW_PRICES ? "I'd like to discuss this estimate:" : "Please send me pricing for this material list:",
    "",
    tab.title,
    ...lines,
    ...(SHOW_PRICES ? ["", `Indicative total: ₹${formatINR(total)} (MRP)`] : []),
  ].join("\n");
}

/** "2 Bathrooms · 1 Kitchen · CPVC" — what the list was worked out for. */
function inputsSummary(
  tab: EstimatorTab,
  steppers: StepperInput[],
  counts: Record<string, number>,
  pipeType: PipeType | null
) {
  const parts = steppers
    .filter((s) => (counts[s.id] ?? 0) > 0)
    .map((s) => `${s.label.replace(/^Number of\s+/i, "")}: ${counts[s.id]}`);
  const choice = tab.inputs.find((i) => i.kind === "choice");
  if (choice && choice.kind === "choice" && pipeType) {
    const picked = choice.options.find((o) => o.value === pipeType);
    if (picked) parts.push(picked.label);
  }
  return parts.join(" · ");
}

/**
 * The result while prices are unpublished (`SHOW_PRICES` false): the same
 * calculation, shown as the list of materials the job needs — no ₹ figures —
 * with the obvious next step, a quote for exactly this list, one tap away.
 * Same shell as the priced result (navy summary card, then a ruled list) so
 * the panel keeps its look.
 */
function MaterialList({
  tab,
  result,
  summary,
  enquiryMessage,
}: {
  tab: EstimatorTab;
  result: ReturnType<typeof estimate>;
  summary: string;
  enquiryMessage: string;
}) {
  const rows = result.rows.filter((r) => r.total > 0);
  // The tabs' assumptions were written for the priced result; drop the ones
  // about MRP while no prices are shown.
  const assumptions = tab.assumptions.filter((a) => !/\bMRP\b|price/i.test(a));
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="flex flex-col gap-4"
    >
      <div className="rounded-[25px] bg-[#171796] px-5 py-5 text-white md:px-8 md:py-6">
        <p className="text-[13px] font-semibold uppercase leading-none tracking-[0.04em] text-white/70">
          You&rsquo;ll need {rows.length} {rows.length === 1 ? "item" : "items"}
        </p>
        <p className="mt-2 text-[16px] font-medium leading-[1.35] md:text-[18px]">{summary}</p>
      </div>

      <motion.ul
        aria-label="Materials"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { delayChildren: 0.12, staggerChildren: 0.035 } } }}
        className="divide-y divide-[#c0c0c0] overflow-hidden rounded-[25px] border border-[#c0c0c0] bg-[#f5f5f5]/35"
      >
        {rows.map((row) => (
          <motion.li
            key={row.id}
            variants={{
              hidden: { opacity: 0, y: 6 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_OUT } },
            }}
            className="flex items-center gap-3 px-5 py-4 md:px-8"
          >
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#171796]/10 text-[#171796]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="min-w-0 text-[15px] leading-[1.3] text-[#4a4a4a] md:text-[16px]">{row.label}</span>
          </motion.li>
        ))}
      </motion.ul>

      <div className="flex flex-col gap-3 rounded-[25px] border border-[#c0c0c0] p-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p className="text-[14px] leading-[1.45] text-[#4a4a4a]">
          Prices aren&rsquo;t published online yet. Send this list to our sales team for
          quantities and a quote.
        </p>
        <EnquiryLink
          preset={{ message: enquiryMessage }}
          className="flex h-[46px] shrink-0 touch-manipulation select-none items-center justify-center rounded-full bg-[#f28000] px-6 text-[16px] font-semibold uppercase tracking-[0.3px] text-[#0b0b52] transition-[filter] hover:brightness-95"
        >
          <span className={CAP_TRIM}>Get a quote</span>
        </EnquiryLink>
      </div>

      <div className="text-[13px] leading-[1.5] text-[#606060]">
        <p className="font-medium">Assumptions:</p>
        <ul className="list-inside list-disc">
          {assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/**
 * The pane header's two round actions (Figma: 44px, 0.5px `#606060` ring).
 *
 * Hover turns the ring and the glyph brand orange and lifts the disc 2px with
 * a soft orange-tinted shadow, so it reads as raised rather than just tinted.
 * Press drops it back below rest. `motion-safe:` keeps the lift off for
 * reduced-motion users, who still get the colour change. `@media (hover)`
 * gating via `hover:` (Tailwind v4 default) stops the lift sticking on touch.
 */
const ACTION_BUTTON =
  "flex size-11 shrink-0 touch-manipulation select-none items-center justify-center rounded-full border-[0.5px] border-[#606060] bg-white text-[#606060] transition-[color,border-color,box-shadow,transform,translate,scale] duration-200 ease-out hover:border-[#f28000] hover:text-[#f28000] hover:shadow-[0_6px_16px_-6px_rgba(242,128,0,0.55)] focus-visible:border-[#f28000] focus-visible:text-[#f28000] focus-visible:outline-none motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 active:scale-95";

/**
 * `mailto:` rather than the Web Share API: share targets on desktop are
 * inconsistent and the reference tool uses a plain mail link too. No
 * `navigator.share` feature-detection branch, which would make the button
 * behave differently on the same page across devices.
 */
function ShareButton({
  tab,
  total,
  rows,
}: {
  tab: EstimatorTab;
  total: number;
  rows: ReturnType<typeof estimate>["rows"];
}) {
  const subject = `Poddar Pipes — ${tab.title}`;
  const body = SHOW_PRICES
    ? `My ${tab.label.toLowerCase()} estimate comes to Rs ${formatINR(total)} (indicative MRP).`
    : `My ${tab.label.toLowerCase()} material list from Poddar Pipes:\n${rows
        .filter((r) => r.total > 0)
        .map((r) => `- ${r.label}`)
        .join("\n")}`;
  return (
    <a
      href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
      aria-label="Share this estimate by email"
      className={ACTION_BUTTON}
    >
      <ShareSocialIcon />
    </a>
  );
}
