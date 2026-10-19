import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * Figma "2. legacy" (node 1979:32569, 2026-10-19) — the homepage's 50-year
 * legacy band. Replaced the white band with the pencil-sketch building
 * (node 13:448 / 1197:6064).
 *
 * At 1512: a 616px band in `#ec7200` (Figma's "orange/darker"); the copy at
 * x150, 599 wide, vertically centred; the fittings photo flush right at its
 * own 1103x616, starting at x409 so it runs under the copy, with Figma's
 * "Legacy-linear (orange)" gradient over it — solid `#ec7200` at its left
 * edge to `rgba(236,114,0,0.2)` at the right — so the copy sits on orange.
 *
 * TYPE IS FIGMA'S: heading 48px uppercase, Light then SemiBold, leading 1.2;
 * 32px gap; body 16px Regular, leading 1.2, white. Below `md` the heading
 * steps down with the site's section-heading ramp (28 / 36 / 48 — the same as
 * the product pages and CTASection); the body stays 16px throughout.
 *
 * No mobile frame exists. Below `lg` the band is content-height and the photo
 * drops under the copy at its own ratio, washed from the top so it rises out
 * of the orange instead of starting on a hard edge.
 */
const PHOTO = "/home/legacy-fittings.webp";
const ORANGE = "#ec7200";
const ORANGE_20 = "rgba(236,114,0,0.2)";

export async function CompanyOverview() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden bg-[#ec7200] lg:flex lg:h-[616px] lg:items-center">
      {/* Desktop photo: 1103x616 flush right, full band height. Wider screens
          keep it at that size (solid orange continues to its left); narrower
          ones keep the height, so it starts further left under the copy —
          where the gradient is solid orange. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden aspect-[1103/616] lg:block"
      >
        <Image src={PHOTO} alt="" fill quality={90} sizes="1103px" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${ORANGE}, ${ORANGE_20})` }}
        />
      </div>

      <div className="container-figma relative z-[1] w-full pt-20 md:pt-[120px] lg:py-0">
        {/* White set on the h2 and p themselves: a global `h2` colour rule beats
            a colour merely inherited from this wrapper (it rendered #1c1a1f). */}
        <div className="flex flex-col gap-8 lg:max-w-[599px]">
          <RevealOnScroll>
            <h2 className="font-display type-heading uppercase text-white">
              <span className="block font-light">{t("overviewH1")}</span>
              <span className="block font-semibold">{t("overviewH2")}</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
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
          style={{ background: `linear-gradient(to bottom, ${ORANGE}, rgba(236,114,0,0))` }}
        />
      </div>
    </section>
  );
}
