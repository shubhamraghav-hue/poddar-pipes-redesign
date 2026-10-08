import { notFound } from "next/navigation";

// Catch-all for unknown paths inside a locale (e.g. /hi/xyz). Without it,
// Next can't match the URL to any [locale] route and falls through to the
// global app/not-found.tsx (English, no nav/footer). Calling notFound() here
// renders app/[locale]/not-found.tsx instead — translated, inside the full
// locale layout. This is the pattern next-intl documents for localized 404s.
export default function CatchAllPage() {
  notFound();
}
