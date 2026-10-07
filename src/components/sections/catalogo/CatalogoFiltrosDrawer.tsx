"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type CatalogoFiltros = {
  precoMinimo: string;
  precoMaximo: string;
  categorias: string[];
  colecoes: string[];
};

type CategoriaFiltro = {
  nome: string;
  quantidade: number;
};

type CatalogoFiltrosDrawerProps = {
  categorias: CategoriaFiltro[];
  colecoes: string[];
  filtrosAtuais: CatalogoFiltros;
  onAplicar: (filtros: CatalogoFiltros) => void;
  onFechar: () => void;
};

const filtrosVazios: CatalogoFiltros = {
  precoMinimo: "",
  precoMaximo: "",
  categorias: [],
  colecoes: [],
};

export function CatalogoFiltrosDrawer({
  categorias,
  colecoes,
  filtrosAtuais,
  onAplicar,
  onFechar,
}: CatalogoFiltrosDrawerProps) {
  const [rascunho, setRascunho] = useState<CatalogoFiltros>(filtrosAtuais);
  const [categoriasAbertas, setCategoriasAbertas] = useState(true);
  const [colecoesAbertas, setColecoesAbertas] = useState(true);
  const painelRef = useRef<HTMLElement>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const precoMinimo = rascunho.precoMinimo
    ? Number(rascunho.precoMinimo)
    : null;
  const precoMaximo = rascunho.precoMaximo
    ? Number(rascunho.precoMaximo)
    : null;
  const faixaInvalida =
    precoMinimo !== null && precoMaximo !== null && precoMinimo > precoMaximo;

  useEffect(() => {
    const elementoAnterior =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    fecharRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onFechar();
        return;
      }

      if (event.key !== "Tab" || !painelRef.current) return;

      const focaveis = painelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const primeiro = focaveis.item(0);
      const ultimo = focaveis.item(focaveis.length - 1);

      if (!primeiro || !ultimo) return;

      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", handleKeyDown);
      elementoAnterior?.focus();
    };
  }, [onFechar]);

  const setFaixa = (campo: "precoMinimo" | "precoMaximo", valor: string) => {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  };

  const alternarColecao = (colecao: string) => {
    setRascunho((atual) => ({
      ...atual,
      colecoes: atual.colecoes.includes(colecao)
        ? atual.colecoes.filter((item) => item !== colecao)
        : [...atual.colecoes, colecao],
    }));
  };

  const alternarCategoria = (categoria: string) => {
    setRascunho((atual) => ({
      ...atual,
      categorias: atual.categorias.includes(categoria)
        ? atual.categorias.filter((item) => item !== categoria)
        : [...atual.categorias, categoria],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#231f1b]/45"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <aside
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogo-filtros-title"
        tabIndex={-1}
        className="motion-safe:animate-in motion-safe:slide-in-from-right absolute inset-y-0 right-0 grid h-dvh w-full max-w-[26rem] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-white text-[#231f1b] shadow-2xl outline-none motion-safe:duration-300"
      >
        <header className="flex items-center justify-between border-b border-[#e5e5e5] px-6 py-5">
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.2em] text-[#75695e] uppercase">
              Refine sua busca
            </p>
            <h2
              id="catalogo-filtros-title"
              className="font-heading mt-1 text-2xl tracking-wide uppercase"
            >
              Filtros
            </h2>
          </div>
          <button
            ref={fecharRef}
            type="button"
            onClick={onFechar}
            aria-label="Fechar filtros"
            className="inline-flex size-11 items-center justify-center rounded-full border border-[#dedede] transition-colors hover:bg-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div
          data-lenis-prevent
          className="min-h-0 space-y-8 overflow-y-auto overscroll-y-contain px-6 py-7 touch-pan-y [-webkit-overflow-scrolling:touch]"
        >
          <fieldset className="space-y-4 border-0 p-0">
            <legend className="text-sm font-semibold tracking-[0.08em] uppercase">
              Preço
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[#665b52]">
                Mínimo
                <span className="mt-2 flex h-11 items-center border border-[#dedede] bg-white px-3 focus-within:border-[#75695e] focus-within:ring-2 focus-within:ring-[#75695e]/15">
                  <span aria-hidden="true" className="mr-2 text-[#75695e]">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={rascunho.precoMinimo}
                    onChange={(event) =>
                      setFaixa("precoMinimo", event.target.value)
                    }
                    aria-label="Preço mínimo em reais"
                    placeholder="0,00"
                    className="w-full min-w-0 bg-transparent text-sm text-[#231f1b] outline-none placeholder:text-[#9a9086]"
                  />
                </span>
              </label>
              <label className="block text-xs text-[#665b52]">
                Máximo
                <span className="mt-2 flex h-11 items-center border border-[#dedede] bg-white px-3 focus-within:border-[#75695e] focus-within:ring-2 focus-within:ring-[#75695e]/15">
                  <span aria-hidden="true" className="mr-2 text-[#75695e]">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={rascunho.precoMaximo}
                    onChange={(event) =>
                      setFaixa("precoMaximo", event.target.value)
                    }
                    aria-label="Preço máximo em reais"
                    placeholder="Qualquer valor"
                    className="w-full min-w-0 bg-transparent text-sm text-[#231f1b] outline-none placeholder:text-[#9a9086]"
                  />
                </span>
              </label>
            </div>
            <p className="text-xs leading-5 text-[#75695e]">
              Preencha um valor mínimo, máximo ou ambos.
            </p>
            {faixaInvalida ? (
              <p
                id="catalogo-preco-error"
                role="alert"
                className="text-xs leading-5 text-red-800"
              >
                O preço mínimo deve ser menor ou igual ao máximo.
              </p>
            ) : null}
          </fieldset>

          <fieldset className="space-y-1 border-t border-[#e5e5e5] p-0 pt-7">
            <legend className="sr-only">
              Categorias
            </legend>
            <button
              type="button"
              onClick={() => setCategoriasAbertas((abertas) => !abertas)}
              aria-expanded={categoriasAbertas}
              aria-controls="catalogo-categorias-opcoes"
              aria-label={
                categoriasAbertas ? "Recolher categorias" : "Expandir categorias"
              }
              className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 py-2 text-left text-sm font-semibold tracking-[0.08em] text-[#231f1b] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              <span>Categorias</span>
              <ChevronDown
                className={`size-4 transition-transform motion-reduce:transition-none ${
                  categoriasAbertas ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            <div
              id="catalogo-categorias-opcoes"
              hidden={!categoriasAbertas}
            >
              {categorias.length > 0 ? (
                <ul className="space-y-1 p-0">
                  {categorias.map(({ nome, quantidade }) => {
                    const selecionada = rascunho.categorias.includes(nome);
                    const indisponivel = quantidade === 0;

                    return (
                      <li key={nome} className="list-none p-0 before:hidden">
                        <label
                          className={`flex min-h-11 items-center gap-3 text-sm text-[#51483f] ${
                            indisponivel
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selecionada}
                            disabled={indisponivel}
                            onChange={() => alternarCategoria(nome)}
                            className="size-4 accent-[#231f1b]"
                          />
                          <span className="flex-1">{nome}</span>
                          <span
                            aria-label={`${quantidade} peças nesta categoria`}
                            className="text-xs tabular-nums text-[#75695e]"
                          >
                            {quantidade}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-[#75695e]">
                  Nenhuma categoria cadastrada ainda.
                </p>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t border-[#e5e5e5] p-0 pt-7">
            <legend className="sr-only">
              Coleções
            </legend>
            <button
              type="button"
              onClick={() => setColecoesAbertas((abertas) => !abertas)}
              aria-expanded={colecoesAbertas}
              aria-controls="catalogo-colecoes-opcoes"
              aria-label={
                colecoesAbertas ? "Recolher coleções" : "Expandir coleções"
              }
              className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 py-2 text-left text-sm font-semibold tracking-[0.08em] text-[#231f1b] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              <span>Coleções</span>
              <ChevronDown
                className={`size-4 transition-transform motion-reduce:transition-none ${
                  colecoesAbertas ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            <div id="catalogo-colecoes-opcoes" hidden={!colecoesAbertas}>
              {colecoes.length > 0 ? (
                <ul className="space-y-1 p-0">
                  {colecoes.map((colecao) => {
                    const selecionada = rascunho.colecoes.includes(colecao);

                    return (
                      <li key={colecao} className="list-none p-0 before:hidden">
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#51483f]">
                          <input
                            type="checkbox"
                            checked={selecionada}
                            onChange={() => alternarColecao(colecao)}
                            className="size-4 accent-[#231f1b]"
                          />
                          <span>{colecao}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-[#75695e]">
                  Nenhuma coleção cadastrada ainda.
                </p>
              )}
            </div>
          </fieldset>
        </div>

        <footer className="border-t border-[#e5e5e5] bg-white px-6 py-5">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setRascunho(filtrosVazios)}
              className="cursor-pointer min-h-11 text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Limpar filtros
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAplicar(rascunho)}
            disabled={faixaInvalida}
            aria-describedby={
              faixaInvalida ? "catalogo-preco-error" : undefined
            }
            className="cursor-pointer flex h-12 w-full items-center justify-center bg-[#231f1b] px-4 text-xs font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
          >
            Aplicar filtros
          </button>
        </footer>
      </aside>
    </div>
  );
}
