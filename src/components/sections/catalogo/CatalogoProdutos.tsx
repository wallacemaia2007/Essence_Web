"use client";

import { ImagePlus, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Container, ThemedSection } from "@/components/common";
import { produtosVitrine, type ProdutoVitrine } from "@/data/vitrine";

import {
  type CatalogoFiltros,
  CatalogoFiltrosDrawer,
} from "./CatalogoFiltrosDrawer";

const filtrosIniciais: CatalogoFiltros = {
  precoMinimo: "",
  precoMaximo: "",
  colecoes: [],
};

function normalizarTexto(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function formatarPreco(preco: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

function precoNumerico(value: string) {
  if (!value.trim()) return null;

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function ProdutoCard({ produto }: { produto: ProdutoVitrine }) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#eee9e3]">
        {produto.imagem ? (
          <>
            <Image
              src={produto.imagem}
              alt={produto.alt}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="!rounded-none object-cover !shadow-none transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
            />
            {produto.imagemHover ? (
              <Image
                src={produto.imagemHover}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="!rounded-none object-cover opacity-0 !shadow-none transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
              />
            ) : null}
          </>
        ) : (
          <div
            role="img"
            aria-label={`Foto pendente: ${produto.alt}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#f5f1ec,#e8e0d8)] text-[#74685f]"
          >
            <ImagePlus
              className="size-9 opacity-70"
              aria-hidden="true"
              strokeWidth={1.2}
            />
            <span className="text-[0.65rem] tracking-[0.2em] uppercase">
              Adicionar foto da peça
            </span>
          </div>
        )}

        <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[0.58rem] tracking-[0.17em] text-[#51483f] uppercase">
          {produto.colecao}
        </span>
      </div>

      <div className="mt-3">
        <h2 className="text-left text-sm leading-5 text-[#231f1b] sm:text-base">
          {produto.nome}
        </h2>
        <p className="mt-1 text-left text-xs text-[#51483f] sm:text-sm">
          {produto.preco != null
            ? formatarPreco(produto.preco)
            : "Preço a cadastrar"}
        </p>
      </div>
    </article>
  );
}

export function CatalogoProdutos() {
  const [busca, setBusca] = useState("");
  const [filtros, setFiltros] = useState<CatalogoFiltros>(filtrosIniciais);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const colecoes = useMemo(
    () => [...new Set(produtosVitrine.map((produto) => produto.colecao))],
    [],
  );

  const produtosFiltrados = useMemo(() => {
    const termoBusca = normalizarTexto(busca);
    const precoMinimo = precoNumerico(filtros.precoMinimo);
    const precoMaximo = precoNumerico(filtros.precoMaximo);
    const temFiltroDePreco = precoMinimo !== null || precoMaximo !== null;

    return produtosVitrine.filter((produto) => {
      const combinaNome = normalizarTexto(produto.nome).includes(termoBusca);
      const combinaColecao =
        filtros.colecoes.length === 0 ||
        filtros.colecoes.includes(produto.colecao);

      if (!combinaNome || !combinaColecao) return false;
      if (!temFiltroDePreco) return true;
      if (produto.preco == null) return false;
      if (precoMinimo !== null && produto.preco < precoMinimo) return false;
      if (precoMaximo !== null && produto.preco > precoMaximo) return false;

      return true;
    });
  }, [busca, filtros]);

  const filtrosAtivos =
    Number(Boolean(filtros.precoMinimo)) +
    Number(Boolean(filtros.precoMaximo)) +
    filtros.colecoes.length;

  return (
    <ThemedSection className="min-h-[70vh] bg-[#f8f6f2] py-12 text-[#231f1b] sm:py-16 md:py-20">
      <Container className="max-w-[1600px] px-5 sm:px-7 lg:px-10">
        <header className="mb-8 border-b border-[#ded7ce] pb-7 md:mb-10 md:pb-9">
          <p className="text-xs font-medium tracking-[0.22em] text-[#75695e] uppercase">
            Essence — coleção
          </p>
          <h1 className="font-heading mt-2 text-3xl leading-tight tracking-wide uppercase sm:text-4xl md:text-5xl">
            Nosso catálogo
          </h1>
          <p className="mt-3 max-w-2xl text-left text-sm leading-6 text-[#665b52] sm:text-base">
            Explore as peças da coleção e encontre seu próximo look.
          </p>
        </header>

        <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row">
          <label className="relative block min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#75695e]"
              aria-hidden="true"
              strokeWidth={1.6}
            />
            <span className="sr-only">Buscar produtos por nome</span>
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome"
              autoComplete="off"
              className="h-12 w-full border border-[#d8d0c7] bg-white pr-4 pl-12 text-sm text-[#231f1b] transition-colors outline-none placeholder:text-[#897f75] focus:border-[#75695e] focus:ring-2 focus:ring-[#75695e]/15"
            />
          </label>

          <button
            type="button"
            onClick={() => setDrawerAberto(true)}
            aria-haspopup="dialog"
            aria-expanded={drawerAberto}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border border-[#231f1b] px-5 text-xs font-semibold tracking-[0.15em] text-[#231f1b] uppercase transition-colors hover:bg-[#231f1b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros
            {filtrosAtivos > 0 ? (
              <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-[#231f1b] text-[0.65rem] text-white">
                {filtrosAtivos}
              </span>
            ) : null}
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-left text-sm text-[#665b52]">
            {produtosFiltrados.length === 1
              ? "1 peça"
              : `${produtosFiltrados.length} peças`}
          </p>
          {filtrosAtivos > 0 || busca ? (
            <button
              type="button"
              onClick={() => {
                setBusca("");
                setFiltros(filtrosIniciais);
              }}
              className="min-h-11 text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Limpar busca e filtros
            </button>
          ) : null}
        </div>

        {produtosFiltrados.length > 0 ? (
          <ul className="grid list-none grid-cols-1 gap-x-5 gap-y-9 p-0 before:hidden sm:grid-cols-2 sm:gap-x-6 sm:gap-y-11 xl:grid-cols-3 xl:gap-x-8">
            {produtosFiltrados.map((produto) => (
              <li key={produto.id} className="min-w-0 p-0 before:hidden">
                <ProdutoCard produto={produto} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-[#cfc5ba] bg-white/60 px-6 py-16 text-center">
            <p className="text-left text-base text-[#231f1b]">
              Nenhuma peça encontrada.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#665b52]">
              Tente outro nome ou ajuste os filtros selecionados.
            </p>
          </div>
        )}
      </Container>

      {drawerAberto ? (
        <CatalogoFiltrosDrawer
          colecoes={colecoes}
          filtrosAtuais={filtros}
          onAplicar={(novosFiltros) => {
            setFiltros(novosFiltros);
            setDrawerAberto(false);
          }}
          onFechar={() => setDrawerAberto(false)}
        />
      ) : null}
    </ThemedSection>
  );
}
