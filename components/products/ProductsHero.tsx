import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/**
 * /products opener — Figma "CPVC Products Page - 2nd draft" > hero (node
 * 1731:7625): 1512x760 navy band under the navbar, the client's blue-wave
 * backdrop, copy at x150/y280, and on the right the
 * product cluster standing in an orange U that hangs from the top edge.
 *
 * The art (the cluster + the U) is ONE box drawn at the mock's 582x760 — from
 * the cluster's left edge (x780) to the U's right edge (x1362) — and every
 * piece inside it is a percentage of that box, so it scales as a unit:
 *
 *   U        x+102, y0, 480x560, 6px #f28000, open at the top
 *   cluster  x0, bottom 0, 514x680, image 106.48% wide from -1.14% (the
 *            mock's navy drop-shadow is left off: it darkened the backdrop)
 *
 * ≥ lg it sits flush right of the 1212 column and bottom-aligned, capped at
 * whatever the 60px heading (~530 wide) leaves, so it keeps 30px clear of
 * it down to 1024. Below `lg` (no
 * frames exist) it drops under the copy, centred, still bottom-flush.
 *
 * From `lg` the U's sides run on up past the box to the band's top edge, so
 * it still hangs from the top when the art is scaled down.
 */
export async function ProductsHero({
  /** "h2" on /products and the range URLs, whose H1 is the range name. */
  headingAs: Heading = "h1",
}: { headingAs?: "h1" | "h2" } = {}) {
  const t = await getTranslations("products");
  return (
    <section className="relative mt-20 overflow-hidden bg-[#0b0b52] lg:h-[760px]">
      {/* The client's backdrop (2026-10-12), 1512x760 — the band's exact size
          at 1512 — served as-is (`unoptimized`: no re-encode) with no
          overlay. Taller bands below `lg` crop it from the bottom. */}
      <Image
        src="/products/hero/hero-bg.webp"
        alt=""
        fill
        priority
        unoptimized
        className="pointer-events-none object-cover object-bottom"
      />

      <div className="container-figma relative flex h-full flex-col lg:block">
        <div className="relative z-10 pt-24 md:pt-[150px] lg:pt-[280px]">
          <RevealOnScroll>
            <Heading className="font-display type-hero uppercase text-white">
              <span className="block font-light">{t("heroLine1")}</span>
              <span className="block font-bold">{t("heroBold")}</span>
            </Heading>
          </RevealOnScroll>
          <RevealOnScroll delay={0.08}>
            <p className="mt-5 max-w-[398px] type-body text-white md:mt-7">
              {t("heroDesc")}
            </p>
          </RevealOnScroll>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto mt-10 aspect-[582/760] w-[min(582px,88vw)] md:mt-14 lg:absolute lg:bottom-0 lg:right-10 lg:mt-0 lg:w-[min(582px,calc(100vw-640px))] xl:right-[150px] xl:w-[min(582px,calc(100vw-860px))]"
        >
          {/* The orange U only exists in the side-by-side layout: once the
              title stacks above the photo (below `lg`) it is gone (client
              deck 2026-10-22, slide 2246:15511). */}
          <div className="absolute bottom-[26.32%] left-[17.53%] top-[-1000px] hidden w-[82.47%] rounded-b-[1000px] border-x-[6px] border-b-[6px] border-[#f28000] lg:block" />
          <div className="absolute bottom-0 left-0 h-[89.47%] w-[88.32%]">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/products/hero/hero-cluster.webp"
                alt=""
                width={1095}
                height={1360}
                priority
                sizes="(min-width: 1024px) 548px, 94vw"
                className="absolute left-[-1.14%] top-0 h-[100.01%] w-[106.48%] max-w-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
