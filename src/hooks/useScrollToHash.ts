"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";

export function useScrollToHash() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    lenis.scrollTo(0, { immediate: true, force: true });

    const timer = setTimeout(() => {
      lenis.scrollTo(el);
    }, 100);

    return () => clearTimeout(timer);
  }, [lenis]);
}
