"use client";

import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | null;

type ScrollDirectionState = {
  direction: ScrollDirection;
  isAtTop: boolean;
  scrollY: number;
};

type UseScrollDirectionOptions = {
  threshold?: number;
  topOffset?: number;
};

export function useScrollDirection({
  threshold = 8,
  topOffset = 80,
}: UseScrollDirectionOptions = {}): ScrollDirectionState {
  const [state, setState] = useState<ScrollDirectionState>({
    direction: null,
    isAtTop: true,
    scrollY: 0,
  });
  const lastYRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const readScroll = () => {
      frameRef.current = null;

      const nextY = Math.max(window.scrollY, 0);
      const delta = nextY - lastYRef.current;
      const isAtTop = nextY < topOffset;

      if (isAtTop) {
        lastYRef.current = nextY;
        setState((current) =>
          current.direction === null &&
          current.isAtTop === true &&
          current.scrollY === nextY
            ? current
            : { direction: null, isAtTop, scrollY: nextY },
        );
        return;
      }

      const nextDirection =
        delta > threshold ? "down" : delta < 0 ? "up" : null;

      if (nextDirection) {
        lastYRef.current = nextY;
        setState((current) =>
          current.direction === nextDirection &&
          current.isAtTop === isAtTop &&
          current.scrollY === nextY
            ? current
            : { direction: nextDirection, isAtTop, scrollY: nextY },
        );
      } else {
        setState((current) =>
          current.isAtTop === isAtTop && current.scrollY === nextY
            ? current
            : { ...current, isAtTop, scrollY: nextY },
        );
      }
    };

    const onScroll = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(readScroll);
      }
    };

    lastYRef.current = Math.max(window.scrollY, 0);
    readScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [threshold, topOffset]);

  return state;
}
