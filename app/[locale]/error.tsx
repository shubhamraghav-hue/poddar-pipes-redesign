"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

// Route-level error boundary for everything under a locale. It renders INSIDE
// the locale layout, so the navbar/footer (and the intl provider) survive a
// crashed page. Copy is English-only: there are no error keys in
// messages/*.json yet. Styling mirrors the 404 (components/shared/NotFoundView):
// navy band, blueprint grid, orange eyebrow, uppercase display heading.
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console / any client error tracker added later.
    // `digest` matches the server log entry for server-side errors.
    console.error(error);
  }, [error]);

  return (
    <section className="bg-ink relative flex min-h-[100svh] flex-col overflow-hidden text-white">
      <div className="bg-blueprint absolute inset-0 opacity-40" aria-hidden="true" />

      {/* pt-32 clears the fixed 80px navbar, as on the 404. */}
      <div className="container-edge relative z-10 flex flex-1 items-center justify-center pt-32 pb-16">
        <div className="flex w-full max-w-2xl flex-col items-center gap-3 text-center">
          <p className="tech-label text-xs text-amber-400">Error</p>
          <h1 className="font-display text-3xl leading-tight font-bold text-balance text-white uppercase sm:text-4xl">
            Something went wrong
          </h1>
          <p className="max-w-xl text-base text-balance text-slate-300 sm:text-lg">
            This page hit an unexpected problem. Try again, or head back to the homepage.
          </p>

          <div className="mt-3 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Navy text on orange — white on orange fails contrast. */}
            <Button
              type="button"
              size="lg"
              variant="accent"
              className="w-full text-ink"
              onClick={() => reset()}
            >
              Try again
            </Button>
            <Button asChild size="lg" variant="outline-white" className="w-full">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
