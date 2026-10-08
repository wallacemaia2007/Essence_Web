"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/common";
import { historiaSobre } from "@/data/sobre";
import { gsap } from "@/lib/gsap";

export function NossaHistoria() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (
        !section ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const titleLines = section.querySelectorAll<HTMLElement>(
        "[data-history-title-line]",
      );
      const reveals = section.querySelectorAll<HTMLElement>(
        "[data-history-reveal]",
      );
      const image = section.querySelector<HTMLElement>("[data-history-image]");

      gsap.fromTo(
        titleLines,
        { yPercent: 110, clipPath: "inset(0% 0% 100% 0%)" },
        {
          yPercent: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.fromTo(
        reveals,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        },
      );
      if (image) {
        gsap.fromTo(
          image,
          { yPercent: 7, scale: 1.08 },
          {
            yPercent: -5,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      aria-labelledby="sobre-historia-title"
      className="sobre-history"
      ref={sectionRef}
    >
      <Container className="sobre-history__inner">
        <div className="sobre-history__copy">
          <p className="sobre-section__eyebrow" data-history-reveal>
            {historiaSobre.eyebrow}
          </p>
          <h2 className="sobre-section__title" id="sobre-historia-title">
            <span className="sobre-title-mask">
              <span data-history-title-line>{historiaSobre.titulo}</span>
            </span>
          </h2>
          <div className="sobre-history__paragraphs">
            {historiaSobre.paragrafos.map((paragrafo) => (
              <p data-history-reveal key={paragrafo}>
                {paragrafo}
              </p>
            ))}
          </div>
        </div>

        <figure className="sobre-history__figure" data-history-reveal>
          <div className="sobre-history__image-frame">
            <Image
              alt="Editorial de moda com três looks contemporâneos em tons naturais"
              className="sobre-history__image"
              data-history-image
              fill
              sizes="(min-width: 900px) 44vw, 90vw"
              src="/images/conjuntos/hero-conjuntos-essence.webp"
            />
          </div>
          <figcaption>Uma curadoria para acompanhar o seu ritmo.</figcaption>
        </figure>
      </Container>
    </section>
  );
}
