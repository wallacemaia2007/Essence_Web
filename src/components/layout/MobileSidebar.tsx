"use client";

import { X } from "lucide-react";
import Image from "next/image";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import logoImg from "../../../public/images/logo.svg";

import { NavLinks } from "./NavLinks";
import { SamePageScrollLink } from "./SamePageScrollLink";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function MobileSidebar({
  isOpen,
  onClose,
  returnFocusRef,
}: MobileSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hiddenTargets = [
      document.getElementById("site-content"),
      document.getElementById("site-footer"),
    ].filter((target): target is HTMLElement => target !== null);

    hiddenTargets.forEach((target) => {
      if (isOpen) {
        target.setAttribute("aria-hidden", "true");
      } else {
        target.removeAttribute("aria-hidden");
      }
    });

    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;
    document.body.style.overflow = "hidden";

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      FOCUSABLE_SELECTOR,
    );
    focusable?.[0]?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      hiddenTargets.forEach((target) => target.removeAttribute("aria-hidden"));
      returnFocusElement?.focus();
    };
  }, [isOpen, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    };

    const onEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 50) return;

      onClose();
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-[100] lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/70 transition-opacity duration-300 motion-reduce:transition-none",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className={cn(
          "themed-section fixed top-0 right-0 flex h-dvh w-[min(22rem,calc(100vw-2rem))] flex-col border-l bg-background px-5 py-5 text-foreground shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-opacity",
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 motion-reduce:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <SamePageScrollLink
            href={routes.home}
            onNavigate={onClose}
            className="font-heading flex items-center gap-2 text-xl leading-none tracking-wide uppercase"
          >
            <Image
              src={logoImg}
              alt="Essence Web Template"
              className="h-8 w-8 object-contain"
            />
            Essence Web
          </SamePageScrollLink>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <NavLinks
          onNavigate={onClose}
          className="mt-10 flex flex-col gap-1"
          linkClassName="px-1 py-3 text-base"
        />

        <SamePageScrollLink
          href={routes.contato}
          onNavigate={onClose}
          className="bg-primary text-primary-foreground focus-visible:ring-ring/50 mt-auto inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition hover:bg-primary/85 focus-visible:ring-3 focus-visible:outline-none"
        >
          Contato
        </SamePageScrollLink>
      </div>
    </div>
  );
}