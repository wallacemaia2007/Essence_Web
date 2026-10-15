"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
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
  const router = useRouter();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [query, setQuery] = useState("");
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
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
    <div className="fixed inset-0 z-[110]">
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
        className="drawer-enter-top absolute inset-x-0 top-0 border-b border-[rgb(35_31_27_/_0.1)] bg-white px-4 pt-4 pb-5 text-[#231f1b] shadow-xl lg:inset-x-auto lg:top-[12vh] lg:left-1/2 lg:w-[min(38rem,calc(100vw-3rem))] lg:-translate-x-1/2 lg:rounded-xl lg:border lg:shadow-2xl"
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
            const term = query.trim();
            if (!term) return;
            router.push(`${routes.colecao}?busca=${encodeURIComponent(term)}`);
            onClose();
          }}
        >
          <label htmlFor="site-search-input" className="sr-only">
            O que você procura?
          </label>
          <input
            ref={inputRef}
            id="site-search-input"
            role="combobox"
            name="s"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveResultIndex(-1);
            }}
            onKeyDown={(event) => {
              if (results.length === 0) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveResultIndex((current) =>
                  current >= results.length - 1 ? 0 : current + 1,
                );
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveResultIndex((current) =>
                  current <= 0 ? results.length - 1 : current - 1,
                );
              } else if (event.key === "Enter" && activeResultIndex >= 0) {
                event.preventDefault();
                resultRefs.current[activeResultIndex]?.click();
              }
            }}
            placeholder="Ex.: vestido midi, conjuntos de verão, blusas"
            autoComplete="off"
            enterKeyHint="search"
            aria-controls={
              results.length > 0 ? "site-search-options" : undefined
            }
            aria-expanded={results.length > 0}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-activedescendant={
              activeResultIndex >= 0
                ? `site-search-result-${activeResultIndex}`
                : undefined
            }
            className="h-12 w-full rounded-lg border border-[rgb(35_31_27_/_0.16)] bg-white px-3 text-base text-[#231f1b] outline-none placeholder:text-[#756d65] focus-visible:border-[#8a6746] focus-visible:ring-2 focus-visible:ring-[#8a6746]/40"
          />
        </form>

        <div
          id="site-search-status"
          aria-live="polite"
          className="mt-4 max-h-[min(60vh,24rem)] overflow-y-auto"
        >
          {!query.trim() ? (
            <p className="m-0 text-sm leading-relaxed text-[#655e57]">
              Digite para buscar peças, categorias e conjuntos.
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
            <ul
              id="site-search-options"
              role="listbox"
              aria-label="Sugestões de busca"
              className="m-0 list-none space-y-1 p-0"
            >
              {results.map((entry, index) => (
                <li key={`${entry.href}-${entry.label}`}>
                  <SamePageScrollLink
                    ref={(element) => {
                      resultRefs.current[index] = element;
                    }}
                    id={`site-search-result-${index}`}
                    role="option"
                    aria-selected={activeResultIndex === index}
                    href={entry.href}
                    onNavigate={onClose}
                    className={cn(
                      "block rounded-lg px-3 py-3 transition-colors",
                      "hover:bg-[rgb(35_31_27_/_0.04)]",
                      activeResultIndex === index &&
                        "bg-[rgb(35_31_27_/_0.04)]",
                      "focus-visible:bg-[rgb(35_31_27_/_0.04)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]",
                    )}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-[#231f1b]">
                        {entry.label}
                      </span>
                      <span className="shrink-0 rounded-full border border-[#e5e0da] px-2 py-0.5 text-[0.6rem] font-medium tracking-wide text-[#75695e] uppercase">
                        {entry.kind}
                      </span>
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
