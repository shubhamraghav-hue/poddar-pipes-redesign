// Renders the Hero in BOTH engines at several widths and builds a side-by-side
// HTML report, so "does Safari match Chromium?" can be answered by looking
// rather than by reading numbers.
//
//   node scripts/compare-engines.mjs [baseUrl]
//   -> build/engine-compare/index.html
//
// Chromium is the REFERENCE: it gets the VP9/WebM with a real alpha channel,
// which is the Figma-intended rendering (pipe overlapping the stat cards).
// WebKit is the SUBJECT: it gets the H.264 MP4, which has no alpha. The goal
// is for the two columns to become indistinguishable.
//
// The metric that matters is `overlapIntoCards` (= wrapper.bottom - card.top):
// how far the video's painted bottom edge reaches over the first stat card.
// POSITIVE means it overlaps; negative means it stops short by that much.
//   Chromium (correct):  +24  → 24px of pipe hangs over the card, as designed
//   WebKit  (stopgap):     0  → video stops dead at the card's top edge
//   both at 375px:       -40  → clipped well clear of the cards (mobile, matches)
// When the two columns report the same number, the fix is done.

import { chromium, webkit } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "build", "engine-compare");
const base = process.argv[2] || "http://localhost:3000";

const WIDTHS = [
  { w: 375, label: "375 · iPhone" },
  { w: 768, label: "768 · iPad portrait (md boundary)" },
  { w: 1024, label: "1024 · iPad landscape" },
  { w: 1280, label: "1280 · laptop" },
  { w: 1640, label: "1640 · desktop" },
];

const ENGINES = [
  { name: "chromium", type: chromium, role: "REFERENCE (WebM + alpha)" },
  { name: "webkit", type: webkit, role: "SUBJECT (Safari engine)" },
];

await fs.mkdir(outDir, { recursive: true });

async function shoot(engine, width) {
  const browser = await engine.type.launch();
  const ctx = await browser.newContext({ viewport: { width, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForSelector("section video", { timeout: 20_000 }).catch(() => {});
  // Give autoplay a beat; the poster-vs-video swap changes what is painted.
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));

  const data = await page.evaluate(() => {
    const section = document.querySelector("section");
    const video = section.querySelector("video");
    const wrapper = video?.parentElement;
    const card = section.querySelector('[class*="aspect-"]');
    if (!wrapper || !card) return null;
    const wr = wrapper.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    return {
      src: video.currentSrc.split("/").pop(),
      playing: !video.paused,
      videoBox: +getComputedStyle(video).height.replace("px", "") || null,
      wrapperBox: +getComputedStyle(wrapper).height.replace("px", "") || null,
      overlapIntoCards: +(wr.bottom - cr.top).toFixed(1),
    };
  });

  const file = `${engine.name}-${width}.png`;
  const section = await page.$("section");
  await section.screenshot({ path: path.join(outDir, file) });
  await browser.close();
  return { file, data };
}

const rows = [];
for (const { w, label } of WIDTHS) {
  const shots = {};
  for (const e of ENGINES) {
    process.stdout.write(`rendering ${e.name} @ ${w}...\n`);
    shots[e.name] = await shoot(e, w);
  }
  const a = shots.chromium.data, b = shots.webkit.data;
  const match = a && b && a.overlapIntoCards === b.overlapIntoCards;
  rows.push({ w, label, shots, match });
}

const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
const cell = (s) =>
  !s.data
    ? `<div class="meta bad">could not measure</div>`
    : `<div class="meta"><b>${esc(s.data.src)}</b>${s.data.playing ? "" : " · <span class='bad'>not playing</span>"}<br>
       video ${s.data.videoBox}px · painted ${s.data.wrapperBox}px<br>
       overlap into cards: <b>${s.data.overlapIntoCards}px</b></div>`;

const html = `<!doctype html><meta charset="utf-8">
<title>Hero — Safari vs Chromium</title>
<style>
 :root{--bg:#0e1016;--panel:#171a22;--line:#262a35;--txt:#e8eaf0;--mut:#8b91a3;--ok:#3ddc84;--bad:#ff6b6b}
 body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
 header{padding:20px 24px;border-bottom:1px solid var(--line);background:var(--panel)}
 h1{margin:0 0 6px;font-size:19px}
 .sub{color:var(--mut);max-width:80ch}
 section.row{padding:22px 24px;border-bottom:1px solid var(--line)}
 h2{font-size:15px;margin:0 0 4px}
 .verdict{font-weight:700;font-size:13px;margin-bottom:12px}
 .ok{color:var(--ok)} .bad{color:var(--bad)}
 .pair{display:grid;grid-template-columns:1fr 1fr;gap:18px}
 figure{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden}
 figcaption{padding:9px 12px;border-bottom:1px solid var(--line);font-weight:600;font-size:13px}
 figcaption small{display:block;font-weight:400;color:var(--mut)}
 img{display:block;width:100%;height:auto}
 .meta{padding:9px 12px;color:var(--mut);font-size:12px;border-top:1px solid var(--line);font-variant-numeric:tabular-nums}
 code{background:#12151d;border:1px solid var(--line);border-radius:4px;padding:1px 5px;font-size:12px}
</style>
<header>
 <h1>Hero — Safari (WebKit) vs Chromium</h1>
 <div class="sub">Chromium is the reference: it decodes the WebM's real alpha, giving Figma's intended
 pipe-over-card overlap. WebKit gets the H.264 MP4, which carries no alpha. <b>The goal is for both columns
 to look identical.</b> The number to watch is <code>overlap into cards</code> (positive = the pipe hangs
 over the card, which is what Figma wants). At <code>md</code> and above it should read <code>24px</code> on
 both; <code>0px</code> means the video is being clipped short to hide an opaque rectangle, which visibly
 slices the pipe. At 375px both correctly read <code>-40px</code> — mobile deliberately clips clear of the
 cards, and the engines already agree there.</div>
</header>
${rows
  .map(
    (r) => `<section class="row">
  <h2>${esc(r.label)}</h2>
  <div class="verdict ${r.match ? "ok" : "bad"}">${
      r.match ? "✓ engines match" : "✗ differ — Safari is not yet reproducing the reference"
    }</div>
  <div class="pair">
    ${ENGINES.map(
      (e) => `<figure>
        <figcaption>${e.name}<small>${esc(e.role)}</small></figcaption>
        <img src="${r.shots[e.name].file}" alt="${e.name} at ${r.w}px">
        ${cell(r.shots[e.name])}
      </figure>`
    ).join("")}
  </div>
</section>`
  )
  .join("")}
`;

await fs.writeFile(path.join(outDir, "index.html"), html, "utf8");
console.log(`\nReport: ${path.join(outDir, "index.html")}`);
for (const r of rows) {
  console.log(
    `${String(r.w).padStart(5)}px  chromium ${String(r.shots.chromium.data?.overlapIntoCards).padStart(6)}  ` +
      `webkit ${String(r.shots.webkit.data?.overlapIntoCards).padStart(6)}  ${r.match ? "MATCH" : "differ"}`
  );
}
