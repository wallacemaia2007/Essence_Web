"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { CategoriaProduto } from "@/data/vitrine";
import {
  type CatalogoAtributo,
  type CatalogoFiltros,
  type CatalogoOpcao,
  type CatalogoOpcaoCor,
  criarFiltrosVazios,
} from "@/lib/catalogo-filtros";

type CategoriaFiltro = {
  nome: CategoriaProduto;
  quantidade: number;
};

type CatalogoFiltrosDrawerProps = {
  categorias: CategoriaFiltro[];
  colecoes: string[];
  tamanhos: CatalogoOpcao[];
  cores: CatalogoOpcaoCor[];
  atributos: CatalogoAtributo[];
  filtrosAtuais: CatalogoFiltros;
  contarResultados: (filtros: CatalogoFiltros) => number;
  onAplicar: (filtros: CatalogoFiltros) => void;
  onFechar: () => void;
};

function CheckboxOpcao({
  checked,
  disabled = false,
  label,
  quantity,
  swatch,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  quantity?: number;
  swatch?: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-11 items-center gap-3 text-sm text-[#51483f] ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="size-4 accent-[#231f1b]"
      />
      {swatch ? (
        <span
          aria-hidden="true"
          className="size-4 shrink-0 rounded-full border border-black/15"
          style={{ backgroundColor: swatch }}
        />
      ) : null}
      <span className="flex-1">{label}</span>
      {quantity !== undefined ? (
        <span
          aria-hidden="true"
          className="text-xs text-[#75695e] tabular-nums"
        >
          {quantity}
        </span>
      ) : null}
    </label>
  );
}

export function CatalogoFiltrosDrawer({
  categorias,
  colecoes,
  tamanhos,
  cores,
  atributos,
  filtrosAtuais,
  contarResultados,
  onAplicar,
  onFechar,
}: CatalogoFiltrosDrawerProps) {
  const [rascunho, setRascunho] = useState<CatalogoFiltros>(filtrosAtuais);
  const [hasEntered, setHasEntered] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const precoMinimo = rascunho.precoMinimo
    ? Number(rascunho.precoMinimo.replace(",", "."))
    : null;
  const precoMaximo = rascunho.precoMaximo
    ? Number(rascunho.precoMaximo.replace(",", "."))
    : null;
  const faixaInvalida =
    precoMinimo !== null && precoMaximo !== null && precoMinimo > precoMaximo;
  const atributosVisiveis = atributos.filter((atributo) =>
    atributo.categorias.some((categoria) =>
      rascunho.categorias.includes(categoria),
    ),
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const frameId = window.requestAnimationFrame(() => setHasEntered(true));

    return () => {
      window.cancelAnimationFrame(frameId);
      if (dialog.open) dialog.close();
      document.body.style.overflow = overflowAnterior;
    };
  }, []);

  const alternarLista = (
    campo: "colecoes" | "cores" | "tamanhos",
    valor: string,
  ) => {
    setRascunho((atual) => ({
      ...atual,
      [campo]: atual[campo].includes(valor)
        ? atual[campo].filter((item) => item !== valor)
        : [...atual[campo], valor],
    }));
  };

  const alternarCategoria = (categoria: CategoriaProduto) => {
    setRascunho((atual) => {
      const categoriasAtualizadas = atual.categorias.includes(categoria)
        ? atual.categorias.filter((item) => item !== categoria)
        : [...atual.categorias, categoria];
      const chavesVisiveis = new Set(
        atributos
          .filter((atributo) =>
            atributo.categorias.some((item) =>
              categoriasAtualizadas.includes(item),
            ),
          )
          .map((atributo) => atributo.chave),
      );

      return {
        ...atual,
        categorias: categoriasAtualizadas,
        atributos: Object.fromEntries(
          Object.entries(atual.atributos).filter(([chave]) =>
            chavesVisiveis.has(chave),
          ),
        ),
      };
    });
  };

  const alternarAtributo = (chave: string, valor: string) => {
    setRascunho((atual) => {
      const valores = atual.atributos[chave] ?? [];
      const atualizados = valores.includes(valor)
        ? valores.filter((item) => item !== valor)
        : [...valores, valor];
      const atributosAtualizados = { ...atual.atributos };

      if (atualizados.length > 0) atributosAtualizados[chave] = atualizados;
      else delete atributosAtualizados[chave];

      return { ...atual, atributos: atributosAtualizados };
    });
  };

  return (
    <dialog
      ref={dialogRef}
      data-drawer="filters"
      data-drawer-entered={hasEntered ? "true" : "false"}
      aria-labelledby="catalogo-filtros-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-left text-[#231f1b] backdrop:bg-[#231f1b]/50"
      onCancel={(event) => {
        event.preventDefault();
        onFechar();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <section
        style={
          hasEntered ? undefined : { opacity: 0, transform: "translateX(100%)" }
        }
        className="absolute inset-y-0 right-0 grid h-dvh w-full max-w-[28rem] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-white shadow-2xl"
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
          className="min-h-0 touch-pan-y space-y-7 overflow-y-auto overscroll-y-contain px-6 py-6 [-webkit-overflow-scrolling:touch]"
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
                      setRascunho((atual) => ({
                        ...atual,
                        precoMinimo: event.target.value,
                      }))
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
                      setRascunho((atual) => ({
                        ...atual,
                        precoMaximo: event.target.value,
                      }))
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
              <p role="alert" className="text-xs leading-5 text-red-800">
                O preço mínimo deve ser menor ou igual ao máximo.
              </p>
            ) : null}
          </fieldset>

          <fieldset className="space-y-1 border-t border-[#e5e5e5] p-0 pt-6">
            <legend className="pb-2 text-sm font-semibold tracking-[0.08em] uppercase">
              Categorias
            </legend>
            {categorias.map(({ nome, quantidade }) => (
              <CheckboxOpcao
                key={nome}
                checked={rascunho.categorias.includes(nome)}
                disabled={quantidade === 0}
                label={nome}
                quantity={quantidade}
                onChange={() => alternarCategoria(nome)}
              />
            ))}
          </fieldset>

          <fieldset className="space-y-1 border-t border-[#e5e5e5] p-0 pt-6">
            <legend className="pb-2 text-sm font-semibold tracking-[0.08em] uppercase">
              Coleções
            </legend>
            {colecoes.map((colecao) => (
              <CheckboxOpcao
                key={colecao}
                checked={rascunho.colecoes.includes(colecao)}
                label={colecao}
                onChange={() => alternarLista("colecoes", colecao)}
              />
            ))}
          </fieldset>

          <fieldset className="space-y-1 border-t border-[#e5e5e5] p-0 pt-6">
            <legend className="pb-2 text-sm font-semibold tracking-[0.08em] uppercase">
              Tamanho
            </legend>
            {tamanhos.length > 0 ? (
              tamanhos.map(({ nome, quantidade }) => (
                <CheckboxOpcao
                  key={nome}
                  checked={rascunho.tamanhos.includes(nome)}
                  label={nome}
                  quantity={quantidade}
                  onChange={() => alternarLista("tamanhos", nome)}
                />
              ))
            ) : (
              <p className="text-sm text-[#75695e]">
                Tamanhos ainda não cadastrados.
              </p>
            )}
            <p className="pt-1 text-xs leading-5 text-[#75695e]">
              Estoque e grade de tamanhos demonstrativos; confirme com a loja.
            </p>
          </fieldset>

          <fieldset className="space-y-1 border-t border-[#e5e5e5] p-0 pt-6">
            <legend className="pb-2 text-sm font-semibold tracking-[0.08em] uppercase">
              Cor
            </legend>
            {cores.length > 0 ? (
              cores.map(({ nome, quantidade, hex }) => (
                <CheckboxOpcao
                  key={nome}
                  checked={rascunho.cores.includes(nome)}
                  label={nome}
                  quantity={quantidade}
                  swatch={hex}
                  onChange={() => alternarLista("cores", nome)}
                />
              ))
            ) : (
              <p className="text-sm text-[#75695e]">
                Cores ainda não cadastradas.
              </p>
            )}
          </fieldset>

          <fieldset className="space-y-1 border-t border-[#e5e5e5] p-0 pt-6">
            <legend className="pb-2 text-sm font-semibold tracking-[0.08em] uppercase">
              Disponibilidade
            </legend>
            <CheckboxOpcao
              checked={rascunho.promocao}
              label="Em promoção"
              onChange={() =>
                setRascunho((atual) => ({
                  ...atual,
                  promocao: !atual.promocao,
                }))
              }
            />
            <CheckboxOpcao
              checked={rascunho.disponivel}
              label="Disponível"
              onChange={() =>
                setRascunho((atual) => ({
                  ...atual,
                  disponivel: !atual.disponivel,
                }))
              }
            />
            <p className="pt-1 text-xs leading-5 text-[#75695e]">
              “Disponível” considera apenas peças com estoque informado.
            </p>
          </fieldset>

          {atributosVisiveis.map((atributo) => (
            <fieldset
              key={atributo.chave}
              className="space-y-1 border-t border-[#e5e5e5] p-0 pt-6"
            >
              <legend className="pb-2 text-sm font-semibold tracking-[0.08em] uppercase">
                {atributo.rotulo}
              </legend>
              {atributo.opcoes.map(({ nome, quantidade }) => (
                <CheckboxOpcao
                  key={nome}
                  checked={(rascunho.atributos[atributo.chave] ?? []).includes(
                    nome,
                  )}
                  label={nome}
                  quantity={quantidade}
                  onChange={() => alternarAtributo(atributo.chave, nome)}
                />
              ))}
            </fieldset>
          ))}
        </div>

        <footer className="border-t border-[#e5e5e5] bg-white px-6 py-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setRascunho(criarFiltrosVazios())}
              className="min-h-11 text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Limpar tudo
            </button>
            <span className="text-xs text-[#665b52]">
              {contarResultados(rascunho)} peças
            </span>
          </div>
          <button
            type="button"
            onClick={() => onAplicar(rascunho)}
            disabled={faixaInvalida}
            className="flex h-12 w-full items-center justify-center bg-[#231f1b] px-4 text-xs font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            Ver {contarResultados(rascunho)} peças
          </button>
        </footer>
      </section>
    </dialog>
  );
}
