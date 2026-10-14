"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getCenteredScrollTarget } from "@/lib/scroll";

export function useScrollToHash() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    if (!window.location.hash) return;

    const scrollToCurrentHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Um hash malformado ainda pode corresponder a um id literal.
      }

      const element = document.getElementById(id);
      if (!element) return;

      lenis.scrollTo(getCenteredScrollTarget(element, lenis.scroll));
    };

    // Em uma navegação entre páginas, mostra o começo da página de destino
    // antes de iniciar a rolagem suave até a seção pedida.
    lenis.scrollTo(0, { immediate: true, force: true });
    const timer = window.setTimeout(scrollToCurrentHash, 700);
    window.addEventListener("hashchange", scrollToCurrentHash);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToCurrentHash);
    };
  }, [lenis, pathname]);
}
