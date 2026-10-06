"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Container, ThemedSection } from "@/components/common";
import { Button } from "@/components/ui/button";
import { type Conjunto, conjuntosData } from "@/data/conjuntos";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollToPlugin);

type HomeConjuntosProps = {
  className?: string;
  /** Banners do carrossel. Troque pela API mantendo o tipo `Conjunto`. */
  itens?: readonly Conjunto[];
};

/** Tolerância (px) para considerar o scroll "no início" ou "no fim". */
const EDGE_TOLERANCE = 4;
/** Deslocamento (px) a partir do qual o arrasto deixa de contar como clique. */
const DRAG_SLOP = 6;
/** Intervalo (ms) válido para amostrar a velocidade do arrasto. */
const VELOCITY_WINDOW = 100;
/** Velocidade mínima (px/ms) para o arrasto virar "flick" com inércia. */
const FLICK_VELOCITY = 0.25;
/** Distância (ms) projetada pela velocidade no momento do "flick". */
const FLICK_PROJECTION = 220;
/** Duração (s) do retorno animado para o card alinhado. */
const SNAP_DURATION = 0.55;

type DragState = {
  /** `pointerdown` do mouse registrado, ainda sem passar do `DRAG_SLOP`. */
  pending: boolean;
  /** Arraste efetivo: slop ultrapassado e ponteiro capturado. */
  active: boolean;
  /** `pointerId` do gesto em andamento (o capture é atrasado de propósito). */
  pointerId: number;
  /** `clientX` do pointerdown. */
  startX: number;
  /** `scrollLeft` no início do arraste. */
  startScroll: number;
  /** Último `clientX` amostrado, para o cálculo da velocidade. */
  lastX: number;
  /** Timestamp do último `pointermove`. */
  lastTime: number;
  /** Velocidade horizontal instantânea (px/ms, positiva para a direita). */
  velocity: number;
  /** O ponteiro andou o bastante para invalidar o clique. */
  moved: boolean;
};

/**
 * Seção "Conjuntos": minibanners 16:9 em carrossel horizontal sangrado.
 *
 * Sem biblioteca de carrossel: scroll nativo com scroll-snap (toque, trackpad e
 * roda do mouse funcionam de graça), botões anterior/próximo e arraste com o
 * mouse (GSAP ScrollToPlugin cuida do retorno animado para o card alinhado).
 * A trilha fica fora do `Container` para alcançar as bordas da viewport; no
 * repouso o primeiro card alinha com o texto do título (mesma calha de 1rem) e
 * os seguintes aparecem cortados na lateral, indicando que há mais conteúdo.
 *
 * Os banners não têm borda, raio nem sombra — a imagem encosta no recorte do
 * card e o `.themed-section img` é zerado por utilitário (camada `utilities`
 * vence `components`).
 */
export function HomeConjuntos({
  className,
  itens = conjuntosData.itens,
}: HomeConjuntosProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Estado do arraste em ref: muda a cada `pointermove` e não pode disparar
  // re-render; só o cursor precisa de estado visual.
  const dragRef = useRef<DragState>({
    pending: false,
    active: false,
    pointerId: 0,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
  });

  // Lê a posição do scroll: habilita/desabilita os botões e move a barra de
  // progresso (direto no DOM, sem re-render a cada frame).
  const syncScrollState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 1;

    setCanPrev(track.scrollLeft > EDGE_TOLERANCE);
    setCanNext(track.scrollLeft < maxScroll - EDGE_TOLERANCE);

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0.08, progress))})`;
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frameId = 0;

    const onScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncScrollState();
      });
    };

    syncScrollState();
    track.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(syncScrollState);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      gsap.killTweensOf(track);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [syncScrollState]);

  // Libera o `scroll-snap` e o `scroll-behavior: smooth` que a trilha usa por
  // padrão: com eles ligados, cada escrita em `scrollLeft` vira animação e o
  // arraste deixa de acompanhar o ponteiro 1:1.
  const setTrackDragMode = (isOn: boolean) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.style.scrollSnapType = isOn ? "none" : "";
    track.style.scrollBehavior = isOn ? "auto" : "";
  };

  // Anima a trilha até `target` com ScrollToPlugin e devolve o controle do
  // snap/smooth ao final (ou de imediato, com movimento reduzido).
  const animateTo = useCallback(
    (target: number) => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const maxScroll = track.scrollWidth - track.clientWidth;
      const bounded = Math.min(Math.max(target, 0), maxScroll);

      gsap.killTweensOf(track);

      const settle = () => {
        setTrackDragMode(false);
        syncScrollState();
      };

      if (reduceMotion || Math.abs(bounded - track.scrollLeft) < 0.5) {
        gsap.set(track, { scrollLeft: bounded });
        settle();
        return;
      }

      gsap.to(track, {
        scrollTo: { x: bounded, y: 0 },
        duration: SNAP_DURATION,
        ease: "power3.out",
        overwrite: "auto",
        onComplete: settle,
      });
    },
    [reduceMotion, syncScrollState],
  );

  // Anda exatamente um card (largura do card + espaçamento) por clique.
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const firstCard = track?.querySelector("li");

    if (!track || !firstCard) {
      return;
    }

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;

    animateTo(track.scrollLeft + direction * step);
  };

  // Offset (px de scroll) do início de cada card, medido em relação à borda
  // esquerda da trilha: são os pontos em que o snap válido encosta.
  const cardOffsets = (track: HTMLUListElement) => {
    const trackLeft = track.getBoundingClientRect().left;
    const scrollLeft = track.scrollLeft;

    return Array.from(track.querySelectorAll("li")).map(
      (card) => card.getBoundingClientRect().left - trackLeft + scrollLeft,
    );
  };

  // Encaixa na posição `position` no card mais próximo.
  const animateToNearestCard = (position: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const offsets = cardOffsets(track);
    const nearest = offsets.reduce((best, offset) =>
      Math.abs(offset - position) < Math.abs(best - position) ? offset : best,
    );

    animateTo(nearest);
  };

  function handlePointerDown(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current;

    // Só mouse: em toque e caneta o scroll nativo (com snap) é melhor.
    if (!track || event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    gsap.killTweensOf(track);

    const drag = dragRef.current;

    // Nada é capturado aqui de propósito: com `setPointerCapture` no
    // pointerdown, o `click` passa a mirar a `<ul>` e os links dos cards
    // deixariam de navegar. A captura só acontece quando o arraste começa.
    drag.pending = true;
    drag.active = false;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startScroll = track.scrollLeft;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    drag.velocity = 0;
    drag.moved = false;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current;
    const drag = dragRef.current;

    if (!track || !drag.pending) {
      return;
    }

    const offset = event.clientX - drag.startX;

    if (!drag.active) {
      if (Math.abs(offset) <= DRAG_SLOP) {
        return;
      }

      // Agora é arrasto: captura o ponteiro para ele não escapar da trilha e
      // desliga snap/smooth para a posição seguir o mouse 1:1.
      drag.active = true;
      drag.moved = true;
      track.setPointerCapture(drag.pointerId);
      setTrackDragMode(true);
      setIsDragging(true);
    }

    const elapsed = event.timeStamp - drag.lastTime;

    if (elapsed > 0 && elapsed <= VELOCITY_WINDOW) {
      drag.velocity = (event.clientX - drag.lastX) / elapsed;
      drag.lastX = event.clientX;
      drag.lastTime = event.timeStamp;
    }

    gsap.set(track, { scrollLeft: drag.startScroll - offset });
  }

  function handlePointerEnd() {
    const track = trackRef.current;
    const drag = dragRef.current;

    if (!track || !drag.pending) {
      return;
    }

    drag.pending = false;

    // Toque simples: nada foi movido, o clique do card segue o fluxo normal.
    if (!drag.active) {
      return;
    }

    drag.active = false;
    setIsDragging(false);

    if (track.hasPointerCapture(drag.pointerId)) {
      track.releasePointerCapture(drag.pointerId);
    }

    // "Flick": projeta a velocidade e encaixa no card mais próximo do ponto
    // projetado — o arrasto longo continua indo longe, mas nunca deixa o
    // carrossel entre dois cards.
    const projection =
      Math.abs(drag.velocity) > FLICK_VELOCITY
        ? track.scrollLeft + drag.velocity * FLICK_PROJECTION
        : track.scrollLeft;

    animateToNearestCard(projection);
  }

  // Depois de arrastar sobre um card, o navegador ainda dispararia `click` e o
  // link abriria sem querer. `detail === 0` é o clique vindo do teclado
  // (Enter numa âncora focada), que precisa continuar funcionando.
  function handleClickCapture(event: ReactMouseEvent<HTMLUListElement>) {
    const drag = dragRef.current;

    if (!drag.moved || event.detail === 0) {
      return;
    }

    drag.moved = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <ThemedSection
      id="conjuntos"
      aria-labelledby="conjuntos-title"
      className={cn("py-16 md:py-24", className)}
    >
      <Container className="max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.28em] uppercase">
              {conjuntosData.eyebrow}
            </p>
            <h2
              id="conjuntos-title"
              className="font-heading mt-3 text-3xl leading-tight tracking-wide uppercase md:text-5xl"
            >
              {conjuntosData.titulo}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl text-base leading-7">
              {conjuntosData.descricao}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              aria-label="Conjunto anterior"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="size-11 rounded-full"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label="Próximo conjunto"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="size-11 rounded-full"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Container>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Conjuntos da Essence"
        className="mt-10 md:mt-12"
      >
        <ul
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          className={cn(
            "flex snap-x snap-mandatory scroll-p-4 gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-1 select-none motion-reduce:scroll-auto md:gap-5",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {itens.map((item, index) => (
            <li
              key={item.id}
              className="w-[92%] shrink-0 snap-start pl-0 before:hidden sm:w-[68%] md:w-[54%] lg:w-[42%]"
            >
              <ConjuntoCard item={item} priority={index === 0} />
            </li>
          ))}
        </ul>
      </div>

      <Container className="mt-8 max-w-7xl">
        <div className="flex items-center justify-between gap-8">
          {/* Barra de progresso do carrossel (decorativa). */}
          <div
            aria-hidden="true"
            className="bg-border h-px w-full max-w-xs overflow-hidden"
          >
            <div
              ref={progressRef}
              className="bg-primary h-full origin-left transition-transform duration-300 motion-reduce:transition-none"
              style={{ transform: "scaleX(0.08)" }}
            />
          </div>

          <a
            href={conjuntosData.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary focus-visible:ring-ring/50 shrink-0 rounded-sm text-xs font-semibold tracking-[0.2em] uppercase underline-offset-8 hover:underline focus-visible:ring-3 focus-visible:outline-none"
          >
            {conjuntosData.cta.label}
          </a>
        </div>
      </Container>
    </ThemedSection>
  );
}

function ConjuntoCard({
  item,
  priority,
}: {
  item: Conjunto;
  priority: boolean;
}) {
  const content = (
    <>
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 42vw, (min-width: 768px) 54vw, 88vw"
        quality={80}
        loading={priority ? "eager" : "lazy"}
        // Sem isso o arrasto nativo da imagem cancela os `pointermove`.
        draggable={false}
        // `.themed-section img` aplica raio e sombra; os banners são retos.
        className="rounded-none object-cover shadow-none transition-transform duration-700 ease-out group-hover/card:scale-105 motion-reduce:transition-none"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
        <p className="font-heading text-xl leading-tight tracking-wide uppercase md:text-2xl">
          {item.titulo}
        </p>
        {item.descricao ? (
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/80 md:text-base md:leading-6">
            {item.descricao}
          </p>
        ) : null}
      </div>
    </>
  );

  const cardClassName =
    "group/card relative block aspect-video w-full overflow-hidden bg-neutral-900 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white";

  return wrapWithLink(item.href, cardClassName, content);
}

function wrapWithLink(
  href: string | undefined,
  className: string,
  children: ReactNode,
) {
  if (!href) {
    return <div className={className}>{children}</div>;
  }

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
