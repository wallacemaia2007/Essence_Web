"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import {
  type CatalogSearchSuggestion,
  getPopularSearchCategories,
  normalizarBusca,
  searchCatalog,
  searchSite,
} from "@/data/site-search";
import { cn } from "@/lib/utils";

import { SamePageScrollLink } from "./SamePageScrollLink";

type SiteSearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

type HeaderSearchOption =
  | CatalogSearchSuggestion
  | {
      id: string;
      label: string;
      description: string;
      value: string;
      type: "recent";
    };

const RECENT_SEARCHES_STORAGE_KEY = "essence:site-search-recent";
const MAX_RECENT_SEARCHES = 5;

function readRecentSearches() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => {
        const normalized = normalizarBusca(item);
        if (!normalized || seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      })
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

const buttonClassName =
  "flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#f7f5f2] focus-visible:bg-[#f7f5f2] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#231f1b]";

export function SiteSearchDialog({
  isOpen,
  onClose,
  returnFocusRef,
}: SiteSearchDialogProps) {
  const titleId = useId();
  const optionsId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();

  const normalizedQuery = query.trim();
  const catalogResults = searchCatalog(normalizedQuery);
  const pageResults = searchSite(normalizedQuery).slice(0, 4);
  const hasCatalogResults =
    catalogResults.products.length > 0 || catalogResults.categories.length > 0;
  const popularCategories = getPopularSearchCategories();
  const options: HeaderSearchOption[] = normalizedQuery
    ? hasCatalogResults
      ? [...catalogResults.products, ...catalogResults.categories]
      : popularCategories
    : recentSearches.length > 0
      ? recentSearches.map((value, index) => ({
          id: `recent-${index}`,
          label: value,
          description: "Busca recente",
          value,
          type: "recent" as const,
        }))
      : popularCategories;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;

    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
    };
  }, [isOpen, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      setRecentSearches(readRecentSearches());
      setActiveIndex(-1);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  function submitSearch(value: string) {
    const term = value.trim();
    if (!term) return;

    const normalizedTerm = normalizarBusca(term);
    const nextSearches = [
      term,
      ...recentSearches.filter(
        (item) => normalizarBusca(item) !== normalizedTerm,
      ),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(nextSearches);

    try {
      window.localStorage.setItem(
        RECENT_SEARCHES_STORAGE_KEY,
        JSON.stringify(nextSearches),
      );
    } catch {
      // A busca continua funcionando mesmo se o navegador bloquear o storage.
    }

    onClose();
    router.push(`${routes.colecao}?busca=${encodeURIComponent(term)}`);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && options.length > 0) {
      event.preventDefault();
      setActiveIndex((current) =>
        current < 0 ? 0 : (current + 1) % options.length,
      );
      return;
    }

    if (event.key === "ArrowUp" && options.length > 0) {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? options.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch(options[activeIndex]?.value ?? query);
    }
  }

  const whatsappHref = `https://wa.me/${contato.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    normalizedQuery
      ? `Olá! Não encontrei “${normalizedQuery}” no site da Essence. Podem me ajudar?`
      : "Olá! Gostaria de ajuda para encontrar uma peça no site da Essence.",
  )}`;

  return (
    <dialog
      ref={dialogRef}
      id="site-search-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-[#231f1b] backdrop:bg-black/50"
    >
      <div className="mx-auto max-h-[calc(100dvh-0.5rem)] max-w-4xl overflow-y-auto rounded-b-2xl bg-white px-4 pt-4 pb-5 shadow-xl sm:mt-12 sm:max-h-[calc(100dvh-6rem)] sm:rounded-2xl sm:px-6 sm:pt-6 sm:pb-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="m-0 text-[0.6rem] font-semibold tracking-[0.2em] text-[#75695e] uppercase">
              Essence Passos
            </p>
            <h2
              id={titleId}
              className="font-heading mt-1 text-xl tracking-wide text-[#231f1b] uppercase"
            >
              Buscar na loja
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar busca"
            onClick={onClose}
            className="shrink-0 text-[#231f1b]"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch(options[activeIndex]?.value ?? query);
          }}
        >
          <label htmlFor="site-search-input" className="sr-only">
            Buscar produtos, categorias e páginas
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#75695e]"
            />
            <input
              ref={inputRef}
              id="site-search-input"
              name="busca"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Ex.: vestido, conjuntos, blusas"
              autoComplete="off"
              enterKeyHint="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={options.length > 0}
              aria-controls={optionsId}
              aria-activedescendant={
                activeIndex >= 0 ? `${optionsId}-${activeIndex}` : undefined
              }
              className="h-12 w-full rounded-lg border border-[rgb(35_31_27_/_0.16)] bg-white pr-4 pl-12 text-base text-[#231f1b] outline-none placeholder:text-[#75695e] focus-visible:border-[#8a6746] focus-visible:ring-2 focus-visible:ring-[#8a6746]/40"
            />
          </div>
          <p className="mt-2 mb-0 text-xs text-[#75695e]">
            Use as setas para escolher uma sugestão, Enter para buscar e Esc
            para fechar.
          </p>
        </form>

        <div className="mt-5 max-h-[min(58vh,30rem)] overflow-y-auto">
          {normalizedQuery && !hasCatalogResults ? (
            <div className="mb-5 rounded-xl border border-[#e7e1da] bg-[#faf9f7] p-4">
              <p role="status" className="m-0 text-sm leading-6 text-[#51483f]">
                Não encontramos peças ou categorias para{" "}
                <strong className="text-[#231f1b]">“{normalizedQuery}”</strong>.
                Tente uma destas categorias ou fale com a equipe Essence.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#231f1b] px-5 text-xs font-semibold tracking-wide text-white transition hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                Falar com a loja no WhatsApp
              </a>
            </div>
          ) : null}

          <section
            aria-label={
              normalizedQuery
                ? "Sugestões de busca"
                : recentSearches.length
                  ? "Buscas recentes"
                  : "Categorias populares"
            }
          >
            <h3 className="m-0 mb-2 text-[0.62rem] font-semibold tracking-[0.16em] text-[#75695e] uppercase">
              {normalizedQuery
                ? hasCatalogResults
                  ? "Peças e categorias"
                  : "Sugestões de categoria"
                : recentSearches.length > 0
                  ? "Buscas recentes"
                  : "Categorias populares"}
            </h3>
            <ul
              id={optionsId}
              role="listbox"
              aria-label="Sugestões"
              className="m-0 list-none space-y-1 p-0"
            >
              {options.map((option, index) => (
                <li key={option.id} className="p-0 before:hidden">
                  <button
                    id={`${optionsId}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => submitSearch(option.value)}
                    className={cn(
                      buttonClassName,
                      activeIndex === index && "bg-[#f7f5f2]",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#231f1b]">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#75695e]">
                        {option.type === "product"
                          ? `Peça · ${option.description}`
                          : option.type === "category"
                            ? `Categoria · ${option.description}`
                            : option.description}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-[#8b8178]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {pageResults.length > 0 ? (
            <section
              aria-label="Páginas e seções relacionadas"
              className="mt-5 border-t border-black/10 pt-4"
            >
              <h3 className="m-0 mb-2 text-[0.62rem] font-semibold tracking-[0.16em] text-[#75695e] uppercase">
                Páginas e seções
              </h3>
              <ul className="m-0 list-none space-y-1 p-0">
                {pageResults.map((entry) => (
                  <li
                    key={`${entry.href}-${entry.label}`}
                    className="p-0 before:hidden"
                  >
                    <SamePageScrollLink
                      href={entry.href}
                      onNavigate={onClose}
                      className={cn(buttonClassName, "block")}
                    >
                      <span className="block text-sm font-semibold text-[#231f1b]">
                        {entry.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-[#75695e]">
                        {entry.description}
                      </span>
                    </SamePageScrollLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
