"use client";

// Last-resort boundary: replaces the ROOT layout when it (or the locale
// layout) throws, so it must render its own <html>/<body>. Nothing from the
// app can be trusted here — no globals.css, fonts, providers or components —
// hence plain inline styles in the brand colours. Copy is English-only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b52",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <main style={{ maxWidth: 560 }}>
          <p style={{ color: "#f28000", letterSpacing: "0.12em", fontSize: 12, margin: 0 }}>
            PODDAR PIPES
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "12px 0", textTransform: "uppercase" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1.5, margin: "0 0 24px" }}>
            The site hit an unexpected problem. Please try again.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                // Navy on orange — white on orange fails contrast.
                background: "#f28000",
                color: "#0b0b52",
                border: 0,
                borderRadius: 999,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain anchor (full reload), not next/link: the app shell is
                what failed, so client navigation can't be relied on. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 999,
                padding: "13px 28px",
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
