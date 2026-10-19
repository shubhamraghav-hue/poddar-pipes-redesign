"use client";

import { forwardRef, type ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { rangeLinkProps } from "@/lib/productFocus";

/**
 * `Link` for server components (footer, home category cards) whose href may
 * be a product range (`/products/x#range`): adds `scroll={false}` and the
 * focus event via `rangeLinkProps` — handlers a server component can't attach
 * itself. Any other href behaves exactly like `Link`.
 */
export const RangeLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link> & { href: string }>(
  function RangeLink({ href, onClick, ...props }, ref) {
    const extra = rangeLinkProps(href);
    return (
      <Link
        ref={ref}
        href={href}
        {...props}
        {...("scroll" in extra ? { scroll: extra.scroll } : {})}
        onClick={(e) => {
          onClick?.(e);
          extra.onClick?.();
        }}
      />
    );
  }
);
