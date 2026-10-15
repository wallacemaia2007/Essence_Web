"use client";

import { useLenis } from "lenis/react";
import { ImagePlus, Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

import { Container, ImageBanner, ThemedSection } from "@/components/common";
import { FavoritoButton } from "@/components/common/favorito-button";
import { PrecoProduto } from "@/components/sections/catalogo/PrecoProduto";
import { routes } from "@/constants/routes";
import { novidadesData } from "@/data/novidades";
import { outletConditions } from "@/data/outlet";
import {
  type CategoriaProduto,
  CATEGORIAS_PRODUTO,
  produtosVitrine,
  type ProdutoVitrine,
} from "@/data/vitrine";
import {
  type CatalogoFiltros,
  type CatalogoOrdenacao,
  contarFiltrosAtivos,
  criarFiltrosVazios,
  filtrarProdutosCatalogo,
  obterAtributosCatalogo,
  ordenarTamanhos,
  parseFiltrosCatalogo,
  parseOrdenacaoCatalogo,
  tamanhosDisponiveis,
} from "@/lib/catalogo-filtros";
import {
  type CatalogoOpcao,
  type CatalogoOpcaoCor,
} from "@/lib/catalogo-filtros";
import { emPromocao, percentualDesconto } from "@/lib/pricing";
import {
  caminhoDoProduto,
  formatarPreco,
  linkBaseWhatsapp,
} from "@/lib/produto";

import { PaginacaoProdutos } from "../colecao/PaginacaoProdutos";
import { CatalogoFiltrosDrawer } from "./CatalogoFiltrosDrawer";

const ITENS_POR_PAGINA = 18;

const produtosOutlet = produtosVitrine.filter(
  (produto) => produto.outlet && emPromocao(produto),
);
const ordemOriginalCatalogo = new Map(
  produtosVitrine.map((produto, indice) => [produto.id, indice]),
);
const ordemNovidades = new Map(
  novidadesData.itens.map((item, indice) => [
    item.href.split("/").pop() ?? item.id,
    indice,
  ]),
);

const CHAVES_DE_FILTRO = [
  "precoMinimo",
  "precoMaximo",
  "categoria",
  "colecao",
  "tamanho",
  "cor",
  "promocao",
  "disponivel",
];

/** Prioriza a curadoria de Novidades; sem data cadastrada, usa a ordem do catálogo. */
function compararMaisRecentes(a: ProdutoVitrine, b: ProdutoVitrine) {
  const posicaoA = ordemNovidades.get(a.id);
  const posicaoB = ordemNovidades.get(b.id);

  if (posicaoA !== undefined || posicaoB !== undefined) {
    if (posicaoA === undefined) return 1;
    if (posicaoB === undefined) return -1;
    if (posicaoA !== posicaoB) return posicaoA - posicaoB;
  }

  return (
    (ordemOriginalCatalogo.get(b.id) ?? 0) -
    (ordemOriginalCatalogo.get(a.id) ?? 0)
  );
}

function compararPreco(a: ProdutoVitrine, b: ProdutoVitrine, direcao: 1 | -1) {
  if (a.preco == null && b.preco != null) return 1;
  if (a.preco != null && b.preco == null) return -1;
  if (a.preco != null && b.preco != null && a.preco !== b.preco) {
    return direcao * (a.preco - b.preco);
  }
  return compararMaisRecentes(a, b);
}

function ordenarProdutos(
  produtos: readonly ProdutoVitrine[],
  ordenacao: CatalogoOrdenacao,
) {
  return [...produtos].sort((a, b) => {
    if (ordenacao === "menor-preco") return compararPreco(a, b, 1);
    if (ordenacao === "maior-preco") return compararPreco(a, b, -1);
    if (ordenacao === "maior-desconto") {
      return (
        percentualDesconto(b.precoOriginal ?? 0, b.preco ?? 0) -
          percentualDesconto(a.precoOriginal ?? 0, a.preco ?? 0) ||
        compararPreco(a, b, 1)
      );
    }
    return compararMaisRecentes(a, b);
  });
}

function escreverFiltrosNaUrl(
  parametros: URLSearchParams,
  filtros: CatalogoFiltros,
) {
  for (const chave of CHAVES_DE_FILTRO) parametros.delete(chave);
  for (const chave of [...parametros.keys()]) {
    if (chave.startsWith("atributo.")) parametros.delete(chave);
  }

  if (filtros.precoMinimo) {
    parametros.set("precoMinimo", filtros.precoMinimo);
  }
  if (filtros.precoMaximo) {
    parametros.set("precoMaximo", filtros.precoMaximo);
  }
  filtros.categorias.forEach((valor) => parametros.append("categoria", valor));
  filtros.colecoes.forEach((valor) => parametros.append("colecao", valor));
  filtros.tamanhos.forEach((valor) => parametros.append("tamanho", valor));
  filtros.cores.forEach((valor) => parametros.append("cor", valor));
  if (filtros.promocao) parametros.set("promocao", "1");
  if (filtros.disponivel) parametros.set("disponivel", "1");
  for (const [chave, valores] of Object.entries(filtros.atributos)) {
    valores.forEach((valor) => parametros.append(`atributo.${chave}`, valor));
  }
}

function ChipFiltro({
  children,
  ariaLabel,
  onRemove,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={ariaLabel}
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#d8d1ca] bg-white px-3 text-xs text-[#51483f] transition-colors hover:border-[#231f1b] hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
    >
      <span>{children}</span>
      <X className="size-3.5" aria-hidden="true" />
    </button>
  );
}

function ProdutoCard({ produto }: { produto: ProdutoVitrine }) {
  const cores = (produto.colors ?? []).slice(0, 4);
  const avisoEstoque =
    produto.stock === "out"
      ? "Esgotado"
      : produto.stock === "low"
        ? "Poucas unidades"
        : null;

  return (
    <article className="group relative min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#f5f5f5]">
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
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#ffffff,#f1f1ef)] text-[#74685f]"
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
          {produto.categoria}
        </span>
        {avisoEstoque ? (
          <span
            className={`absolute top-3 right-3 z-10 px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.1em] uppercase ${
              produto.stock === "out"
                ? "bg-white/95 text-[#665b52]"
                : "bg-[#231f1b]/90 text-white"
            }`}
          >
            {avisoEstoque}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-left text-sm leading-5 text-[#231f1b] sm:text-base">
            <Link
              href={caminhoDoProduto(produto.id)}
              className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              {produto.nome}
            </Link>
          </h2>
          {produto.colecao !== produto.categoria ? (
            <p className="mt-1 text-left text-xs text-[#75695e]">
              {produto.colecao}
            </p>
          ) : null}
          {cores.length > 0 ? (
            <div
              role="img"
              aria-label={`Cores: ${cores.map((cor) => cor.name).join(", ")}`}
              className="relative z-10 mt-2 flex items-center gap-1.5"
            >
              {cores.map((cor) => (
                <span
                  key={cor.name}
                  aria-hidden="true"
                  className="size-3.5 rounded-full border border-black/15"
                  style={{ backgroundColor: cor.hex }}
                />
              ))}
            </div>
          ) : null}
          <PrecoProduto
            produto={produto}
            className="mt-1 justify-start text-xs sm:text-sm"
          />
        </div>

        <FavoritoButton produto={produto} className="relative z-10" />
      </div>
    </article>
  );
}

export function CatalogoProdutos({
  modo = "catalogo",
}: {
  modo?: "catalogo" | "outlet";
}) {
  const isOutlet = modo === "outlet";
  const produtosDisponiveis = isOutlet ? produtosOutlet : produtosVitrine;
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryAtual = searchParams.toString();
  const parametros = useMemo(
    () => new URLSearchParams(queryAtual),
    [queryAtual],
  );
  const filtros = useMemo(
    () => parseFiltrosCatalogo(parametros, produtosDisponiveis),
    [parametros, produtosDisponiveis],
  );
  const busca = parametros.get("busca") ?? "";
  const ordenacao = parseOrdenacaoCatalogo(parametros.get("ordenar"), isOutlet);
  const paginaSolicitada = Math.max(
    1,
    Number.parseInt(parametros.get("pagina") ?? "1", 10) || 1,
  );
  const [drawerAberto, setDrawerAberto] = useState(false);

  const atualizarUrl = (opcoes: {
    filtros?: CatalogoFiltros;
    busca?: string;
    ordenacao?: CatalogoOrdenacao;
    pagina?: number;
    limparTudo?: boolean;
    metodo?: "push" | "replace";
  }) => {
    const novosParametros = new URLSearchParams(queryAtual);

    if (opcoes.limparTudo) {
      for (const chave of [...CHAVES_DE_FILTRO, "busca", "ordenar", "pagina"]) {
        novosParametros.delete(chave);
      }
      for (const chave of [...novosParametros.keys()]) {
        if (chave.startsWith("atributo.")) novosParametros.delete(chave);
      }
    }

    if (opcoes.filtros) {
      escreverFiltrosNaUrl(novosParametros, opcoes.filtros);
    }
    if (opcoes.busca !== undefined) {
      if (opcoes.busca) novosParametros.set("busca", opcoes.busca);
      else novosParametros.delete("busca");
    }
    if (opcoes.ordenacao) {
      const ordemPadrao = isOutlet ? "maior-desconto" : "recentes";
      if (opcoes.ordenacao === ordemPadrao) novosParametros.delete("ordenar");
      else novosParametros.set("ordenar", opcoes.ordenacao);
    }
    if (opcoes.pagina !== undefined) {
      if (opcoes.pagina > 1) {
        novosParametros.set("pagina", String(opcoes.pagina));
      } else {
        novosParametros.delete("pagina");
      }
    } else if (
      opcoes.filtros ||
      opcoes.busca !== undefined ||
      opcoes.ordenacao ||
      opcoes.limparTudo
    ) {
      novosParametros.delete("pagina");
    }

    const queryNova = novosParametros.toString();
    const href = queryNova ? `${pathname}?${queryNova}` : pathname;
    const hrefAtual = queryAtual ? `${pathname}?${queryAtual}` : pathname;
    if (href === hrefAtual) return;

    if (opcoes.metodo === "replace") {
      router.replace(href, { scroll: false });
    } else {
      router.push(href, { scroll: false });
    }
  };

  const categorias = useMemo(
    () =>
      CATEGORIAS_PRODUTO.map((nome) => ({
        nome,
        quantidade: produtosDisponiveis.filter(
          (produto) => produto.categoria === nome,
        ).length,
      })),
    [produtosDisponiveis],
  );
  const colecoes = useMemo(
    () => [...new Set(produtosDisponiveis.map((produto) => produto.colecao))],
    [produtosDisponiveis],
  );
  const tamanhos = useMemo(() => {
    const quantidades = new Map<string, number>();
    for (const produto of produtosDisponiveis) {
      for (const tamanho of tamanhosDisponiveis(produto)) {
        quantidades.set(tamanho, (quantidades.get(tamanho) ?? 0) + 1);
      }
    }
    return ordenarTamanhos(quantidades.keys()).map((nome): CatalogoOpcao => ({
      nome,
      quantidade: quantidades.get(nome) ?? 0,
    }));
  }, [produtosDisponiveis]);
  const cores = useMemo(() => {
    const opcoes = new Map<string, CatalogoOpcaoCor>();
    for (const produto of produtosDisponiveis) {
      const nomesNesteProduto = new Set<string>();
      for (const cor of produto.colors ?? []) {
        if (nomesNesteProduto.has(cor.name)) continue;
        nomesNesteProduto.add(cor.name);
        const existente = opcoes.get(cor.name);
        opcoes.set(cor.name, {
          nome: cor.name,
          hex: existente?.hex ?? cor.hex,
          quantidade: (existente?.quantidade ?? 0) + 1,
        });
      }
    }
    return [...opcoes.values()].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR"),
    );
  }, [produtosDisponiveis]);
  const atributos = useMemo(
    () => obterAtributosCatalogo(produtosDisponiveis),
    [produtosDisponiveis],
  );

  const produtosFiltrados = useMemo(
    () => filtrarProdutosCatalogo(produtosDisponiveis, busca, filtros),
    [produtosDisponiveis, busca, filtros],
  );
  const produtosOrdenados = useMemo(
    () => ordenarProdutos(produtosFiltrados, ordenacao),
    [ordenacao, produtosFiltrados],
  );
  const filtrosAtivos = contarFiltrosAtivos(filtros);
  const temEstadoAtivo = filtrosAtivos > 0 || Boolean(busca);
  const totalDeProdutos = produtosOrdenados.length;
  const totalDePaginas = Math.max(
    1,
    Math.ceil(totalDeProdutos / ITENS_POR_PAGINA),
  );
  const paginaAtual = Math.min(paginaSolicitada, totalDePaginas);
  useEffect(() => {
    const novosParametros = new URLSearchParams(queryAtual);
    escreverFiltrosNaUrl(novosParametros, filtros);
    const valorPagina = novosParametros.get("pagina");
    const numeroPagina = Number(valorPagina);
    const paginaValida =
      novosParametros.has("pagina") &&
      valorPagina !== null &&
      /^[1-9]\d*$/.test(valorPagina) &&
      Number.isSafeInteger(numeroPagina) &&
      numeroPagina <= totalDePaginas &&
      numeroPagina !== 1;

    if (!paginaValida && paginaAtual > 1) {
      novosParametros.set("pagina", String(paginaAtual));
    } else if (!paginaValida) {
      novosParametros.delete("pagina");
    }

    const queryNova = novosParametros.toString();
    if (queryNova === queryAtual) return;
    router.replace(queryNova ? `${pathname}?${queryNova}` : pathname, {
      scroll: false,
    });
  }, [filtros, paginaAtual, pathname, queryAtual, router, totalDePaginas]);
  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const produtosDaPagina = produtosOrdenados.slice(
    indiceInicial,
    indiceInicial + ITENS_POR_PAGINA,
  );
  const indiceFinal = Math.min(
    indiceInicial + produtosDaPagina.length,
    totalDeProdutos,
  );
  const contarResultados = (rascunho: CatalogoFiltros) =>
    filtrarProdutosCatalogo(produtosDisponiveis, busca, rascunho).length;

  const limparTudo = () => {
    atualizarUrl({
      filtros: criarFiltrosVazios(),
      busca: "",
      ordenacao: isOutlet ? "maior-desconto" : "recentes",
      pagina: 1,
      limparTudo: true,
    });
  };

  const atualizarFiltros = (novosFiltros: CatalogoFiltros) => {
    atualizarUrl({ filtros: novosFiltros, pagina: 1 });
  };

  const removerCategoria = (categoria: CategoriaProduto) => {
    const categoriasRestantes = filtros.categorias.filter(
      (item) => item !== categoria,
    );
    const chavesDeAtributoVisiveis = new Set(
      atributos
        .filter((atributo) =>
          atributo.categorias.some((item) =>
            categoriasRestantes.includes(item),
          ),
        )
        .map((atributo) => atributo.chave),
    );

    atualizarFiltros({
      ...filtros,
      categorias: categoriasRestantes,
      atributos: Object.fromEntries(
        Object.entries(filtros.atributos).filter(([chave]) =>
          chavesDeAtributoVisiveis.has(chave),
        ),
      ),
    });
  };

  const removerAtributo = (chave: string, valor: string) => {
    const valores = (filtros.atributos[chave] ?? []).filter(
      (item) => item !== valor,
    );
    const atributosAtualizados = { ...filtros.atributos };
    if (valores.length > 0) atributosAtualizados[chave] = valores;
    else delete atributosAtualizados[chave];
    atualizarFiltros({ ...filtros, atributos: atributosAtualizados });
  };

  return (
    <ThemedSection className="min-h-[70vh] bg-white py-12 text-[#231f1b] sm:py-16 md:py-20">
      <Container className="max-w-[1600px] px-5 sm:px-7 lg:px-10">
        <header className="mb-8 border-b border-[#e5e5e5] pb-7 md:mb-10 md:pb-9">
          <p className="text-xs font-medium tracking-[0.22em] text-[#75695e] uppercase">
            {isOutlet ? "Essence — ofertas" : "Essence — coleção"}
          </p>
          {isOutlet ? (
            <nav
              aria-label="Trilha de navegação"
              className="mt-3 flex items-center gap-2 text-xs text-[#75695e]"
            >
              <Link
                href={routes.home}
                className="underline-offset-4 hover:underline"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-[#231f1b]">
                Outlet
              </span>
            </nav>
          ) : null}
          <h1 className="font-heading mt-2 text-3xl leading-tight tracking-wide uppercase sm:text-4xl md:text-5xl">
            {isOutlet ? "Outlet" : "Nosso catálogo"}
          </h1>
          <p className="mt-3 max-w-2xl text-left text-sm leading-6 text-[#665b52] sm:text-base">
            {isOutlet
              ? "Encontre peças selecionadas com preços promocionais. Consulte as condições com a equipe Essence."
              : "Explore as peças da coleção e encontre seu próximo look."}
          </p>
        </header>

        {isOutlet ? (
          <aside className="mb-7 border-l-2 border-[#b9afa5] bg-[#f8f7f5] px-4 py-3 text-xs leading-5 text-[#665b52]">
            <p className="m-0">
              Prazo das ofertas: {outletConditions.prazo}. Trocas de peças do
              Outlet: {outletConditions.trocas}.
            </p>
          </aside>
        ) : null}

        <div className="mb-7 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#75695e]"
              aria-hidden="true"
              strokeWidth={1.6}
            />
            <span className="sr-only">Buscar produtos por nome</span>
            <input
              type="search"
              value={busca}
              onChange={(event) =>
                atualizarUrl({
                  busca: event.target.value,
                  pagina: 1,
                  metodo: "replace",
                })
              }
              placeholder="Buscar por nome"
              autoComplete="off"
              className="h-12 w-full border border-[#dedede] bg-white pr-4 pl-12 text-sm text-[#231f1b] transition-colors outline-none placeholder:text-[#897f75] focus:border-[#75695e] focus:ring-2 focus:ring-[#75695e]/15"
            />
          </label>

          <button
            type="button"
            onClick={() => setDrawerAberto(true)}
            aria-haspopup="dialog"
            aria-expanded={drawerAberto}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 border border-[#231f1b] px-5 text-xs font-semibold tracking-[0.12em] text-[#231f1b] uppercase transition-colors hover:bg-[#231f1b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtrar ({filtrosAtivos})
          </button>
        </div>

        {temEstadoAtivo ? (
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {busca ? (
                <ChipFiltro
                  ariaLabel={`Remover busca ${busca}`}
                  onRemove={() => atualizarUrl({ busca: "", pagina: 1 })}
                >
                  Busca: {busca}
                </ChipFiltro>
              ) : null}
              {filtros.categorias.map((categoria) => (
                <ChipFiltro
                  key={`categoria-${categoria}`}
                  ariaLabel={`Remover filtro de categoria ${categoria}`}
                  onRemove={() => removerCategoria(categoria)}
                >
                  {categoria}
                </ChipFiltro>
              ))}
              {filtros.colecoes.map((colecao) => (
                <ChipFiltro
                  key={`colecao-${colecao}`}
                  ariaLabel={`Remover filtro da coleção ${colecao}`}
                  onRemove={() =>
                    atualizarFiltros({
                      ...filtros,
                      colecoes: filtros.colecoes.filter(
                        (item) => item !== colecao,
                      ),
                    })
                  }
                >
                  {colecao}
                </ChipFiltro>
              ))}
              {filtros.tamanhos.map((tamanho) => (
                <ChipFiltro
                  key={`tamanho-${tamanho}`}
                  ariaLabel={`Remover filtro de tamanho ${tamanho}`}
                  onRemove={() =>
                    atualizarFiltros({
                      ...filtros,
                      tamanhos: filtros.tamanhos.filter(
                        (item) => item !== tamanho,
                      ),
                    })
                  }
                >
                  Tamanho: {tamanho}
                </ChipFiltro>
              ))}
              {filtros.cores.map((cor) => (
                <ChipFiltro
                  key={`cor-${cor}`}
                  ariaLabel={`Remover filtro de cor ${cor}`}
                  onRemove={() =>
                    atualizarFiltros({
                      ...filtros,
                      cores: filtros.cores.filter((item) => item !== cor),
                    })
                  }
                >
                  Cor: {cor}
                </ChipFiltro>
              ))}
              {Object.entries(filtros.atributos).flatMap(([chave, valores]) =>
                valores.map((valor) => (
                  <ChipFiltro
                    key={`atributo-${chave}-${valor}`}
                    ariaLabel={`Remover filtro ${chave}: ${valor}`}
                    onRemove={() => removerAtributo(chave, valor)}
                  >
                    {chave === "comprimento" ? "Comprimento" : chave}: {valor}
                  </ChipFiltro>
                )),
              )}
              {filtros.precoMinimo || filtros.precoMaximo ? (
                <ChipFiltro
                  ariaLabel="Remover filtro de faixa de preço"
                  onRemove={() =>
                    atualizarFiltros({
                      ...filtros,
                      precoMinimo: "",
                      precoMaximo: "",
                    })
                  }
                >
                  {filtros.precoMinimo && filtros.precoMaximo
                    ? `Preço: ${formatarPreco(Number(filtros.precoMinimo))} a ${formatarPreco(Number(filtros.precoMaximo))}`
                    : filtros.precoMinimo
                      ? `A partir de ${formatarPreco(Number(filtros.precoMinimo))}`
                      : `Até ${formatarPreco(Number(filtros.precoMaximo))}`}
                </ChipFiltro>
              ) : null}
              {filtros.promocao ? (
                <ChipFiltro
                  ariaLabel="Remover filtro de promoção"
                  onRemove={() =>
                    atualizarFiltros({ ...filtros, promocao: false })
                  }
                >
                  Em promoção
                </ChipFiltro>
              ) : null}
              {filtros.disponivel ? (
                <ChipFiltro
                  ariaLabel="Remover filtro de disponibilidade"
                  onRemove={() =>
                    atualizarFiltros({ ...filtros, disponivel: false })
                  }
                >
                  Disponível
                </ChipFiltro>
              ) : null}
            </div>
            <button
              type="button"
              onClick={limparTudo}
              className="min-h-9 self-start text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Limpar tudo
            </button>
          </div>
        ) : null}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p aria-live="polite" className="text-left text-sm text-[#665b52]">
            {totalDeProdutos === 1 ? "1 peça" : `${totalDeProdutos} peças`}
          </p>
          <label className="flex min-h-11 items-center gap-2 self-start text-xs text-[#665b52] sm:self-auto">
            <span>Ordenar:</span>
            <select
              value={ordenacao}
              onChange={(event) =>
                atualizarUrl({
                  ordenacao: event.target.value as CatalogoOrdenacao,
                  pagina: 1,
                })
              }
              aria-label="Ordenar produtos"
              className="min-h-11 border border-[#dedede] bg-white px-3 text-xs text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="maior-desconto">Maior desconto</option>
            </select>
          </label>
        </div>

        {totalDeProdutos > 0 ? (
          <ul
            id="catalogo-produtos"
            className="grid list-none grid-cols-1 gap-x-5 gap-y-9 p-0 before:hidden sm:grid-cols-2 sm:gap-x-6 sm:gap-y-11 xl:grid-cols-3 xl:gap-x-8"
          >
            {produtosDaPagina.map((produto, index) => (
              <Fragment key={produto.id}>
                <li className="min-w-0 p-0 before:hidden">
                  <ProdutoCard produto={produto} />
                </li>
                {index === 5 ? (
                  <li className="col-span-full hidden list-none p-0 before:hidden sm:block xl:hidden">
                    <ImageBanner
                      buttonAriaLabel="Consultar as condições das ofertas do Outlet"
                      buttonClassName="mr-auto ml-5 sm:ml-8"
                      buttonLabel="Consultar ofertas"
                      buttonVariant="dark"
                      href={routes.contato}
                      imageAlt="Editorial de moda Essence com looks em tons neutros"
                      imageSrc="/images/banners/essence-section-banner-01.jpg"
                      overlay="soft"
                      className="min-h-[12rem] sm:min-h-[15rem]"
                    />
                  </li>
                ) : null}
                {index === 8 ? (
                  <li className="col-span-full hidden list-none p-0 before:hidden xl:block">
                    <ImageBanner
                      buttonAriaLabel="Consultar as condições das ofertas do Outlet"
                      buttonClassName="mr-auto ml-5 sm:ml-8"
                      buttonLabel="Consultar ofertas"
                      buttonVariant="dark"
                      href={routes.contato}
                      imageAlt="Editorial de moda Essence com looks em tons neutros"
                      imageSrc="/images/banners/essence-section-banner-01.jpg"
                      overlay="soft"
                      className="min-h-[12rem] xl:min-h-[15rem]"
                    />
                  </li>
                ) : null}
              </Fragment>
            ))}
          </ul>
        ) : (
          <div className="border border-dashed border-[#d7d7d7] bg-white px-6 py-16 text-center">
            <p className="text-left text-base text-[#231f1b]">
              {isOutlet && produtosOutlet.length === 0
                ? "Novas ofertas em breve"
                : "Nenhuma peça encontrada."}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#665b52]">
              {isOutlet && produtosOutlet.length === 0
                ? "Enquanto novas ofertas são cadastradas, explore o catálogo completo da Essence."
                : "Tente ajustar os filtros ou fale com a equipe Essence para encontrar a peça que procura."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={isOutlet ? routes.colecao : routes.outlet}
                className="inline-flex min-h-11 items-center justify-center border border-[#231f1b] px-5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors hover:bg-[#231f1b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                {isOutlet ? "Ver catálogo" : "Explorar Outlet"}
              </Link>
              <a
                href={linkBaseWhatsapp()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center bg-[#231f1b] px-5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        )}

        <PaginacaoProdutos
          paginaAtual={paginaAtual}
          totalDePaginas={totalDePaginas}
          indiceInicial={indiceInicial}
          indiceFinal={indiceFinal}
          totalDeProdutos={totalDeProdutos}
          aoMudarPagina={(pagina) => {
            atualizarUrl({ pagina });
            if (lenis) {
              lenis.scrollTo(0);
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          controlaId="catalogo-produtos"
          rotulo="Paginação do catálogo de produtos"
        />
      </Container>

      {drawerAberto ? (
        <CatalogoFiltrosDrawer
          key={queryAtual}
          categorias={categorias}
          colecoes={colecoes}
          tamanhos={tamanhos}
          cores={cores}
          atributos={atributos}
          filtrosAtuais={filtros}
          contarResultados={contarResultados}
          onAplicar={(novosFiltros) => {
            atualizarFiltros(novosFiltros);
            setDrawerAberto(false);
          }}
          onFechar={() => setDrawerAberto(false)}
        />
      ) : null}
    </ThemedSection>
  );
}
