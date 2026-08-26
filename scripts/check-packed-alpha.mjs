// Measures the alpha-packed WebGL prototype in BOTH engines.
// Correct output = pipes opaque, gaps magenta -> backdrop somewhere in a band,
// never ~0% (opaque) and never ~100% (nothing painted).
import { chromium, webkit } from "@playwright/test";
import sharp from "sharp";

const base = process.argv[2] || "http://localhost:3000";
const srcParam = process.argv[3] ? `?src=${encodeURIComponent(process.argv[3])}` : "";
const BG = { r: 255, g: 0, b: 255 };
const isBg = (r, g, b) =>
  Math.abs(r - BG.r) < 40 && Math.abs(g - BG.g) < 40 && Math.abs(b - BG.b) < 40;

for (const [name, type] of [["webkit", webkit], ["chromium", chromium]]) {
  const browser = await type.launch();
  const page = await (await browser.newContext({ viewport: { width: 900, height: 500 } })).newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 140)));

  await page.goto(`${base}/_alpha-packed-test.html${srcParam}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);

  const state = await page.evaluate(() => {
    const v = document.getElementById("v");
    const e = document.getElementById("err");
    return {
      ready: !!window.__packedReady,
      rs: v.readyState,
      w: v.videoWidth,
      h: v.videoHeight,
      paused: v.paused,
      mediaError: v.error ? v.error.code : null,
      visibleError: e && e.style.display === "block" ? e.textContent : null,
    };
  });

  const png = await page.screenshot();
  await sharp(png).toFile(`packed-${name}.png`);
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  let bg = 0, total = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    total++;
    if (isBg(data[i], data[i + 1], data[i + 2])) bg++;
  }
  const pct = +((bg / total) * 100).toFixed(1);
  const verdict =
    pct > 95 ? "INVISIBLE â€” nothing painted"
    : pct < 5 ? "OPAQUE â€” no transparency"
    : "*** TRANSPARENCY WORKS ***";

  console.log(`${name.padEnd(9)} video ${state.w}x${state.h} rs=${state.rs} ` +
              `err=${state.mediaError} drawn=${state.ready}  ${String(pct).padStart(5)}% backdrop  ${verdict}`);
  if (state.visibleError) console.log(`          page error: ${state.visibleError}`);
  if (errs.length) console.log("          " + errs.slice(0, 3).join(" | "));
  await browser.close();
}

