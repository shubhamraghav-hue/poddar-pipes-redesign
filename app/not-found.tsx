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
            <>
              <a
                href="/"
                className="inline-flex h-14 w-full items-center justify-center rounded-full bg-amber-500 px-6 text-base font-medium text-white shadow-[0_10px_40px_-8px_rgba(242,128,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-600"
              >
                Back to Home
              </a>
              <a
                href="/products"
                className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-base font-medium text-white backdrop-blur transition-all duration-300 hover:border-white/40 hover:bg-white/10"
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
