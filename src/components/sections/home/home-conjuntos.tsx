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
import { routes } from "@/constants/routes";
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
/** Pausa (ms) no arrasto a partir da qual a velocidade deixa de contar. */
const VELOCITY_WINDOW = 100;
/** Velocidade mínima (px/ms) para o arrasto continuar deslizando ao soltar. */
const FLING_MIN_VELOCITY = 0.1;
/** Quanto da velocidade (ms) vira deslize depois de soltar o mouse. */
const FLING_PROJECTION = 380;
/** Duração (s) do deslize depois de soltar o mouse. */
const GLIDE_DURATION = 1;
/** Duração (s) do passo dos botões anterior/próximo. */
const STEP_DURATION = 0.75;
/** Tempo parado (ms) até a trilha encaixar no card mais próximo. */
const SETTLE_DELAY_MS = 1000;
/** Duração mínima e máxima (s) da volta suave até um card. */
const RETURN_MIN_DURATION = 0.8;
const RETURN_MAX_DURATION = 1.3;
/** Quanto a duração da volta cresce por px percorrido (s/px). */
const RETURN_DURATION_PER_PX = 1 / 700;
/** Ao soltar o mouse a até esta fração do card, ele "puxa" para o card. */
const MAGNET_RATIO = 0.25;

/** Curvas: a volta começa e termina devagar; o deslize só desacelera. */
const EASE_RETURN = "power2.inOut";
const EASE_GLIDE = "power3.out";

/** Duração da volta proporcional à distância: curtas ficam leves, longas calmas. */
function returnDuration(distance: number) {
  return Math.min(
    RETURN_MAX_DURATION,
    Math.max(
      RETURN_MIN_DURATION,
      0.5 + Math.abs(distance) * RETURN_DURATION_PER_PX,
    ),
  );
}

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

// Posições de scroll (px) em que cada card fica alinhado à borda esquerda,
// já descontado o `scroll-padding` da trilha.
function cardStops(track: HTMLUListElement) {
  const trackLeft = track.getBoundingClientRect().left;
  const scrollLeft = track.scrollLeft;
  const padding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
  const maxScroll = track.scrollWidth - track.clientWidth;

  return Array.from(track.querySelectorAll("li")).map((card) =>
    Math.min(
      Math.max(
        card.getBoundingClientRect().left - trackLeft + scrollLeft - padding,
        0,
      ),
      maxScroll,
    ),
  );
}

/**
 * Seção "Conjuntos": minibanners 16:9 em carrossel horizontal sangrado.
 *
 * Sem biblioteca de carrossel: scroll nativo com scroll-snap em modo
 * `proximity` (um "grude" leve perto de cada card; toque, trackpad e roda do
 * mouse funcionam de graça e deslizam com inércia), botões anterior/próximo e
 * arraste com o mouse, que continua deslizando depois de soltar (GSAP
 * ScrollToPlugin anima o deslize e o passo dos botões). Parada por 1 s, a
 * trilha encaixa no card mais próximo, que aparece inteiro.
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

  // Liga/desliga o `scroll-snap` da trilha. Durante o arraste com o mouse e as
  // animações do GSAP ele fica desligado: com o snap ativo, cada escrita em
  // `scrollLeft` seria puxada pelo navegador e o movimento deixaria de seguir
  // o ponteiro. Ao terminar o gesto, o snap volta (valor do CSS) e dá o
  // "grude" leve em quem parou perto de um card.
  const setSnapEnabled = useCallback((enabled: boolean) => {
    const track = trackRef.current;

    if (track) {
      track.style.scrollSnapType = enabled ? "" : "none";
    }
  }, []);

  // Anima a trilha até `target` com ScrollToPlugin (ou salta direto, com
  // movimento reduzido). `snapWhenDone` só deve ser `true` quando `target` é
  // a posição de um card: religar o snap fora de um card faria o navegador
  // puxar a trilha de uma vez, e é justamente esse "tranco" que se evita.
  const animateTo = useCallback(
    (
      target: number,
      {
        duration = STEP_DURATION,
        ease = EASE_RETURN,
        snapWhenDone = true,
      }: { duration?: number; ease?: string; snapWhenDone?: boolean } = {},
    ) => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const maxScroll = track.scrollWidth - track.clientWidth;
      const bounded = Math.min(Math.max(target, 0), maxScroll);

      const finish = () => {
        if (snapWhenDone) {
          setSnapEnabled(true);
        }

        syncScrollState();
      };

      gsap.killTweensOf(track);
      setSnapEnabled(false);

      if (reduceMotion || Math.abs(bounded - track.scrollLeft) < 0.5) {
        gsap.set(track, { scrollLeft: bounded });
        finish();
        return;
      }

      gsap.to(track, {
        scrollTo: { x: bounded, y: 0 },
        duration,
        ease,
        overwrite: "auto",
        onComplete: finish,
      });
    },
    [reduceMotion, setSnapEnabled, syncScrollState],
  );

  // Interrompe um deslize em andamento quando o usuário assume o controle
  // (toque ou roda do mouse), para a animação não brigar com o gesto.
  const stopGlide = () => {
    const track = trackRef.current;

    if (track) {
      gsap.killTweensOf(track);
    }
  };

  // Os botões levam ao próximo/anterior card a partir de onde a trilha está,
  // mesmo depois de um deslize livre que parou entre dois cards.
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const stops = cardStops(track);
    const current = track.scrollLeft;
    const target =
      direction === 1
        ? stops.find((stop) => stop > current + EDGE_TOLERANCE)
        : [...stops].reverse().find((stop) => stop < current - EDGE_TOLERANCE);

    animateTo(target ?? (direction === 1 ? track.scrollWidth : 0));
  };

  // Depois de um tempo parada, a trilha encaixa no card mais próximo (o que
  // estiver cortado aparece inteiro). Vale para qualquer origem de movimento:
  // arraste, toque, roda do mouse, deslize e botões.
  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let timeoutId = 0;
    let isTouching = false;

    const settle = () => {
      timeoutId = 0;

      const drag = dragRef.current;

      // Com o dedo ou o mouse ainda no gesto, espera: ao soltar, o timer
      // volta a ser armado.
      if (isTouching || drag.pending || drag.active) {
        return;
      }

      const current = track.scrollLeft;
      const nearest = cardStops(track).reduce((best, stop) =>
        Math.abs(stop - current) < Math.abs(best - current) ? stop : best,
      );

      animateTo(nearest, {
        duration: returnDuration(nearest - current),
      });
    };

    const scheduleSettle = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(settle, SETTLE_DELAY_MS);
    };

    const onTouchStart = () => {
      isTouching = true;
    };

    const onTouchEnd = () => {
      isTouching = false;
      scheduleSettle();
    };

    track.addEventListener("scroll", scheduleSettle, { passive: true });
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    track.addEventListener("touchcancel", onTouchEnd, { passive: true });
    track.addEventListener("pointerup", scheduleSettle);
    track.addEventListener("pointercancel", scheduleSettle);

    return () => {
      window.clearTimeout(timeoutId);
      track.removeEventListener("scroll", scheduleSettle);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("touchcancel", onTouchEnd);
      track.removeEventListener("pointerup", scheduleSettle);
      track.removeEventListener("pointercancel", scheduleSettle);
    };
  }, [animateTo]);

  function handlePointerDown(event: ReactPointerEvent<HTMLUListElement>) {
    const track = trackRef.current;

    // Só mouse: em toque e caneta o scroll nativo é melhor.
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

      // Agora é arrasto: captura o ponteiro para ele não escapar da trilha.
      drag.active = true;
      drag.moved = true;
      track.setPointerCapture(drag.pointerId);
      setSnapEnabled(false);
      setIsDragging(true);
    }

    // Velocidade suavizada (média móvel); uma pausa longa zera o impulso.
    const elapsed = event.timeStamp - drag.lastTime;

    if (elapsed > VELOCITY_WINDOW) {
      drag.velocity = 0;
    } else if (elapsed > 0) {
      const instant = (event.clientX - drag.lastX) / elapsed;
      drag.velocity = drag.velocity * 0.6 + instant * 0.4;
    }

    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;

    gsap.set(track, { scrollLeft: drag.startScroll - offset });
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLUListElement>) {
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

    // Soltou parado: fica onde está. Soltou em movimento: continua deslizando
    // no mesmo sentido do arrasto (mouse para a esquerda = scroll para a
    // direita), sem encaixar em nenhum card.
    const velocity =
      event.timeStamp - drag.lastTime > VELOCITY_WINDOW ? 0 : drag.velocity;

    if (reduceMotion || Math.abs(velocity) < FLING_MIN_VELOCITY) {
      // Soltou parado: se está perto de um card, puxa de leve até ele; senão
      // o encaixe de 1 s cuida disso.
      const current = track.scrollLeft;
      const stops = cardStops(track);
      const nearest = stops.reduce((best, stop) =>
        Math.abs(stop - current) < Math.abs(best - current) ? stop : best,
      );
      const cardWidth = track.querySelector("li")?.clientWidth ?? 0;

      if (Math.abs(nearest - current) <= cardWidth * MAGNET_RATIO) {
        animateTo(nearest, { duration: returnDuration(nearest - current) });
      } else {
        syncScrollState();
      }

      return;
    }

    // Deslize livre: termina onde parar, sem religar o snap (o encaixe de 1 s
    // leva ao card com a animação suave).
    animateTo(track.scrollLeft - velocity * FLING_PROJECTION, {
      duration: GLIDE_DURATION,
      ease: EASE_GLIDE,
      snapWhenDone: false,
    });
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
              className="size-11 cursor-pointer rounded-full"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label="Próximo conjunto"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="size-11 cursor-pointer rounded-full"
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
          // Impede o navegador de "pegar" o link/imagem do card como arrasto
          // nativo, o que cancelaria o gesto do carrossel.
          onDragStart={(event) => event.preventDefault()}
          onTouchStart={stopGlide}
          onWheel={stopGlide}
          className={cn(
            "flex snap-x snap-proximity scroll-p-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-1 select-none [-webkit-touch-callout:none] md:gap-5",
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
        <div className="flex flex-wrap items-center justify-between gap-6">
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

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={routes.conjuntos}
              className="text-primary focus-visible:ring-ring/50 shrink-0 rounded-sm text-xs font-semibold tracking-[0.2em] uppercase underline-offset-8 hover:underline focus-visible:ring-3 focus-visible:outline-none"
            >
              Ver todos os conjuntos
            </Link>
            <a
              href={conjuntosData.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary focus-visible:ring-ring/50 shrink-0 rounded-sm text-xs font-semibold tracking-[0.2em] uppercase underline-offset-8 hover:underline focus-visible:ring-3 focus-visible:outline-none"
            >
              {conjuntosData.cta.label}
            </a>
          </div>
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
        draggable={false}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} draggable={false} className={className}>
      {children}
    </Link>
  );
}
