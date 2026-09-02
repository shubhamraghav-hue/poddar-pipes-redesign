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
 * THREE KNOBS, and they do separate things:
 *
 *   ZOOM  (bare number, px)  crop WIDTH. SMALLER = more zoomed = BIGGER tanks
 *                            and less empty card. 620 (huge) .. 1000 (small).
 *   --right <0-1>            where the tanks' RIGHT edge lands across the
 *                            frame. 0.92 = tucked into the right corner
 *                            (current), 0.75 = nearer the middle.
 *                            Works with --all, unlike the old positional.
 *   --slack <px>             Vertical SLACK: extra crop height beyond the
 *                            frame's aspect ratio. This is what makes
 *                            `photoPos` live — with slack 0 the crop exactly
 *                            fills the frame and object-cover has nothing to
 *                            slide. Default 100.
 *   --floor <px>             px of floor left under the bases at photoPos
 *                            Y = 0%. Default 10. For UPLIFT prefer photoPos Y
 *                            in the component — it needs no regeneration.
 *
 * Division of labour: this script sets the ZOOM and the HORIZONTAL framing,
 * which are baked into the file. VERTICAL placement stays editable in
 * ProductCategories.tsx via `photoPos` Y, which is what --slack exists to
 * enable — the crop is cut taller than the frame so object-cover has overflow
 * to slide through. `photoPos` X does nothing: object-cover consumes the full
 * width, so there is never horizontal overflow.
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

// Card geometry, from ProductCategories.tsx.
// Card is 400x375, so its height is 0.9375 x its width. The photo box is
// BOX_PCT of that height, and hover lifts a fixed 22.5cqw over it.
const CARD_W = 400;
const CARD_H_RATIO = 375 / 400;
const BOX_PCT = 68; // constant for every card — see ProductCategories.tsx
const BOX_H_IN_CARD_W = (BOX_PCT / 100) * CARD_H_RATIO; // box height / card width
const BOX_ASPECT = 1 / BOX_H_IN_CARD_W;
const HOVER_HIDDEN = 0.225 / BOX_H_IN_CARD_W;
const FLOOR_DEFAULT = 10; // source px of floor left under the bases
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

function plan(box, zoom, right, floor, slack) {
  const cropW = Math.round(zoom);
  const frameH = Math.round(cropW / BOX_ASPECT); // what the frame actually shows
  const cropH = frameH + slack;                  // taller, so photoPos can slide
  const left = Math.round(box.x1 - right * cropW);
  // Anchoring the crop bottom below the bases by floor+slack keeps the tanks'
  // position at photoPos Y = 0% identical to a slack-free crop, so adding
  // slack only ever ADDS upward travel — it never shifts the baseline.
  const top = Math.round(box.y1 + floor + slack - cropH);
  const toCard = 400 / cropW;
  const band = HOVER_HIDDEN * frameH;            // hover-hidden strip, crop px
  const tankTop = frameH - box.h - floor;        // tank top at Y = 0%
  // photoPos Y slides the visible window DOWN the crop, which lifts the tanks
  // UP the frame. Past tankTop/slack the lids leave the frame even at rest.
  const maxY = slack > 0 ? Math.min(1, tankTop / slack) : 0;
  const clipAt = (y) => Math.max(0, y * slack + band - tankTop) * toCard;
  return {
    cropW, cropH, frameH, left, top, slack,
    heightShare: (box.h / frameH) * 100,
    widthShare: (box.w / cropW) * 100,
    clipOnCard: clipAt(0),
    maxYPct: maxY * 100,
    clipAtMaxY: clipAt(maxY),
    upliftAtMaxY: maxY * slack * toCard,
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
// NOTE the index guards. `args[args.indexOf("--x") + 1]` reads args[0] when
// the flag is ABSENT (indexOf returns -1), which silently swallowed the bare
// zoom argument as if it were a --rect value.
const flagVal = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const rectArg = flagVal("--rect");
const outArg = flagVal("--out");
const tagArg = flagVal("--tag");
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
const floorRaw = flagVal("--floor");
const rightRaw = flagVal("--right");
const rightArg = rightRaw === null ? null : Number(rightRaw);
const FLAGS_WITH_VALUES = ["--rect", "--out", "--tag", "--right", "--floor", "--slack"];
const valueIndexes = new Set(
  FLAGS_WITH_VALUES.map((f) => args.indexOf(f)).filter((i) => i >= 0).map((i) => i + 1)
);
const nums = args
  .filter((a, i) => !a.startsWith("--") && !valueIndexes.has(i))
  .map(Number);
const zoom = nums[0] || 750;
const right = rightArg ?? 0.92;
const floor = floorRaw === null ? FLOOR_DEFAULT : Number(floorRaw);
const slackRaw = flagVal("--slack");
const slack = slackRaw === null ? 100 : Number(slackRaw);
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
console.log(
  `frame ${BOX_PCT}% of card height, constant for all six cards ` +
    `-> aspect ${BOX_ASPECT.toFixed(4)}, hover hides its top ${(HOVER_HIDDEN * 100).toFixed(1)}%`
);
const zoomNote = all || tableOnly ? "" : `  zoom ${zoom}`;
console.log(`--right ${right}  --floor ${floor}  --slack ${slack}${zoomNote}\n`);
console.log("  zoom |   tank height   |  tank width | clip Y=0% | usable photoPos Y     | file");
console.log("  -----|-----------------|-------------|-----------|-----------------------|-----");
for (const z of zooms) {
  const p = plan(box, z, right, floor, slack);
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
  const range =
    `0-${p.maxYPct.toFixed(0)}% (+${p.upliftAtMaxY.toFixed(0)}px lift, ${p.clipAtMaxY.toFixed(0)}px clip)`;
  console.log(
    `  ${String(z).padStart(4)} |` +
      ` ${(p.heightShare.toFixed(1) + "% of frame").padStart(15)} |` +
      ` ${(p.widthShare.toFixed(1) + "% wide").padStart(11)} |` +
      ` ${(p.clipOnCard > 0.5 ? p.clipOnCard.toFixed(0) + "px" : "none").padStart(9)} |` +
      ` ${range.padStart(21)} |` +
      ` ${tableOnly ? "(not written)" : name}`
  );
}

console.log(`
Point the TANKS entry in components/home/ProductCategories.tsx at the file you
want, then tune the PLACEMENT there without re-running this:

    photo: "/products/category-cards/${`tank-card${TAG}-z${zoom}.png`.replace("card--", "card-")}",
    photoPos: "50% 0%",      // <- Y is the uplift. 0% = tanks lowest.

Raising Y lifts the tanks up the frame; the "photoPos Y range" column is how
far you can go before the lids leave the frame even at rest. "clip" is how
much of the lid tops the hover lift cuts off — up to ~30px has been accepted
before. X does nothing: object-cover uses the full width, so only Y slides.`);
