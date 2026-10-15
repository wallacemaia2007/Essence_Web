"use client";

import { X } from "lucide-react";
import type { RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { searchSite } from "@/data/site-search";
import { cn } from "@/lib/utils";

import { SamePageScrollLink } from "./SamePageScrollLink";

type SiteSearchDialogProps = {
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

/**
 * Diálogo de busca acessível (mobile-first).
 * Não há backend de busca: o índice é local (`src/data/site-search.ts`).
 * Ponto de integração futura: trocar `searchSite` por uma chamada de API.
 */
export function SiteSearchDialog({
  isOpen,
  onClose,
  returnFocusRef,
}: SiteSearchDialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = searchSite(query);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;

    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
    };
  }, [isOpen, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] lg:hidden">
      <button
        type="button"
        aria-label="Fechar busca"
        onClick={onClose}
        className="drawer-enter-backdrop absolute inset-0 bg-black/50"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="drawer-enter-top absolute inset-x-0 top-0 border-b border-[rgb(35_31_27_/_0.1)] bg-white px-4 pt-4 pb-5 text-[#231f1b] shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-sm font-semibold tracking-wide">
            Buscar no site
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar busca"
            onClick={onClose}
            className="text-[#231f1b]"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label htmlFor="site-search-input" className="sr-only">
            O que você procura?
          </label>
          <input
            ref={inputRef}
            id="site-search-input"
            name="s"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex.: contato, conjuntos, localização"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-lg border border-[rgb(35_31_27_/_0.16)] bg-white px-3 text-base text-[#231f1b] outline-none placeholder:text-[#756d65] focus-visible:border-[#8a6746] focus-visible:ring-2 focus-visible:ring-[#8a6746]/40"
          />
        </form>

        <div className="mt-4 max-h-[min(60vh,24rem)] overflow-y-auto">
          {!query.trim() ? (
            <p className="m-0 text-sm leading-relaxed text-[#655e57]">
              Digite para buscar páginas e seções do site.
            </p>
          ) : results.length === 0 ? (
            <p className="m-0 text-sm leading-relaxed text-[#655e57]">
              Nenhum resultado para{" "}
              <span className="font-semibold text-[#231f1b]">
                “{query.trim()}”
              </span>
              .
            </p>
          ) : (
            <ul className="m-0 list-none space-y-1 p-0">
              {results.map((entry) => (
                <li key={`${entry.href}-${entry.label}`}>
                  <SamePageScrollLink
                    href={entry.href}
                    onNavigate={onClose}
                    className={cn(
                      "block rounded-lg px-3 py-3 transition-colors",
                      "hover:bg-[rgb(35_31_27_/_0.04)]",
                      "focus-visible:bg-[rgb(35_31_27_/_0.04)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]",
                    )}
                  >
                    <span className="block text-sm font-semibold text-[#231f1b]">
                      {entry.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-[#655e57]">
                      {entry.description}
                    </span>
                  </SamePageScrollLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
