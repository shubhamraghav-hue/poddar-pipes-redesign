// Root pass-through layout. The real <html>/<body> shell lives in
// app/[locale]/layout.tsx (which owns fonts, providers, nav + footer). This
// root layout renders nothing of its own so that BOTH the locale layout and
// the global app/not-found.tsx can supply their own document shell — the
// standard next-intl setup for catching non-localised / unmatched routes.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
