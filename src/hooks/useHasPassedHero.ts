"use client";

import { useLayoutEffect, useState } from "react";

// Só o hero full-bleed da home recebe `data-page-hero`. Páginas internas não
// marcam nenhum elemento, então o header nunca entra no estado "intro".
const HERO_SELECTOR = "#site-content [data-page-hero]";

function readCurrentHeaderHeight(fallbackHeight: number): number {
  const header = document.querySelector<HTMLElement>("[data-header-theme]");

  return header?.getBoundingClientRect().height ?? fallbackHeight;
}

function isPastHero(headerHeight: number): boolean {
  const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);

  // Sem hero de entrada: o header nasce visível (fundo translúcido).
  if (!hero) {
    return true;
  }

  return hero.getBoundingClientRect().bottom <= headerHeight;
}

export type HeroScrollState = {
  // Verdadeiro depois que a geometria foi lida ao menos uma vez. Antes disso
  // quem decide é o CSS (`data-hero-state="pending"`), para o primeiro paint
  // não piscar.
  hasMeasured: boolean;
  hasPassedHero: boolean;
};

export function useHasPassedHero(
  headerHeight = 64,
  resetKey?: string | null,
): HeroScrollState {
  const [hasPassedHero, setHasPassedHero] = useState(true);
  const [hasMeasured, setHasMeasured] = useState(false);

  useLayoutEffect(() => {
    let frameId: number | null = null;

    const updateFromGeometry = () => {
      frameId = null;
      const measuredHeaderHeight = readCurrentHeaderHeight(headerHeight);
      setHasPassedHero(isPastHero(measuredHeaderHeight));
      setHasMeasured(true);
    };

    const scheduleGeometryUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateFromGeometry);
      }
    };

    scheduleGeometryUpdate();
    window.addEventListener("scroll", scheduleGeometryUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleGeometryUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleGeometryUpdate);
      window.removeEventListener("resize", scheduleGeometryUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [headerHeight, resetKey]);

  return { hasMeasured, hasPassedHero };
}
