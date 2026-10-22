import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "2. legacy" (node 2187:14295, 2026-10-22) — the homepage's 50-year
 * legacy band. Replaced the orange version (1979:32569).
 *
 * At 1512: a 616px band in navy `#0b0b52`; the copy at x150, 599 wide,
 * vertically centred; the blue-toned fittings photo flush right at its own
 * 1103x616, starting at x409 so it runs under the copy. Two navy washes over
 * the photo, both Figma's "Products-linear (blue)": one from the LEFT (solid
 * navy at the photo's left edge to clear at its right) so the copy sits on
 * navy, and one 200px band from the TOP (navy to clear) so the photo fades
 * out of the band's top edge.
 *
 * TYPE IS FIGMA'S: heading 48px uppercase, Light then SemiBold, leading 1.2;
 * 32px gap; body 16px Regular, leading 1.2, white, 580 wide, the two
 * paragraphs one blank line (1.2em) apart. Below `md` the heading steps down
 * with the site's section-heading ramp (type-heading).
 *
 * No mobile frame exists. Below `lg` the band is content-height and the photo
 * drops under the copy at its own ratio, washed from the top so it rises out
 * of the navy instead of starting on a hard edge.
 */
const PHOTO = "/home/legacy-fittings-navy.webp";
const NAVY = "#0b0b52";
const NAVY_0 = "rgba(11,11,82,0)";

export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden bg-[#0b0b52] lg:flex lg:h-[616px] lg:items-center">
      {/* Desktop photo: 1103x616 flush right, full band height. Wider screens
          keep it at that size (solid navy continues to its left); narrower
          ones keep the height, so it starts further left under the copy —
          where the left wash is solid navy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden aspect-[1103/616] lg:block"
      >
        <Image src={PHOTO} alt="" fill quality={90} sizes="1103px" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${NAVY}, ${NAVY_0})` }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[200px]"
          style={{ background: `linear-gradient(to bottom, ${NAVY}, ${NAVY_0})` }}
        />
      </div>

      <div className="container-figma relative z-[1] w-full pt-20 md:pt-[120px] lg:py-0">
        {/* White set on the h2 and p themselves: a global `h2` colour rule beats
            a colour merely inherited from this wrapper. */}
        <div className="flex flex-col gap-8 lg:max-w-[599px]">
          <RevealOnScroll>
            <h2 className="font-display type-heading uppercase text-white">
              <span className="block font-light">{t("overviewH1")}</span>
              <span className="block font-semibold">{t("overviewH2")}</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08} className="max-w-[580px]">
            <p className="type-body text-white">{t("overviewDesc")}</p>
            <p className="mt-[1.2em] type-body text-white">{t("overviewDesc2")}</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* Below `lg`: the photo under the copy, at its own ratio. */}
      <div aria-hidden="true" className="relative mt-10 aspect-[1103/616] w-full md:mt-14 lg:hidden">
        <Image src={PHOTO} alt="" fill quality={90} sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{ background: `linear-gradient(to bottom, ${NAVY}, ${NAVY_0})` }}
        />
      </div>
    </section>
  );
}
