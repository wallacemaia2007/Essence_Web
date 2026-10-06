"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type CatalogoFiltros = {
  precoMinimo: string;
  precoMaximo: string;
  colecoes: string[];
};

type CatalogoFiltrosDrawerProps = {
  colecoes: string[];
  filtrosAtuais: CatalogoFiltros;
  onAplicar: (filtros: CatalogoFiltros) => void;
  onFechar: () => void;
};

const filtrosVazios: CatalogoFiltros = {
  precoMinimo: "",
  precoMaximo: "",
  colecoes: [],
};

export function CatalogoFiltrosDrawer({
  colecoes,
  filtrosAtuais,
  onAplicar,
  onFechar,
}: CatalogoFiltrosDrawerProps) {
  const [rascunho, setRascunho] = useState<CatalogoFiltros>(filtrosAtuais);
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
        className="motion-safe:animate-in motion-safe:slide-in-from-right absolute inset-y-0 right-0 flex h-dvh w-full max-w-[26rem] flex-col bg-[#fbf9f6] text-[#231f1b] shadow-2xl outline-none motion-safe:duration-300"
      >
        <header className="flex items-center justify-between border-b border-[#ded7ce] px-6 py-5">
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
            className="inline-flex size-11 items-center justify-center rounded-full border border-[#d8d0c7] transition-colors hover:bg-[#f0ebe5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7">
          <fieldset className="space-y-4 border-0 p-0">
            <legend className="text-sm font-semibold tracking-[0.08em] uppercase">
              Preço
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs text-[#665b52]">
                Mínimo
                <span className="mt-2 flex h-11 items-center border border-[#d8d0c7] bg-white px-3 focus-within:border-[#75695e] focus-within:ring-2 focus-within:ring-[#75695e]/15">
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
                <span className="mt-2 flex h-11 items-center border border-[#d8d0c7] bg-white px-3 focus-within:border-[#75695e] focus-within:ring-2 focus-within:ring-[#75695e]/15">
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

          <fieldset className="space-y-4 border-0 border-t border-[#ded7ce] p-0 pt-7">
            <legend className="text-sm font-semibold tracking-[0.08em] uppercase">
              Coleções
            </legend>
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
          </fieldset>
        </div>

        <footer className="border-t border-[#ded7ce] bg-[#fbf9f6] px-6 py-5">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setRascunho(filtrosVazios)}
              className="min-h-11 text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
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
            className="flex h-12 w-full items-center justify-center bg-[#231f1b] px-4 text-xs font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
          >
            Aplicar filtros
          </button>
        </footer>
      </aside>
    </div>
  );
}
