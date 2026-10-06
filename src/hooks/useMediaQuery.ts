"use client";

import { useSyncExternalStore } from "react";

/**
 * Acompanha uma media query em tempo real.
 *
 * No servidor (e na hidratação) devolve `false`; o valor real chega logo
 * depois, sem aviso de hydration mismatch.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);

      mediaQuery.addEventListener("change", onChange);

      return () => mediaQuery.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
