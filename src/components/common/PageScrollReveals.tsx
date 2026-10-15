"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

import { routes } from "@/constants/routes";
import { gsap } from "@/lib/gsap";

export function PageScrollReveals() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (
        (pathname !== routes.contato && pathname !== routes.sobre) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const targets = document.querySelectorAll<HTMLElement>(
        `#site-content [data-scroll-reveal]`,
      );

      targets.forEach((target) => {
        const delay = Number.parseFloat(
          target.dataset.scrollRevealDelay ?? "0",
        );

        gsap.fromTo(
          target,
          {
            autoAlpha: 0,
            y: 26,
            scale: 0.99,
            filter: "blur(6px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            delay: Number.isFinite(delay) ? delay : 0,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform,filter",
            scrollTrigger: {
              trigger: target,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
