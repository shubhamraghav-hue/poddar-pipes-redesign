import { useTranslations } from "next-intl";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { COMPANY } from "@/lib/data/offices";

/**
 * Figma "Contact Page" > legacy section (node 1606:11568) — the copy and the
 * two registered addresses on the left, the enquiry form on the right.
 *
 * The form itself is `EnquiryForm` (components/enquiry), shared with the
 * global enquiry pop-up so there is one field set and one submit path. It is a
 * different shape from the older `InquiryForm`, which stays for the careers
 * page.
 */

/** Node 1606:11571 / 1606:11572. `label` is a contactPage message key; the
    address lines stay in English on every locale (postal addresses). */
const OFFICES = [
  {
    label: "regOffice",
    lines: COMPANY.address.oneLine,
  },
  {
    label: "mfdOffice",
    lines: COMPANY.plant.oneLine,
  },
] as const;

export function SendMessage() {
  const t = useTranslations("contactPage");
  return (
    <section id="send-a-message" className="scroll-mt-24 bg-white py-20 md:py-[120px]">
      <div className="container-figma grid grid-cols-1 gap-12 lg:grid-cols-[328px_minmax(0,621px)] lg:justify-between lg:gap-[180px]">
        {/* -------------------------------------------------------- left rail */}
        <div className="flex flex-col">
          <h2 className="max-w-2xl font-display type-heading uppercase text-[#606060]">
            <span className="block font-light">{t("sendHeading1")}</span>
            <span className="block font-bold">{t("sendHeading2")}</span>
          </h2>

          {/* 18px / 1.2 `#606060`, 32 under the heading (node 1606:11570). */}
          <p className="mt-8 type-body text-[#606060]">
            {t("sendDesc")}
          </p>

          {/* Node 1606:11616 — 440 wide, starting 12px LEFT of the text column
              (x135 vs x147) and 30 under the copy. From `lg` it overhangs the
              328px rail into the gutter, as drawn; below that it is clamped to
              the column so it cannot cause sideways scroll. */}
          <div className="mt-[30px] border-t border-[#c0c0c0] lg:-ml-3 lg:w-[440px]" />

          {/* Labels 30 under the rule, 8 above their address, 20 between the
              two offices (nodes 1606:11614 / 11571 / 11615 / 11572). */}
          <dl className="mt-[30px] flex flex-col gap-5">
            {OFFICES.map((o) => (
              <div key={o.label}>
                <dt className="type-sub font-semibold uppercase text-[#f28000]">
                  {t(o.label)}
                </dt>
                <dd className="mt-2 type-body text-[#606060]">
                  {o.lines}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ------------------------------------------------------------- form */}
        {/* `lg:pt-2`: the form card starts 8px below the heading (y128 vs
            y120 in node 1606:11568) once the two sit side by side. */}
        <div className="lg:pt-2">
          <EnquiryForm variant="page" />
        </div>
      </div>
    </section>
  );
}
