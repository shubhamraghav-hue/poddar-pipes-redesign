import type { Metadata } from "next";
import { Anek_Devanagari } from "next/font/google";
import "@/styles/globals.css";
import { NotFoundView } from "@/components/shared/NotFoundView";
import { HR_EMAIL, DISTRIBUTOR_EMAIL } from "@/lib/data/enquiries";

// This global 404 handles requests that never reach the locale layout (an
// unmatched top-level path, or notFound() thrown outside a locale). It renders
// its own document shell — there is no NextIntlClientProvider here, so copy is
// the site's default-locale (English) and links are plain anchors.
const anek = Anek_Devanagari({
  subsets: ["latin", "devanagari"],
  variable: "--font-anek",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 — Page not found | Poddar Pipes",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={anek.variable}>
      <body className="font-body">
        <NotFoundView
          showBrand
          code="404"
          eyebrow="Error · 404 · Connection lost"
          title="This line doesn't connect to anything."
          desc="The page you're looking for may have moved. Head back to the homepage to keep exploring."
          contacts={[
            { label: "HR enquiries", email: HR_EMAIL, kind: "hr" },
            { label: "Distributor enquiries", email: DISTRIBUTOR_EMAIL, kind: "distributor" },
          ]}
          actions={
            // Plain anchors on purpose (full page load): this 404 has its own
            // document shell outside the locale layout, so a hard navigation
            // back into the app is the reliable path.
            <>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="inline-flex h-[46px] w-full items-center justify-center rounded-full bg-[#f28000] px-6 text-[18px] font-semibold uppercase leading-none tracking-[0.36px] text-[#0b0b52] transition-colors duration-[120ms] ease-out hover:bg-[#c26600]"
              >
                Back to Home
              </a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/products"
                className="inline-flex h-[46px] w-full items-center justify-center rounded-full px-6 text-[18px] font-semibold uppercase leading-none tracking-[0.36px] text-white shadow-[inset_0_0_0_1.2px_#fff] transition-colors duration-[120ms] ease-out hover:bg-black/20"
              >
                Browse products
              </a>
            </>
          }
        />
      </body>
    </html>
  );
}
