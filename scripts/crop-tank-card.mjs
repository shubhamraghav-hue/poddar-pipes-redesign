/**
 * Crops a tank studio photo for the TANKS category card, and tells you what
 * the result will actually do on the card — including whether the hover lift
 * will clip the lids.
 *
 *   node scripts/crop-tank-card.mjs "<source.png>"                 # defaults
 *   node scripts/crop-tank-card.mjs "<source.png>" 720             # zoom
 *   node scripts/crop-tank-card.mjs "<source.png>" 720 --right 0.88
 *   node scripts/crop-tank-card.mjs "<source.png>" --all           # whole set
 *   node scripts/crop-tank-card.mjs "<source.png>" --table         # no files
 *   node scripts/crop-tank-card.mjs "<new.png>" --rect 666,867,660,421 --out tank-card-z660.png
 *
 * `--rect L,T,W,H` skips detection and uses that exact rectangle. Use it when
 * a re-shot arrives that must land in EXACTLY the framing already shipped —
 * re-detecting can shift the crop by a pixel or two, which is fine for a new
 * look but not when the brief is "same placement, new background".
 *
 * ALWAYS pass `--tag <token>` when the SOURCE PHOTO changes, so the outputs
 * get new filenames (`tank-card-g2-z660.png`). Next's image optimiser caches
 * by source PATH: overwrite a file in place and it keeps serving the old
 * bytes. Deleting `.next/cache/images` does NOT clear it — verified by
 * sampling the served pixels, which still came back as the previous
 * background gradient. A new filename is the only reliable fix.
 *
 * TWO KNOBS, and they do separate things:
 *
 *   ZOOM  (bare number, px)  crop WIDTH. SMALLER = more zoomed = BIGGER tanks
 *                            and less empty card. 620 (huge) .. 1000 (small).
 *   --right <0-1>            where the tanks' RIGHT edge lands across the
 *                            frame. 0.92 = tucked into the right corner
 *                            (current), 0.75 = nearer the middle.
 *                            Works with --all, unlike the old positional.
 *
 * Why a crop and not `object-position`: the output is cut to the photo box's
 * own aspect ratio (1.5686:1), so `object-cover` has nothing left to trim and
 * `photoPos` in ProductCategories.tsx is inert. The crop rectangle IS the
 * framing control.
 *
 * The vertical placement is not a knob — it is derived. The tanks are pushed
 * down to sit FLOOR px above the bottom, because hover hides the top of the
 * box and every pixel of headroom is wasted space that pushes the lids into
 * the hidden band.
 *
 * The tank bounding box is detected, not hardcoded, so this works on any
 * future tank photo: tanks are near-white and neutral, while the navy
 * backdrop is blue-dominant (b - r is large). That distinction is most of the
 * trick — keying on brightness alone catches the light shaft and reports a
 * wildly oversized box.
 *
 * It is not quite enough on its own, though. On the first shot the backdrop
 * measured b-r ~ +42, so the shaft failed the neutrality test comfortably.
 * A later re-shot changed the background gradient to something much less
 * blue (b-r ~ +24); the shaft went near-white, passed the test, and the
 * detected box came back 657px wide instead of 323px. Hence SKIP_TOP: the
 * tanks stand on the floor, so the upper part of the frame — the only place
 * the shaft is bright enough to be mistaken for white plastic — is excluded
 * outright. Verified to give the same box on both shots to within 1px.
 */
import sharp from "sharp";
import path from "node:path";

// Card geometry, from ProductCategories.tsx. Change only if the card changes.
const BOX_ASPECT = 400 / 255; // photo box is 400x255 on a 400x375 card
const HOVER_HIDDEN = 0.225 / 0.6375; // hover lifts 22.5cqw over a 63.75cqw box
const FLOOR = 10; // source px of floor left under the bases
const SKIP_TOP = 0.4; // ignore the top 40% — see the note above
const OUT_DIR = "public/products/category-cards";

const SET = [1000, 900, 850, 820, 800, 780, 750, 720, 700, 660, 620];

async function tankBox(src) {
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const col = new Array(width).fill(0);
  const row = new Array(height).fill(0);
  const yStart = Math.floor(height * SKIP_TOP);
  for (let y = yStart; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if ((r + g + b) / 3 > 205 && b - r < 12) {
        col[x]++;
        row[y]++;
      }
    }
  }
  const cT = (height - yStart) * 0.02, rT = width * 0.02;
  const x0 = col.findIndex((v) => v > cT);
  const x1 = width - 1 - [...col].reverse().findIndex((v) => v > cT);
  const y0 = row.findIndex((v) => v > rT);
  const y1 = height - 1 - [...row].reverse().findIndex((v) => v > rT);
  if (x0 < 0 || y0 < 0) throw new Error("No tanks found — is this the right photo?");
  return { imgW: width, imgH: height, x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 };
}

function plan(box, zoom, right) {
  const cropW = Math.round(zoom);
  const cropH = Math.round(cropW / BOX_ASPECT);
  const left = Math.round(box.x1 - right * cropW);
  const top = Math.round(box.y1 + FLOOR - cropH);
  const band = HOVER_HIDDEN * cropH; // hidden top strip
  const tankTopInCrop = box.y0 - top;
  const clip = Math.max(0, band - tankTopInCrop);
  return {
    cropW, cropH, left, top,
    heightShare: (box.h / cropH) * 100,
    widthShare: (box.w / cropW) * 100,
    clipOnCard: (clip * 400) / cropW,
    fits: left >= 0 && top >= 0 && left + cropW <= box.imgW && top + cropH <= box.imgH,
  };
}

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/crop-tank-card.mjs "<source.png>" [zoom] [--right 0-1] [--all]');
  process.exit(1);
}
const args = process.argv.slice(3);
const all = args.includes("--all");
const tableOnly = args.includes("--table");
const rectArg = args[args.indexOf("--rect") + 1];
const outArg = args[args.indexOf("--out") + 1];
const tagArg = args.indexOf("--tag") >= 0 ? args[args.indexOf("--tag") + 1] : null;
const TAG = tagArg ? `-${tagArg}` : "";

// --rect bypasses detection entirely: exact reproduction of a shipped framing.
if (args.includes("--rect")) {
  const [left, top, width, height] = rectArg.split(",").map(Number);
  const name = outArg || `tank-card-rect-${width}.png`;
  await sharp(src)
    .extract({ left, top, width, height })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, name));
  console.log(`wrote ${name} from the exact rect ${left},${top},${width},${height}`);
  console.log(`crop aspect ${(width / height).toFixed(5)} vs photo box ${BOX_ASPECT.toFixed(5)}`);
  process.exit(0);
}

// `--right` is a NAMED flag on purpose. It used to be a second positional,
// which made `--all 0.80` silently mean "zoom 0.80" (ignored under --all)
// while placement stayed on its default — the crops came out in a different
// position than the command claimed, with nothing to hint at it.
const rightArg = args.indexOf("--right") >= 0 ? Number(args[args.indexOf("--right") + 1]) : null;
const nums = args
  .filter((a) => !a.startsWith("--") && a !== rectArg && a !== outArg && a !== tagArg && a !== String(rightArg))
  .map(Number);
const zoom = nums[0] || 750;
const right = rightArg ?? 0.92;
if (rightArg !== null && !(rightArg > 0 && rightArg <= 1)) {
  console.error(`--right must be between 0 and 1 (got ${rightArg})`);
  process.exit(1);
}
if (nums.some((n) => n > 0 && n <= 1)) {
  console.error(
    `Refusing to run: ${nums.find((n) => n <= 1)} looks like a placement value passed positionally.\n` +
      `Use --right ${nums.find((n) => n <= 1)} instead; a bare number is the zoom (crop width in px).`
  );
  process.exit(1);
}

const box = await tankBox(src);
console.log(`source ${path.basename(src)}  ${box.imgW}x${box.imgH}`);
console.log(`tanks  x ${box.x0}-${box.x1}  y ${box.y0}-${box.y1}  (${box.w}x${box.h})\n`);

const zooms = all || tableOnly ? SET : [zoom];
console.log("  zoom | tank height  | tank width  | lid clip on hover | file");
console.log("  -----|--------------|-------------|-------------------|-----");
for (const z of zooms) {
  const p = plan(box, z, right);
  const name = `tank-card${TAG}-z${z}.png`.replace("card--", "card-");
  if (!p.fits) {
    console.log(`  ${String(z).padStart(4)} | crop falls outside the photo — try a different RIGHT value`);
    continue;
  }
  if (!tableOnly) {
    await sharp(src)
      .extract({ left: p.left, top: p.top, width: p.cropW, height: p.cropH })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, name));
  }
  console.log(
    `  ${String(z).padStart(4)} |` +
      ` ${(p.heightShare.toFixed(1) + "% of box").padStart(12)} |` +
      ` ${(p.widthShare.toFixed(1) + "% wide").padStart(11)} |` +
      ` ${(p.clipOnCard > 0.5 ? p.clipOnCard.toFixed(0) + "px" : "none").padStart(17)} |` +
      ` ${tableOnly ? "(not written)" : name}`
  );
}

console.log(`
Now point the TANKS entry in components/home/ProductCategories.tsx at the file
you want:

    photo: "/products/category-cards/tank-card-z750.png",
    photoPos: "50% 50%",           // inert — leave it alone

Save, and the dev server hot-reloads. "lid clip" is how much of the tank tops
the hover lift cuts off; anything up to ~30px has been considered acceptable
before, and "none" means the lids survive hover completely.`);
