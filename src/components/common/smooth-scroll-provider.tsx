"use client";

import type { LenisOptions } from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";

import { ScrollToHash } from "@/components/common/scroll-to-hash";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LENIS_OPTIONS: LenisOptions = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1,
  autoResize: true,
  naiveDimensions: true,
  autoRaf: false,
};

function SyncLenisWithGSAP() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    const refreshScrollLimits = () => {
      ScrollTrigger.refresh();
      lenis.resize();
    };

    const scheduleRefresh = () => {
      let frame = 0;

      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(refreshScrollLimits);
      });

      return () => window.cancelAnimationFrame(frame);
    };

    const onLenisScroll = () => ScrollTrigger.update();
    const onGSAPTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    const onViewportChange = () => scheduleRefresh();

    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(onGSAPTicker);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener("load", onViewportChange);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);

    const cancelInitialRefresh = scheduleRefresh();
    const lateRefresh = window.setTimeout(refreshScrollLimits, 450);

    return () => {
      cancelInitialRefresh();
      window.clearTimeout(lateRefresh);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onGSAPTicker);
      window.removeEventListener("load", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
    };
  }, [lenis, pathname]);

  return null;
}

function ResetScrollOnRouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!lenis) return;

    if (window.location.hash) return;

    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return null;
}

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <ScrollToHash />
      <SyncLenisWithGSAP />
      <ResetScrollOnRouteChange />
      {children}
    </ReactLenis>
  );
}
