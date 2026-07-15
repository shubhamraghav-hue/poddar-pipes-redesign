// Explicit opt-in flag rather than inferring from VERCEL_ENV: a staging
// project's own "Production" deployment (e.g. poddar-pipes-test.vercel.app)
// would otherwise report VERCEL_ENV === "production" too. Set
// NEXT_PUBLIC_SITE_ENV=production in the real www.poddarpipes.com Vercel
// project's environment variables when it goes live — every other
// deployment (previews, staging, local) stays noindexed by default.
export function isProductionSite() {
  return process.env.NEXT_PUBLIC_SITE_ENV === "production";
}

// Bracketed content (e.g. "[Street Address]") that hasn't been replaced with
// verified business info yet — see lib/data/offices.ts, team.ts, dealers.ts.
const PLACEHOLDER_PATTERN = /\[[A-Z][A-Za-z ,&/-]*\]|XXXXX/;

export function hasPlaceholder(...values: string[]) {
  return values.some((v) => PLACEHOLDER_PATTERN.test(v));
}
