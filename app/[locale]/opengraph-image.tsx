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
// THE FULL BRAND LOGO (client, 2026-10-22: "make the preview logo the entire
// brand logo"): public/logo.svg — round mark + PODDAR PIPES wordmark —
// centred on white, for every page. Sized to sit inside the CENTRE 630x630
// square of the 1200x630 card, because WhatsApp (and others) crop link
// previews to a square from the middle — the old left-aligned text card lost
// its first letters there. (Briefly the round mark alone, icon-mark.svg.)
export const alt = SHARE_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// logo.svg is 113x33; 520 wide leaves 55px clear each side of the square.
const LOGO_W = 520;
const LOGO_H = Math.round((LOGO_W * 33) / 113);

export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), "public", "logo.svg"));
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
        <img src={src} width={LOGO_W} height={LOGO_H} alt="" />
      </div>
    ),
    { ...size }
  );
}
