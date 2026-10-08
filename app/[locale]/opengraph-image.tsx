import { ImageResponse } from "next/og";

// Site-wide share card (Open Graph + Twitter, see twitter-image.tsx).
//
// Lives under [locale] rather than at app/ root on purpose: the next-intl
// proxy (proxy.ts) rewrites every dot-less path, so a root
// app/opengraph-image.tsx would be shadowed — "/opengraph-image" is rewritten
// to "/en/opengraph-image", which is THIS route. "/hi/opengraph-image" serves
// it directly. lib/seo.ts references "/opengraph-image" explicitly on every
// page, because a page-level `openGraph` drops file-convention images.
//
// Deliberately plain: the default ImageResponse font (no external font
// fetch), brand navy + orange, no images to load.
export const alt = "Poddar Pipes — Engineered for every drop of India's growth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0b0b52";
const ORANGE = "#f28000";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: NAVY,
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 112,
            fontWeight: 700,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          PODDAR PIPES
        </div>
        {/* Orange accent rule — the brand's one accent colour. */}
        <div
          style={{
            display: "flex",
            width: 220,
            height: 10,
            marginTop: 40,
            marginBottom: 40,
            background: ORANGE,
            borderRadius: 5,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 48,
            lineHeight: 1.25,
            color: "rgba(255,255,255,0.9)",

          }}
        >
          Engineered for every drop of India&apos;s growth
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 28,
            letterSpacing: "0.08em",
            color: ORANGE,
          }}
        >
          www.poddarpipes.com
        </div>
      </div>
    ),
    { ...size }
  );
}
