"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { Container } from "@/components/common";
import { valoresSobre } from "@/data/sobre";
import { gsap } from "@/lib/gsap";

export function ValoresMarca() {
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

      gsap.fromTo(
        section.querySelectorAll<HTMLElement>("[data-values-title-line]"),
        { yPercent: 110, clipPath: "inset(0% 0% 100% 0%)" },
        {
          yPercent: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.fromTo(
        section.querySelectorAll<HTMLElement>("[data-value-card]"),
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      aria-labelledby="sobre-valores-title"
      className="sobre-values"
      ref={sectionRef}
    >
      <Container className="sobre-values__inner">
        <div className="sobre-values__heading">
          <p className="sobre-section__eyebrow">O que nos guia</p>
          <h2 className="sobre-section__title" id="sobre-valores-title">
            <span className="sobre-title-mask">
              <span data-values-title-line>Valores da marca.</span>
            </span>
          </h2>
        </div>

        <div className="sobre-values__grid">
          {valoresSobre.map((valor) => (
            <article
              className="sobre-values__card"
              data-value-card
              key={valor.numero}
            >
              <h3>{valor.titulo}</h3>
              <p>{valor.descricao}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
