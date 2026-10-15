"use client";

import { Compass, FolderOpen, Layers, Shirt, Tag, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { searchSite, type SiteSearchEntry } from "@/data/site-search";
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

const resultVisuals: Record<
  SiteSearchEntry["kind"],
  {
    icon: typeof Shirt;
    frame: string;
    badge: string;
  }
> = {
  Peça: {
    icon: Shirt,
    frame: "border-[#e5d7c8] bg-[#f7f1eb] text-[#765b40]",
    badge: "border-[#ddcbb8] bg-[#faf5ef] text-[#72583e]",
  },
  Categoria: {
    icon: Tag,
    frame: "border-[#d4ddcf] bg-[#f2f6ef] text-[#52634a]",
    badge: "border-[#cbd7c5] bg-[#f5f8f2] text-[#52634a]",
  },
  Conjunto: {
    icon: Layers,
    frame: "border-[#d8ccbd] bg-[#f5f0e9] text-[#6d5943]",
    badge: "border-[#d6c8b7] bg-[#f7f3ed] text-[#6d5943]",
  },
  Coleção: {
    icon: FolderOpen,
    frame: "border-[#ddd5c5] bg-[#f7f5ee] text-[#6c644f]",
    badge: "border-[#d8d1c3] bg-[#f8f6f0] text-[#6c644f]",
  },
  Página: {
    icon: Compass,
    frame: "border-[#d2d9de] bg-[#f2f5f7] text-[#52616d]",
    badge: "border-[#cbd3d9] bg-[#f4f6f8] text-[#52616d]",
  },
};

function SearchResultVisual({ entry }: { entry: SiteSearchEntry }) {
  const visual = resultVisuals[entry.kind];
  const Icon = visual.icon;

  if (entry.kind === "Peça" && entry.image) {
    return (
      <span
        aria-hidden="true"
        className="relative block h-[4.5rem] w-14 shrink-0 overflow-hidden rounded-md border border-[#e8e1d8] bg-[#f6f2ed]"
      >
        <Image
          src={entry.image}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-12 shrink-0 items-center justify-center border",
        entry.kind === "Categoria" || entry.kind === "Página"
          ? "rounded-full"
          : "rounded-lg",
        visual.frame,
      )}
    >
      <Icon className="size-5" strokeWidth={1.6} />
    </span>
  );
}

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
  const [desktopPosition, setDesktopPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const results = searchSite(query);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const updatePosition = () => {
      if (!desktopQuery.matches) {
        setDesktopPosition(null);
        return;
      }

      const anchor = returnFocusRef.current?.getBoundingClientRect();
      const panel = panelRef.current?.getBoundingClientRect();
      if (!anchor || !panel) return;

      const margin = 12;
      const panelWidth =
        panel.width || Math.min(544, window.innerWidth - margin * 2);
      const panelHeight = panel.height;
      const left = Math.max(
        margin,
        Math.min(anchor.left, window.innerWidth - panelWidth - margin),
      );
      const top = Math.max(
        margin,
        Math.min(anchor.bottom + 8, window.innerHeight - panelHeight - margin),
      );

      setDesktopPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    desktopQuery.addEventListener("change", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      desktopQuery.removeEventListener("change", updatePosition);
    };
  }, [isOpen, returnFocusRef]);

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
        className="drawer-enter-backdrop absolute inset-0 bg-transparent"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={desktopPosition ?? undefined}
        className="drawer-enter-top absolute inset-x-0 top-0 border-b border-[rgb(35_31_27_/_0.1)] bg-white px-4 pt-4 pb-5 text-[#231f1b] shadow-xl lg:inset-x-auto lg:top-0 lg:right-auto lg:left-0 lg:w-[min(34rem,calc(100vw-3rem))] lg:translate-x-0 lg:rounded-xl lg:border lg:shadow-2xl"
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
                      "flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 transition-colors",
                      "hover:bg-[rgb(35_31_27_/_0.04)]",
                      activeResultIndex === index &&
                        "bg-[rgb(35_31_27_/_0.04)]",
                      "focus-visible:bg-[rgb(35_31_27_/_0.04)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]",
                      entry.kind === "Categoria" && "border-l-[#8a9a7d]",
                      entry.kind === "Peça" && "border-l-[#b49878]",
                      entry.kind === "Conjunto" && "border-l-[#9b856c]",
                      entry.kind === "Coleção" && "border-l-[#b0a17e]",
                      entry.kind === "Página" && "border-l-[#83929c]",
                    )}
                  >
                    <SearchResultVisual entry={entry} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-[#231f1b]">
                          {entry.label}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-medium tracking-wide uppercase",
                            resultVisuals[entry.kind].badge,
                          )}
                        >
                          {entry.kind}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-[#655e57]">
                        {entry.description}
                      </span>
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
