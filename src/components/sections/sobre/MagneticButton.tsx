"use client";

import { type PointerEvent, type ReactNode, useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

type MagneticButtonProps = {
  children: ReactNode;
  href: string;
};

export function MagneticButton({ children, href }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
    },
    [],
  );

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - (bounds.left + bounds.width / 2)) * 0.14;
    const y = (event.clientY - (bounds.top + bounds.height / 2)) * 0.14;

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(event.currentTarget, {
      x,
      y,
      duration: 0.28,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const handlePointerLeave = () => {
    if (!buttonRef.current) return;
    tweenRef.current?.kill();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(buttonRef.current, { x: 0, y: 0 });
      return;
    }

    tweenRef.current = gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="story-magnetic-button"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </a>
  );
}
