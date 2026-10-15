"use client";

import type { FocusEventHandler, MouseEventHandler, ReactNode } from "react";
import { useEffect, useRef } from "react";

import { useCarouselPointerDrag } from "@/hooks/useCarouselPointerDrag";
import { cn } from "@/lib/utils";

type CarouselProps = {
  slides: readonly ReactNode[];
  currentIndex: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
  className?: string;
  viewportClassName?: string;
  trackClassName?: string;
  showIndicators?: boolean;
  indicatorsLabel?: string;
  indicatorAriaLabel?: (index: number) => string;
  indicatorVariant?: "line" | "dot";
  indicatorContainerClassName?: string;
  indicatorClassName?: string;
  activeIndicatorClassName?: string;
  inactiveIndicatorClassName?: string;
  controlsOverlay?: ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onFocusCapture?: FocusEventHandler<HTMLDivElement>;
  onBlurCapture?: FocusEventHandler<HTMLDivElement>;
  onDragStateChange?: (isDragging: boolean) => void;
};

export function Carousel({
  slides,
  currentIndex,
  onSelect,
  ariaLabel,
  className,
  viewportClassName,
  trackClassName,
  showIndicators = false,
  indicatorsLabel = "Páginas do carrossel",
  indicatorAriaLabel = (index) => `Ir para o slide ${index + 1}`,
  indicatorVariant = "line",
  indicatorContainerClassName,
  indicatorClassName,
  activeIndicatorClassName,
  inactiveIndicatorClassName,
  controlsOverlay,
  onMouseEnter,
  onMouseLeave,
  onFocusCapture,
  onBlurCapture,
  onDragStateChange,
}: CarouselProps) {
  const slideCount = slides.length;
  const visibleIndex =
    slideCount > 0
      ? ((currentIndex % slideCount) + slideCount) % slideCount
      : 0;
  const {
    handleClickCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
    trackRef,
    viewportRef,
  } = useCarouselPointerDrag({
    currentSlide: visibleIndex,
    slideCount,
    onSelect,
  });
  const wasDragging = useRef(false);

  useEffect(() => {
    if (wasDragging.current === isDragging) {
      return;
    }

    wasDragging.current = isDragging;
    onDragStateChange?.(isDragging);
  }, [isDragging, onDragStateChange]);

  if (slideCount === 0) {
    return null;
  }

  const defaultIndicatorClasses =
    indicatorVariant === "dot"
      ? "size-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      : "h-1 transition-[width,background-color] duration-300 motion-reduce:transition-none";
  const defaultActiveClasses =
    indicatorVariant === "dot" ? "bg-white shadow-md" : "w-8 bg-[#231f1b]";
  const defaultInactiveClasses =
    indicatorVariant === "dot"
      ? "bg-white/50 hover:bg-white/75"
      : "w-4 bg-[#cfc6bc] hover:bg-[#8e8175]";

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label={ariaLabel}
      className={cn("relative", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className={cn(
          "touch-pan-y overflow-hidden",
          slideCount > 1 && !isDragging && "cursor-grab",
          isDragging && "cursor-grabbing select-none",
          viewportClassName,
        )}
      >
        <div
          ref={trackRef}
          className={cn(
            "flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isDragging && "transition-none",
            trackClassName,
          )}
          style={{ transform: `translateX(-${visibleIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={`carousel-slide-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slideCount}`}
              aria-hidden={index !== visibleIndex}
              inert={index !== visibleIndex ? true : undefined}
              className="w-full shrink-0"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {controlsOverlay}

      {showIndicators && slideCount > 1 ? (
        <div
          role="group"
          aria-label={indicatorsLabel}
          className={cn(
            "mt-7 flex items-center justify-center gap-2",
            indicatorContainerClassName,
          )}
        >
          {slides.map((_, index) => {
            const isActive = visibleIndex === index;
            return (
              <button
                key={`carousel-indicator-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={indicatorAriaLabel(index)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "cursor-pointer",
                  defaultIndicatorClasses,
                  indicatorClassName,
                  isActive
                    ? (activeIndicatorClassName ?? defaultActiveClasses)
                    : (inactiveIndicatorClassName ?? defaultInactiveClasses),
                )}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
