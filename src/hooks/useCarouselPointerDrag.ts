"use client";

import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";

const DRAG_SLOP = 6;
const MIN_SWIPE_DISTANCE = 36;

type DragState = {
  pending: boolean;
  active: boolean;
  moved: boolean;
  pointerId: number;
  startX: number;
  startY: number;
};

type UseCarouselPointerDragOptions = {
  currentSlide: number;
  slideCount: number;
  onSelect: (index: number) => void;
};

export function useCarouselPointerDrag({
  currentSlide,
  slideCount,
  onSelect,
}: UseCarouselPointerDragOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState>({
    pending: false,
    active: false,
    moved: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
  });

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      slideCount < 2 ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    const drag = dragRef.current;
    drag.pending = true;
    drag.active = false;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const drag = dragRef.current;

    if (!viewport || !track || !drag.pending) {
      return;
    }

    const offsetX = event.clientX - drag.startX;
    const offsetY = event.clientY - drag.startY;

    if (!drag.active) {
      if (Math.abs(offsetX) <= DRAG_SLOP) {
        return;
      }

      // Deixe o gesto vertical seguir o scroll da página, como no carrossel Conjuntos.
      if (Math.abs(offsetY) > Math.abs(offsetX)) {
        drag.pending = false;
        return;
      }

      drag.active = true;
      drag.moved = true;
      viewport.setPointerCapture(drag.pointerId);
      track.style.transition = "none";
      setIsDragging(true);
    }

    event.preventDefault();
    track.style.transform = `translateX(calc(-${currentSlide * 100}% + ${offsetX}px))`;
  }

  function finishDrag(
    event: ReactPointerEvent<HTMLDivElement>,
    cancelled = false,
  ) {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const drag = dragRef.current;

    if (!viewport || !track || !drag.pending) {
      return;
    }

    drag.pending = false;
    if (!drag.active) {
      return;
    }

    drag.active = false;
    setIsDragging(false);

    if (viewport.hasPointerCapture(drag.pointerId)) {
      viewport.releasePointerCapture(drag.pointerId);
    }

    const offsetX = event.clientX - drag.startX;
    const swipeThreshold = Math.max(
      MIN_SWIPE_DISTANCE,
      viewport.clientWidth * 0.12,
    );
    const direction =
      !cancelled && Math.abs(offsetX) >= swipeThreshold
        ? offsetX < 0
          ? 1
          : -1
        : 0;
    const nextSlide =
      (((currentSlide + direction) % slideCount) + slideCount) % slideCount;

    track.style.transition = "";
    track.style.transform = `translateX(-${nextSlide * 100}%)`;
    if (nextSlide !== currentSlide) {
      onSelect(nextSlide);
    }

    // O click sintético do navegador vem logo após pointerup; só esse clique
    // posterior ao arraste é cancelado, e Enter no link permanece funcional.
    window.setTimeout(() => {
      drag.moved = false;
    }, 0);
  }

  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag.moved && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      drag.moved = false;
    }
  }

  return {
    viewportRef,
    trackRef,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: (event: ReactPointerEvent<HTMLDivElement>) =>
      finishDrag(event),
    handlePointerCancel: (event: ReactPointerEvent<HTMLDivElement>) =>
      finishDrag(event, true),
    handleClickCapture,
  };
}
