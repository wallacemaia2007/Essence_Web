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

import { heroMedia } from "@/constants/hero-media";
import {
  type Collection,
  collections as defaultCollections,
} from "@/data/collections";
import { usePrefersReducedData } from "@/hooks/usePrefersReducedData";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteName } from "@/lib/seo";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  className?: string;
  /** Nome da loja usado no h1 acessível (invisível na tela). */
  title?: string;
  /** Coleções da faixa. Troque pela API mantendo o tipo `Collection`. */
  collections?: readonly Collection[];
};

/**
 * Quantas vezes a lista de coleções é repetida dentro de cada metade da trilha.
 * 1 já cobre ~4.400px de tela; o JS recalcula para telas ultrawide.
 */
const MAX_TRACK_COPIES = 3;

export function HomeHero({
  className,
  collections = defaultCollections,
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
      // Autoplay bloqueado: o poster continua na tela, nada quebra.
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

  return (
    <section
      id="hero"
      aria-labelledby={headingId}
      className={cn("hero", className)}
    >
      {/* Único conteúdo acessível do hero: nada é visível sobre o vídeo. */}
      <h1 id={headingId} className="sr-only">
        {title}
      </h1>

      <Image
        src={heroMedia.poster}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="hero__poster"
      />

      <video
        ref={videoRef}
        className="hero__video"
        poster={heroMedia.poster}
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

      {/* Véu mínimo na base: só o suficiente para o rodapé ser legível. */}
      <div className="hero__veil" aria-hidden="true" />

      <footer className="hero__footer">
        <div className="marquee">
          <ul ref={trackRef} className="marquee__track">
            {copies.map((copyIndex) => {
              // Só a primeira cópia é "de verdade": é a única que aparece para
              // leitores de tela e a única com links (nada de tab stop repetido).
              // As cópias restantes usam texto puro, com a mesma métrica.
              const isPrimaryCopy = copyIndex === 0;

              return (
                <Fragment key={copyIndex}>
                  {collections.map((collection) => (
                    <li
                      key={`${copyIndex}-${collection.slug}`}
                      className="marquee__item"
                      aria-hidden={isPrimaryCopy ? undefined : true}
                    >
                      {isPrimaryCopy && collection.href ? (
                        <Link href={collection.href} className="marquee__link">
                          {collection.name}
                        </Link>
                      ) : (
                        <span className="marquee__label">
                          {collection.name}
                        </span>
                      )}
                    </li>
                  ))}
                </Fragment>
              );
            })}
          </ul>
        </div>
      </footer>
    </section>
  );
}
