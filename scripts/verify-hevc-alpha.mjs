// Verifies whether a video's alpha channel actually survives decoding in
// WebKit — the engine that has to get this right for Safari/iOS.
//
//   node scripts/verify-hevc-alpha.mjs [baseUrl]
//
// WHY NOT ffmpeg: ffmpeg's HEVC decoder returns an all-0xFF alpha plane no
// matter what the file really contains, so it cannot tell a correct alpha
// encode from an opaque one.
//
// WHY NOT canvas: the obvious approach — drawImage the video and read the
// alpha bytes — silently fails in Playwright's WebKit on Windows. It reports
// success while drawing nothing, which makes an OPAQUE video look 100%
// transparent. That false pass is worse than no test, so this uses a
// screenshot instead: the video is laid over a loud magenta backdrop and the
// composited output is sampled. Magenta showing through == real transparency.
//
// Playwright's WebKit uses a different media backend than Apple's, so treat
// a pass here as strong evidence, not proof. A real iPhone is final.

import { webkit } from "@playwright/test";
import sharp from "sharp";

const base = process.argv[2] || "http://localhost:3000";
const BG = { r: 255, g: 0, b: 255 }; // magenta: nothing in the footage is near it

const CASES = [
  { label: "HEVC+alpha .mp4", src: "/hero/hero-fittings-alpha.mp4", expect: "transparent" },
  { label: "H.264 (opaque control)", src: "/hero/hero-fittings.mp4", expect: "opaque" },
];

const isBg = (r, g, b) =>
  Math.abs(r - BG.r) < 40 && Math.abs(g - BG.g) < 40 && Math.abs(b - BG.b) < 40;

const browser = await webkit.launch();
const page = await (await browser.newContext({ viewport: { width: 640, height: 360 } })).newPage();

console.log("\nWebKit alpha probe (screenshot-based)\n" + "=".repeat(64));

for (const c of CASES) {
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.setContent(`
    <style>html,body{margin:0;height:100%}
      body{background:rgb(${BG.r},${BG.g},${BG.b})}
      video{position:fixed;inset:0;width:100%;height:100%;object-fit:cover}</style>
    <video id=v src="${base}${c.src}" muted playsinline autoplay loop></video>
  `);

  const state = await page.evaluate(async () => {
    const v = document.getElementById("v");
    // A missing element must not throw out of the evaluate — a file that
    // simply is not there should report cleanly, not crash the whole run.
    if (!v) return { ok: false, error: "video element not created", w: 0, readyState: 0 };
    try {
      await new Promise((res, rej) => {
        if (v.readyState >= 2) return res();
        v.addEventListener("loadeddata", res, { once: true });
        v.addEventListener("error", () => rej(new Error("decode/load error")), { once: true });
        setTimeout(() => rej(new Error("load timeout")), 20000);
      });
      await v.play().catch(() => {});
      await new Promise((r) => setTimeout(r, 1200));
      return { ok: true, w: v.videoWidth, h: v.videoHeight, readyState: v.readyState };
    } catch (e) {
      return { ok: false, error: String(e.message || e), w: v.videoWidth || 0, readyState: v.readyState };
    }
  });

  if (!state.ok || !state.w) {
    console.log(`${c.label.padEnd(24)} CANNOT DECODE — ${state.error || "videoWidth 0"}`);
    continue;
  }

  const png = await page.screenshot();
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  let bg = 0, total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    total++;
    if (isBg(data[i], data[i + 1], data[i + 2])) bg++;
  }
  const pct = +((bg / total) * 100).toFixed(1);
  const verdict =
    c.expect === "opaque"
      ? pct < 1
        ? "correct (fully opaque, as expected)"
        : "UNEXPECTED — control leaked background"
      : pct > 15
        ? "*** ALPHA WORKS IN WEBKIT ***"
        : "NO ALPHA — decodes opaque";

  console.log(
    `${c.label.padEnd(24)} ${String(state.w)}x${state.h}  ${String(pct).padStart(5)}% backdrop  ${verdict}`
  );
}

await browser.close();
console.log(
  "\nControl must read ~0%. If the control is not ~0%, the harness is broken and\n" +
  "the other rows mean nothing. A real iPhone remains the final confirmation."
);
