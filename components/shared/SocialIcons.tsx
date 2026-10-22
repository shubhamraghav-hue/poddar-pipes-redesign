// The footer's social row. Both breakpoints use Figma's OWN white icon SVGs
// (public/brand/social, exported from the desktop footer node 1530:7177) —
// the same artwork everywhere, just smaller on phones (client, 2026-10-22: "use
// the figma icons on mobile too"). The phone row used to draw a different,
// older glyph set ported from the "coming soon" site, in grey at 70%, so the
// icons visibly changed below `lg`. Only used by the footer.
const LINKS: { name: string; file: string; href: string }[] = [
  { name: "Facebook", file: "facebook", href: "https://www.facebook.com/PoddarPipes/" },
  { name: "X", file: "x", href: "https://x.com/Poddarpipe" },
  { name: "LinkedIn", file: "linkedin", href: "https://www.linkedin.com/company/poddar-pipes/" },
  { name: "YouTube", file: "youtube", href: "https://youtube.com/@poddarpipes" },
  { name: "Instagram", file: "instagram", href: "https://www.instagram.com/poddarpipes" },
];

/**
 * Desktop footer row, EXACTLY Figma node 1530:7177: the five white SVGs in
 * 30px boxes, 13px gaps (Figma footer 1979:32591), starting 10px LEFT of the
 * address text (the icons' own padding brings their ink into line).
 */
function SocialIconsFigma() {
  return (
    <div className="-ml-[10px] flex items-center gap-[13px]">
      {LINKS.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.name}
          className="block size-[30px] transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Figma SVG asset at its own size */}
          <img src={`/brand/social/${l.file}.svg`} alt="" width={30} height={30} className="block size-[30px]" />
        </a>
      ))}
    </div>
  );
}

/**
 * Mobile footer row: the desktop row above, scaled to 80% (client,
 * 2026-10-22: "use the same icons we are using for desktop just reduce the
 * size") — the same white SVGs with no rings, 24px boxes (Figma's mobile icon
 * size), 10px gaps and the 8px left pull-in, i.e. 30 / 13 / 10 x 0.8. The
 * `before:` box keeps a 40px tap target around each 24px icon.
 */
function SocialIconsMobile() {
  return (
    <div className="-ml-2 flex items-center gap-[10px]">
      {LINKS.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.name}
          className="relative block size-6 transition-opacity before:absolute before:-inset-2 before:content-[''] hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Figma SVG asset */}
          <img src={`/brand/social/${l.file}.svg`} alt="" width={24} height={24} className="block size-6" />
        </a>
      ))}
    </div>
  );
}

export function SocialIcons({ variant = "default" }: { variant?: "default" | "figma" } = {}) {
  return variant === "figma" ? <SocialIconsFigma /> : <SocialIconsMobile />;
}
