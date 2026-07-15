#!/usr/bin/env node
// Fails a *production* build if bracketed placeholder content (real names,
// phone numbers, addresses that still need to be filled in by the business)
// would otherwise ship to www.poddarpipes.com. Non-production builds
// (previews, staging, local) only get a warning — placeholders are expected
// there while content is still being finalized.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCAN_DIRS = ["lib/data", "components"];
const FILE_EXT = /\.(ts|tsx)$/;
const STRING_LITERAL = /"[^"]*"|'[^']*'|`[^`]*`/g;
const PLACEHOLDER_PATTERN = /\[[A-Z][A-Za-z ,&/-]*\]|XXXXX/;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (FILE_EXT.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const findings = [];
for (const dir of SCAN_DIRS) {
  const absDir = join(ROOT, dir);
  for (const file of walk(absDir)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const literals = line.match(STRING_LITERAL) ?? [];
      if (literals.some((literal) => PLACEHOLDER_PATTERN.test(literal))) {
        findings.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
      }
    });
  }
}

if (findings.length > 0) {
  console.warn(`\n⚠ Found ${findings.length} placeholder content marker(s):\n`);
  findings.forEach((f) => console.warn(`  ${f}`));

  if (process.env.NEXT_PUBLIC_SITE_ENV === "production") {
    console.error(
      "\n✖ Refusing to build for production (NEXT_PUBLIC_SITE_ENV=production) with placeholder content still present.\n" +
        "  Replace every bracketed placeholder above with real, verified content before deploying to www.poddarpipes.com.\n"
    );
    process.exit(1);
  }

  console.warn(
    "\n  Not a production build (NEXT_PUBLIC_SITE_ENV != 'production') — continuing, but these must be resolved before launch.\n"
  );
} else {
  console.log("✓ No placeholder content markers found.");
}
