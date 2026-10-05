"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type LivroDestaque = {
  id?: string;
  capa: string;
  href?: string;
  titulo: string;
  subtitulo?: string;
  ano?: string;
  sinopse: string;
  destaque?: boolean;
};

type LivroEstanteProps = {
  livro: LivroDestaque;
  className?: string;
  variant?: "left" | "right";
};

export function LivroEstante({
  className,
  livro,
  variant = "left",
}: LivroEstanteProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [supportsHover, setSupportsHover] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const restingTransform = useMemo(
    () =>
      variant === "left"
        ? "perspective(1600px) rotateY(-10deg) rotateX(4deg) translateY(0px)"
        : "perspective(1600px) rotateY(10deg) rotateX(4deg) translateY(0px)",
    [variant],
  );

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateHover = () => setSupportsHover(hoverQuery.matches);
    const updateMotion = () => setReduceMotion(motionQuery.matches);

    updateHover();
    updateMotion();

    hoverQuery.addEventListener("change", updateHover);
    motionQuery.addEventListener("change", updateMotion);

    return () => {
      hoverQuery.removeEventListener("change", updateHover);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    gsap.set(rootRef.current, { transform: restingTransform });
    gsap.set(labelRef.current, {
      autoAlpha: supportsHover && !reduceMotion ? 0 : 1,
      y: supportsHover && !reduceMotion ? 10 : 0,
    });

    if (!supportsHover || reduceMotion) {
      gsap.set(rootRef.current, { clearProps: "transform" });
    }
  }, [reduceMotion, restingTransform, supportsHover]);

  const animateIn = () => {
    if (!supportsHover || reduceMotion) {
      return;
    }

    gsap.to(rootRef.current, {
      duration: 0.45,
      ease: "power3.out",
      transform:
        "perspective(1600px) rotateY(0deg) rotateX(0deg) translateY(-14px) scale(1.035)",
    });

    gsap.to(labelRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const animateOut = () => {
    if (!supportsHover || reduceMotion) {
      return;
    }

    gsap.to(rootRef.current, {
      duration: 0.45,
      ease: "power3.out",
      transform: restingTransform,
    });

    gsap.to(labelRef.current, {
      autoAlpha: 0,
      y: 10,
      duration: 0.25,
      ease: "power2.out",
    });
  };
  const linkHref = livro.href ?? "#";

  return (
    <Link
      ref={rootRef}
      href={linkHref}
      scroll={false}
      aria-label={`Abrir ${livro.titulo}`}
      className={cn(
        "group relative block w-full max-w-[11rem] outline-none select-none sm:max-w-[13rem] md:max-w-[15rem]",
        supportsHover && !reduceMotion && "will-change-transform",
        className,
      )}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
    >
      <span className="sr-only">{livro.titulo}</span>
      <span className="absolute inset-x-3 bottom-0 h-4 rounded-full bg-black/15 blur-md" />

      <span className="absolute top-2 bottom-6 left-0 w-[11%] rounded-l-[1rem] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--foreground),transparent_68%)_0%,color-mix(in_srgb,var(--foreground),transparent_84%)_100%)] shadow-[inset_-2px_0_4px_rgba(255,255,255,0.18)]" />

      <div
        className={cn(
          "relative ml-[10%] aspect-[0.69] overflow-hidden rounded-[0.85rem] border border-white/15 shadow-[0_24px_40px_color-mix(in_srgb,var(--background),black_30%)] transition-[box-shadow] duration-300",
          imageFailed
            ? "bg-[linear-gradient(160deg,color-mix(in_srgb,var(--background),var(--primary)_14%)_0%,color-mix(in_srgb,var(--background),white_4%)_42%,color-mix(in_srgb,var(--background),var(--foreground)_10%)_100%)]"
            : "bg-background",
        )}
      >
        {!imageFailed ? (
          <Image
            src={livro.capa}
            alt={`Capa do livro ${livro.titulo}`}
            fill
            sizes="(max-width: 768px) 42vw, 220px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_18%,transparent_62%,rgba(0,0,0,0.34)_100%)]" />
        <div className="absolute inset-0 flex items-end p-3 text-left text-white">
          <div className="flex w-full items-end justify-between">
            <span className="border border-white/15 bg-black/18 px-2 py-1 text-[0.58rem] font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
              Livro
            </span>

            {livro.ano ? (
              <span className="border border-white/12 bg-black/20 px-2 py-1 text-[0.62rem] font-semibold tracking-[0.18em] backdrop-blur-sm">
                {livro.ano}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <span
        ref={labelRef}
        className="bg-card text-card-foreground absolute top-full left-[10%] z-10 mt-2 w-[89%] overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--primary),transparent_65%)] px-3 py-2.5 text-left text-[0.8rem] leading-snug font-medium shadow-lg shadow-black/20 backdrop-blur-md"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] bg-primary"
        />
        {livro.titulo}
      </span>
    </Link>
  );
}