"use client";

import { useLayoutEffect, useState } from "react";

const INTRO_SECTION_SELECTOR = "#site-content .themed-section[data-theme]";

function readCurrentHeaderHeight(fallbackHeight: number): number {
  const header = document.querySelector<HTMLElement>("[data-header-theme]");

  return header?.getBoundingClientRect().height ?? fallbackHeight;
}

function hasPassedIntroSection(headerHeight: number): boolean {
  const introSection = document.querySelector<HTMLElement>(
    INTRO_SECTION_SELECTOR,
  );

  if (!introSection) {
    return false;
  }

  return introSection.getBoundingClientRect().bottom <= headerHeight;
}

export function useHasPassedIntroSection(
  headerHeight = 64,
  resetKey?: string | null,
): boolean {
  const [hasPassedIntro, setHasPassedIntro] = useState(false);

  useLayoutEffect(() => {
    let frameId: number | null = null;

    const updateFromGeometry = () => {
      frameId = null;
      const measuredHeaderHeight = readCurrentHeaderHeight(headerHeight);
      setHasPassedIntro(hasPassedIntroSection(measuredHeaderHeight));
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

  return hasPassedIntro;
}
