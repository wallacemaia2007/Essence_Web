"use client";

import {
  motion,
  MotionConfig,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef } from "react";

import { aboutMedia } from "@/constants/about-media";
import { aboutData } from "@/data/about";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type HomeAboutProps = {
  className?: string;
  cta?: {
    label: string;
    href: string;
  };
};

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Seção "Sobre a loja": foto de fundo com parallax, ancorada à esquerda, que
 * escurece progressivamente para a direita — é na área escura que fica o
 * texto. No mobile o degradê vira vertical e o texto desce para a base.
 */
export function HomeAbout({ className, cta = aboutData.cta }: HomeAboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  // Progresso 0 → 1 enquanto a seção atravessa a viewport (entra por baixo,
  // sai por cima). A foto anda mais devagar que a página: parallax.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="sobre-a-loja"
        aria-labelledby={headingId}
        className={cn("about", className)}
      >
        {/* A camada é 30% mais alta que a seção: sobra margem para o parallax
            deslocar a foto sem nunca mostrar a borda. */}
        <motion.div
          className="about__media"
          style={{ y: reduceMotion ? 0 : parallaxY }}
        >
          <Image
            src={aboutMedia.image}
            alt={aboutMedia.alt}
            fill
            sizes="100vw"
            quality={80}
            className="about__image"
          />
        </motion.div>

        {/* Degradê: transparente à esquerda → escuro à direita. */}
        <div className="about__veil" aria-hidden="true" />

        <div className="about__inner">
          <motion.div
            className="about__content"
            variants={textContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={textItem} className="about__eyebrow">
              {aboutData.eyebrow}
            </motion.p>

            <motion.h2
              id={headingId}
              variants={textItem}
              className="about__title"
            >
              {aboutData.titulo}
            </motion.h2>

            <motion.div variants={textItem} className="about__body">
              {aboutData.paragrafos.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div variants={textItem}>
              <Link href={cta.href} className="about__cta">
                {cta.label}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
