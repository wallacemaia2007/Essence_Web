"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

type CounterProps = {
  active: boolean;
  label: string;
  placeholder: string;
  value: number | null;
};

const numberFormat = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

export function Counter({ active, label, placeholder, value }: CounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const number = numberRef.current;
    if (!number) return;

    if (!active) {
      gsap.set(number, { autoAlpha: 0, y: 12 });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      number.textContent =
        value === null ? placeholder : numberFormat.format(value);
      gsap.set(number, { autoAlpha: 1, y: 0 });
      return;
    }

    number.textContent = value === null ? placeholder : "0";
    const reveal = gsap.to(number, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: "power3.out",
    });

    if (value === null) {
      return () => reveal.kill();
    }

    const proxy = { count: 0 };
    const count = gsap.to(proxy, {
      count: value,
      snap: { count: 1 },
      duration: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        number.textContent = numberFormat.format(proxy.count);
      },
    });

    return () => {
      reveal.kill();
      count.kill();
    };
  }, [active, placeholder, value]);

  return (
    <article className="story-stat">
      <p className="story-stat__value">
        <span ref={numberRef}>{value === null ? placeholder : "0"}</span>
      </p>
      <p className="story-stat__label">{label}</p>
    </article>
  );
}
