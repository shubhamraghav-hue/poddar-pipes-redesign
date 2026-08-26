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
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = process.argv[2] || "http://localhost:3000";
const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "build");
await fs.mkdir(outDir, { recursive: true });
const BG = { r: 255, g: 0, b: 255 }; // magenta: nothing in the footage is near it

const CASES = [
  { label: "HEVC+alpha .mp4", src: "/hero/hero-fittings-alpha.mp4", expect: "transparent" },
  { label: "H.264 (opaque control)", src: "/hero/hero-fittings.mp4", expect: "opaque" },
];

const isBg = (r, g, b) =>
  Math.abs(r - BG.r) < 40 && Math.abs(g - BG.g) < 40 && Math.abs(b - BG.b) < 40;

const browser = await webkit.launch();

console.log("\nWebKit alpha probe (screenshot-based)\n" + "=".repeat(64));

for (const c of CASES) {
  // A FRESH page per case: reusing one page let a failed/timed-out case leave
  // the next one without a video element, which silently invalidated the
  // control row — and a run whose control did not execute proves nothing.
  const ctx = await browser.newContext({ viewport: { width: 640, height: 360 } });
  const page = await ctx.newPage();

  // The probe page is SERVED FROM THE APP'S OWN ORIGIN via interception,
  // rather than injected. Two earlier approaches both failed:
  //   - goto(app) then setContent: Next's hydration re-rendered over the
  //     injected markup and destroyed the <video> ("element not created").
  //   - setContent on about:blank: the document has an opaque origin and the
  //     http:// media subresource never loaded, hanging the probe.
  // Intercepting one made-up same-origin path avoids both, and keeps React
  // entirely out of the picture.
  const probeUrl = `${base}/__alpha-probe`;
  await page.route(probeUrl, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: `<!doctype html><meta charset="utf-8">
        <style>html,body{margin:0;height:100%}
          body{background:rgb(${BG.r},${BG.g},${BG.b})}
          video{position:fixed;inset:0;width:100%;height:100%;object-fit:cover}</style>
        <video id="v" src="${c.src}" muted playsinline autoplay loop></video>`,
    })
  );
  // domcontentloaded, not 'load': 'load' waits on the video resource itself,
  // and a multi-MB autoplaying clip can hold it open indefinitely.
  await page.goto(probeUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

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
      // Race play() against a timer. WebKit can return a play() promise that
      // never settles, and awaiting it bare hung this probe indefinitely —
      // there is no outer timeout on this path to rescue it.
      await Promise.race([
        v.play().catch(() => {}),
        new Promise((r) => setTimeout(r, 3000)),
      ]);
      await new Promise((r) => setTimeout(r, 1200));
      return {
        ok: true,
        w: v.videoWidth,
        h: v.videoHeight,
        readyState: v.readyState,
        mediaError: v.error ? v.error.code : null,
      };
    } catch (e) {
      return { ok: false, error: String(e.message || e), w: v.videoWidth || 0, readyState: v.readyState };
    }
  });

  if (!state.ok || !state.w) {
    console.log(`${c.label.padEnd(24)} CANNOT DECODE — ${state.error || "videoWidth 0"}`);
    await ctx.close();
    continue;
  }
  // MediaError 3 = MEDIA_ERR_DECODE. The element can report correct dimensions
  // from the container while the decoder has actually rejected the stream, so
  // dimensions alone are not proof the video is usable.
  if (state.mediaError) {
    console.log(
      `${c.label.padEnd(24)} DECODE ERROR (MediaError ${state.mediaError}) — file rejected by WebKit`
    );
    await ctx.close();
    continue;
  }

  const png = await page.screenshot();
  // Always keep the frame that was measured. A bare percentage cannot
  // distinguish "correctly transparent in the gaps" from "painted nothing at
  // all" — both look like a high backdrop score. Eyes on the image settle it.
  const shotPath = path.join(outDir, `probe-${c.src.split("/").pop()}.png`);
  await fs.writeFile(shotPath, png);
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  let bg = 0, total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    total++;
    if (isBg(data[i], data[i + 1], data[i + 2])) bg++;
  }
  const pct = +((bg / total) * 100).toFixed(1);
  // A plain "> 15% backdrop" test is NOT sufficient and previously passed a
  // completely invisible video: 100% backdrop means nothing painted at all,
  // which is a failure, not perfect transparency. Correct alpha must leave the
  // pipes OPAQUE, so the backdrop has to land in a band — some shows through,
  // plenty does not.
  const verdict =
    c.expect === "opaque"
      ? pct < 1
        ? "correct (fully opaque, as expected)"
        : "UNEXPECTED — control leaked background"
      : pct > 95
        ? "INVISIBLE — nothing painted (decode failure or all-zero alpha)"
        : pct >= 10
          ? "*** ALPHA WORKS IN WEBKIT ***"
          : "NO ALPHA — decodes opaque";

  console.log(
    `${c.label.padEnd(24)} ${String(state.w)}x${state.h}  ${String(pct).padStart(5)}% backdrop  ${verdict}`
  );
  await ctx.close();
}

await browser.close();
console.log(
  "\nControl must read ~0%. If the control is not ~0%, the harness is broken and\n" +
  "the other rows mean nothing. A real iPhone remains the final confirmation."
);
