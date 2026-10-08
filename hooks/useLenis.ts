"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// The live instance, for code that needs to scroll programmatically. A native
// `scrollIntoView({ behavior: "smooth" })` FIGHTS Lenis — measured on the
// calculator, the page scrolled backwards (771 -> 470) because Lenis kept
// easing toward its own stale target. Null under reduced motion, where Lenis
// never starts and native scrolling is the right thing anyway.
let instance: Lenis | null = null;

/** Scroll `el` to the top of the viewport, honouring its `scroll-margin-top`. */
export function scrollToElement(el: HTMLElement) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  if (instance) {
    // A NUMBER, not the element: given a node, Lenis adds the rect to its own
    // `animatedScroll`, which can trail the real `scrollY` — measured 76px
    // short of the navbar clearance. `scrollY` is the ground truth.
    //
    // `resize()` first: Lenis clamps to a `limit` it refreshes from a
    // ResizeObserver, which had not yet seen content rendered this frame
    // (measured 2386 vs a real 2660) — a target past it would stop short.
    instance.resize();
    instance.scrollTo(el.getBoundingClientRect().top + window.scrollY - margin);
  } else {
    el.scrollIntoView({ block: "start" });
  }
}

/**
 * Freeze / release smooth scrolling, for modals. Radix locks `body` scroll, but
 * Lenis drives the page from wheel events itself and would keep scrolling it
 * behind an open dialog. Pair with `data-lenis-prevent` on the dialog's own
 * scroller so wheel events inside it scroll it natively.
 */
export function setScrollLocked(locked: boolean) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

export function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    instance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
