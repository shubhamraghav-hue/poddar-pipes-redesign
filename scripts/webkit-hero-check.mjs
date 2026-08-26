// Renders the Hero in Playwright's WebKit build — the closest thing to
// Safari available on Windows — and diffs it against Chromium, reporting
// the geometry that the iOS mask bug actually affected.
//
//   node scripts/webkit-hero-check.mjs [url] [outDir]
//
// Defaults: url http://localhost:3000, outDir the current directory.
//
// CAVEAT worth remembering before trusting a green run: Playwright's
// WebKit uses a different graphics backend than Apple's, so GPU
// COMPOSITING bugs (the class behind the mask-on-<video> failure this
// script was written for) may not reproduce here even when they do on a
// real iPhone. This is reliable for "does this CSS apply at all", not for
// "is the compositor happy". A real device remains the final word.

import { chromium, webkit, devices } from "@playwright/test";
import path from "node:path";

const url = process.argv[2] || "http://localhost:3000";
const outDir = process.argv[3] || process.cwd();
// Optional 4th arg: a viewport width. Without it the run emulates an
// iPhone 13; with it the run uses a plain desktop context at that width,
// which is how to exercise the `md:`+ breakpoints in WebKit.
const width = process.argv[4] ? Number(process.argv[4]) : null;
const ctxOpts = width
  ? { viewport: { width, height: 950 } }
  : { ...devices["iPhone 13"] };

async function measure(page) {
  return page.evaluate(() => {
    const section = document.querySelector("section");
    const video = section.querySelector("video");
    const wrapper = video?.parentElement;
    const card = section.querySelector('[class*="aspect-"]');
    const g = (el) => (el ? getComputedStyle(el) : null);
    const r = (el) => (el ? el.getBoundingClientRect() : null);

    // Reading these back reveals whether the engine ACCEPTED the value —
    // an unsupported property resolves to "none"/"" rather than erroring.
    const inlineMasked = [...section.querySelectorAll('[style*="mask"]')].map((el) => ({
      cls: el.className.slice(0, 40),
      webkit: getComputedStyle(el).webkitMaskImage?.slice(0, 40) ?? "(unsupported)",
      std: getComputedStyle(el).maskImage?.slice(0, 40) ?? "(unsupported)",
    }));

    return {
      videoSrc: video?.currentSrc?.split("/").pop() ?? "(no video)",
      videoPlaying: video ? !video.paused : null,
      videoHeight: g(video)?.height,
      videoObjectPosition: g(video)?.objectPosition,
      videoMask: g(video)?.maskImage,
      wrapperHeight: g(wrapper)?.height,
      wrapperOverflow: g(wrapper)?.overflow,
      // The number that was visibly wrong on iOS: where the video's
      // painted bottom edge lands relative to the first stat card.
      clearanceBeforeFirstCard:
        card && wrapper ? +(r(card).top - r(wrapper).bottom).toFixed(2) : null,
      inlineMasked,
    };
  });
}

async function run(browserType, label, file) {
  const browser = await browserType.launch();
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForSelector("section video", { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(2500); // let autoplay / poster swap settle
  await page.evaluate(() => window.scrollTo(0, 0));

  const data = await measure(page);
  const out = path.join(outDir, file);
  await page.screenshot({ path: out });

  console.log(`\n===== ${label} =====`);
  console.log(JSON.stringify(data, null, 2));
  if (errors.length) console.log("page errors:", errors);
  console.log(`screenshot -> ${out}`);

  await browser.close();
  return data;
}

const wk = await run(webkit, "WebKit (Safari engine)", "hero-webkit.png");
const cr = await run(chromium, "Chromium (baseline)", "hero-chromium.png");

console.log("\n===== DIFF =====");
let differs = 0;
for (const k of Object.keys(wk)) {
  const a = JSON.stringify(wk[k]);
  const b = JSON.stringify(cr[k]);
  if (a !== b) {
    differs++;
    console.log(`DIFFERS  ${k}\n   webkit: ${a}\n   chrome: ${b}`);
  }
}
if (!differs) console.log("No differences — WebKit and Chromium agree on every measured value.");
