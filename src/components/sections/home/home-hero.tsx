"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { preload } from "react-dom";

import { heroMedia } from "@/constants/hero-media";
import { type Conjunto, conjuntosData } from "@/data/conjuntos";
import { usePrefersReducedData } from "@/hooks/usePrefersReducedData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteName } from "@/lib/seo";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  className?: string;
  /** Nome da loja usado no h1 acessível (invisível na tela). */
  title?: string;
  /** Conjuntos exibidos na faixa; usa a mesma fonte da seção inferior. */
  collections?: readonly Conjunto[];
};

/**
 * Quantas vezes a lista de coleções é repetida dentro de cada metade da trilha.
 * 1 já cobre ~4.400px de tela; o JS recalcula para telas ultrawide.
 */
const MAX_TRACK_COPIES = 3;

export function HomeHero({
  className,
  collections = conjuntosData.itens,
  title = siteName,
}: HomeHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const headingId = useId();

  const reduceMotion = useReducedMotion();
  const saveData = usePrefersReducedData();

  const [trackCopies, setTrackCopies] = useState(1);

  // Fica `true` no HTML do servidor (o vídeo já entra tocando) e vira `false`
  // no cliente quando o usuário pediu menos movimento ou economia de dados.
  const shouldPlayVideo = !reduceMotion && !saveData;

  // Repetir a lista o suficiente para preencher telas ultrawide sem que a emenda
  // do loop fique visível. A medição acontece antes da pintura (layout effect),
  // então não há salto visual.
  useLayoutEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frameId: number | null = null;

    const updateTrackCopies = () => {
      frameId = null;

      const copyWidth = track.scrollWidth / (2 * trackCopies);

      if (copyWidth <= 0) {
        return;
      }

      const nextCopies = Math.min(
        MAX_TRACK_COPIES,
        Math.max(1, Math.ceil(window.innerWidth / copyWidth)),
      );

      setTrackCopies((current) =>
        current === nextCopies ? current : nextCopies,
      );
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateTrackCopies);
      }
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);

    // A fonte de marca entra depois do HTML: a largura da faixa muda.
    document.fonts?.ready.then(scheduleUpdate).catch(() => {});

    return () => {
      window.removeEventListener("resize", scheduleUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [trackCopies]);

  // Autoplay: iOS/Android só liberam com `muted` + `playsinline`. O atributo
  // já cobre o caminho feliz; esta chamada cobre iOS com Low Power Mode e
  // navegadores que ignoram `autoplay` depois de uma navegação client-side.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !shouldPlayVideo) {
      return;
    }

    video.muted = true;
    video.play().catch(() => {
      // Autoplay bloqueado: o fundo escuro permanece sem mostrar placeholder.
    });
  }, [shouldPlayVideo]);

  // Movimento reduzido / economia de dados: descarta as fontes, interrompe o
  // buffering e volta para o poster.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || shouldPlayVideo) {
      return;
    }

    video.pause();
    video.load();
  }, [shouldPlayVideo]);

  // Não gasta bateria reproduzindo um vídeo full-screen fora da viewport.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !shouldPlayVideo) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [shouldPlayVideo]);

  // Duas metades idênticas: `translateX(-50%)` sempre cai exatamente na
  // emenda entre a primeira e a segunda cópia da lista.
  const copies = Array.from({ length: trackCopies * 2 }, (_, index) => index);

  if (shouldPlayVideo) {
    preload(heroMedia.mp4, {
      as: "video",
      type: "video/mp4",
      fetchPriority: "high",
    });
  }

  return (
    <>
      <section
        id="hero"
        data-page-hero
        aria-labelledby={headingId}
        className={cn("hero", className)}
      >
        {/* Único conteúdo acessível do hero: nada é visível sobre o vídeo. */}
        <h1 id={headingId} className="sr-only">
          {title}
        </h1>

        {!shouldPlayVideo ? (
          <Image
            src={heroMedia.poster}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="hero__poster"
          />
        ) : null}

        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        >
          {shouldPlayVideo ? (
            <Fragment>
              <source src={heroMedia.mp4} type="video/mp4" />
              <source src={heroMedia.webm} type="video/webm" />
            </Fragment>
          ) : null}
        </video>
      </section>

      <div className="hero-collections">
        <div className="marquee">
          <ul ref={trackRef} className="marquee__track">
            {copies.map((copyIndex) => {
              // Só a primeira cópia é acessível e tem links; as demais fecham
              // a animação sem repetir paradas de teclado/leitura de tela.
              const isPrimaryCopy = copyIndex === 0;

              return (
                <Fragment key={copyIndex}>
                  {collections.map((collection) => (
                    <li
                      key={`${copyIndex}-${collection.id}`}
                      className="marquee__item"
                      aria-hidden={isPrimaryCopy ? undefined : true}
                    >
                      {isPrimaryCopy && collection.href ? (
                        <Link href={collection.href} className="marquee__link">
                          {collection.titulo}
                        </Link>
                      ) : (
                        <span className="marquee__label">
                          {collection.titulo}
                        </span>
                      )}
                    </li>
                  ))}
                </Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
