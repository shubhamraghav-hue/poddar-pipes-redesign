import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SHARE_IMAGE_ALT } from "@/lib/seo";

// Site-wide share card (Open Graph + Twitter, see twitter-image.tsx).
//
// Lives under [locale] rather than at app/ root on purpose: the next-intl
// proxy (proxy.ts) rewrites every dot-less path, so a root
// app/opengraph-image.tsx would be shadowed — "/opengraph-image" is rewritten
// to "/en/opengraph-image", which is THIS route. "/hi/opengraph-image" serves
// it directly. lib/seo.ts references "/opengraph-image" explicitly on every
// page, because a page-level `openGraph` drops file-convention images.
//
// JUST THE MARK (client, 2026-10-22: "use public/icon-mark.svg this logo
// globally for sharing"): the round orange "P", centred on white, for every
// page. Kept well inside the CENTRE 630x630 square of the 1200x630 card,
// because WhatsApp (and others) crop link previews to a square from the
// middle — the old left-aligned text card lost its first letters there.
export const alt = SHARE_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// icon-mark.svg is square (its viewBox crops to the circle). 360px leaves
// 135px of white around it inside the 630 square, so even a tight circular
// or square avatar crop keeps the whole mark.
const MARK = 360;

export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), "public", "icon-mark.svg"));
  const src = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={src} width={MARK} height={MARK} alt="" />
      </div>
    ),
    { ...size }
  );
}
