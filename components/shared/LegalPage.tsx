import type { ReactNode } from "react";
import type { LegalSection } from "@/types";

export function LegalIntro({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((p) => (
        <p key={p} className="text-[15px] leading-[1.7] text-slate-900/80 sm:text-base">
          {p}
        </p>
      ))}
    </div>
  );
}

function LegalH2({ children }: { children: ReactNode }) {
  // Same fix used sitewide for icon+text rows (Button, Navbar, CTASection,
  // etc. — see BRAND_IDENTITY.md): a bare text child centers against its
  // full, untrimmed line-height box, which visually reads as "low" next to
  // a flex-centered decorative element. Wrapping the text in its own span
  // with text-box-trim lets `items-center` centre the bar against the
  // text's actual cap-height instead.
  return (
    <h2 className="mt-12 flex items-center gap-3 text-xl font-medium text-ocean-600 sm:text-2xl">
      {/* Straight-bar version — commented out, not deleted, so it's easy to
          swap back if the pipe-pill experiment below doesn't stick. */}
      {/* <span className="h-[3px] w-6 shrink-0 rounded-full bg-amber-600" aria-hidden="true" /> */}

      {/* Trying two short pills with a gap between them, like a pipe run
          with a coupling joint, instead of a plain divider line. */}
      <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-3 rounded-full bg-amber-600" />
        {/* <span className="h-1.5 w-3 rounded-full bg-amber-600" /> */}
      </span>
      <span className="leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">{children}</span>
    </h2>
  );
}

function LegalP({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-[1.7] text-slate-900/80 sm:text-base">{children}</p>;
}

function LegalUL({ items }: { items: string[] }) {
  // Not a native `list-disc` marker — browsers position that relative to the
  // line's baseline, so with this generous leading-[1.7] the dot renders
  // near the bottom of the (tall) line instead of centered against the text.
  // A manually-placed dot sidesteps that: it's centered against the text's
  // own em-box regardless of line-height.
  return (
    <ul className="mt-4 flex flex-col gap-2 text-[15px] leading-[1.7] text-slate-900/80 sm:text-base">
      {items.map((item) => (
        // items-start + a fixed top offset on the dot — not items-center.
        // Centering against the whole flex item works for a single line,
        // but on a two-line item it centers against the FULL wrapped block,
        // dragging the dot down between the lines instead of next to the
        // first one. A top-anchored offset only ever measures from the
        // start, so it lines up with line one no matter how many lines
        // follow. The offset itself is calibrated to the trimmed cap-height
        // of a single line (measured empirically), expressed in em so it
        // scales with the sm:text-base breakpoint too.
        <li key={item} className="flex items-start gap-3">
          <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900/50" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** The one piece of real contact data both legal pages point to. */
export function LegalContactBlock() {
  return (
    <address className="mt-4 not-italic text-[15px] leading-[1.7] text-slate-900/80 sm:text-base">
      Poddar Plumbing System Pvt. Ltd.
      <br />
      4th Floor, 1202, HAL 2nd Stage, Domlur, 100 Feet Road, Indiranagar, Bengaluru, Karnataka – 560008
      <br />
      Email:{" "}
      <a
        href="mailto:poddarpipes@gmail.com"
        className="font-medium text-ocean-600 underline decoration-ocean-600/30 underline-offset-2 transition-colors hover:text-amber-600"
      >
        poddarpipes@gmail.com
      </a>
      <br />
      Phone:{" "}
      <a
        href="tel:+919888822333"
        className="font-medium text-ocean-600 underline decoration-ocean-600/30 underline-offset-2 transition-colors hover:text-amber-600"
      >
        +91 98888 22333
      </a>
    </address>
  );
}

interface LegalSectionsProps {
  sections: LegalSection[];
  /** Section heading (exact match) after whose first paragraph the real
   * contact details should be inserted — used by the "Contacting Us" /
   * "Contact Us" section on both legal pages instead of baking address/email
   * strings into the data file as plain, unlinked text. */
  contactBlockAfterHeading?: string;
}

export function LegalSections({ sections, contactBlockAfterHeading }: LegalSectionsProps) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading}>
          <LegalH2>{section.heading}</LegalH2>
          {section.body.map((block, i) => (
            <div key={i}>
              {typeof block === "string" ? <LegalP>{block}</LegalP> : <LegalUL items={block.list} />}
              {i === 0 && section.heading === contactBlockAfterHeading && <LegalContactBlock />}
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
