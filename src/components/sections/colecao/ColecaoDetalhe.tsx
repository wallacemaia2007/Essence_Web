import Image from "next/image";
import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import type { Conjunto } from "@/data/conjuntos";
import { conjuntosData } from "@/data/conjuntos";
import { produtosVitrine } from "@/data/vitrine";
import { slugificarColecao } from "@/lib/colecao";

import { ColecaoProdutosPaginados } from "./ColecaoProdutosPaginados";
import { OutrosConjuntosCarrossel } from "./OutrosConjuntosCarrossel";

function BannerOutraColecao({ conjunto }: { conjunto: Conjunto }) {
  const href = conjunto.href ?? `/colecao/${conjunto.id}`;

  return (
    <li className="min-w-0 before:hidden">
      <Link
        href={href}
        className="group relative block aspect-[4/3] overflow-hidden bg-neutral-900 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#231f1b] sm:aspect-video"
      >
        <Image
          src={conjunto.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={80}
          loading="lazy"
          aria-hidden="true"
          className="!rounded-none object-cover !shadow-none transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"
        />
        <span className="absolute inset-x-0 bottom-0 p-4 text-left text-white sm:p-6">
          <span className="font-heading block text-xl leading-tight tracking-wide uppercase sm:text-2xl">
            {conjunto.titulo}
          </span>
          {conjunto.descricao ? (
            <span className="mt-2 line-clamp-2 block text-sm leading-5 text-white/80 sm:text-base">
              {conjunto.descricao}
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

export function ColecaoDetalhe({ colecao }: { colecao: Conjunto }) {
  const produtosDestaque = produtosVitrine.filter(
    (produto) =>
      slugificarColecao(produto.colecao) === colecao.id &&
      produto.destaqueColecao === true,
  );
  const produtosRestantes = produtosVitrine.filter(
    (produto) =>
      slugificarColecao(produto.colecao) === colecao.id &&
      produto.destaqueColecao !== true,
  );
  const produtosOutrasColecoes = produtosVitrine.filter(
    (produto) => slugificarColecao(produto.colecao) !== colecao.id,
  );
  const outrasColecoes = conjuntosData.itens.filter(
    (conjunto) => conjunto.id !== colecao.id,
  );

  return (
    <>
      <section
        id="hero"
        data-page-hero
        aria-labelledby="colecao-hero-titulo"
        className="relative isolate flex h-[clamp(21rem,52svh,34rem)] min-h-[21rem] items-end overflow-hidden bg-neutral-900 md:h-[clamp(25rem,56svh,36rem)] md:min-h-[25rem]"
      >
        <Image
          src={colecao.image}
          alt=""
          fill
          sizes="100vw"
          quality={85}
          priority
          aria-hidden="true"
          className="!rounded-none object-cover !shadow-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10"
        />
        <Container className="relative z-10 flex h-full items-end">
          <div className="max-w-3xl pt-24 pb-10 text-white sm:pb-12 md:pb-16">
            <p className="text-xs font-semibold tracking-[0.28em] text-white/80 uppercase sm:text-sm">
              Coleção Essence
            </p>
            <h1
              id="colecao-hero-titulo"
              className="font-heading mt-3 text-4xl leading-[0.98] tracking-wide uppercase sm:text-5xl md:text-6xl"
            >
              {colecao.titulo}
            </h1>
            {colecao.descricao ? (
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                {colecao.descricao}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <ThemedSection
        aria-label={`Peças da coleção ${colecao.titulo}`}
        className="bg-white py-12 text-[#231f1b] md:py-16"
      >
        <Container className="max-w-7xl">
          <ColecaoProdutosPaginados
            key={colecao.id}
            tituloColecao={colecao.titulo}
            produtosDestaque={produtosDestaque}
            produtosRestantes={produtosRestantes}
          />
        </Container>
      </ThemedSection>

      <OutrosConjuntosCarrossel produtos={produtosOutrasColecoes} />

      <ThemedSection
        aria-labelledby="outras-colecoes-titulo"
        className="border-t border-[#e5e1dd] bg-white py-12 text-[#231f1b] md:py-16"
      >
        <Container className="max-w-7xl">
          <div className="mb-7 max-w-2xl md:mb-9">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#74685f] uppercase">
              Mais para descobrir
            </p>
            <h2
              id="outras-colecoes-titulo"
              className="font-heading mt-3 text-2xl leading-tight tracking-wide text-[#231f1b] uppercase sm:text-3xl md:text-4xl"
            >
              Explore outras coleções
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#655e57] sm:text-base">
              Encontre novas ideias e continue navegando pelos conjuntos da
              Essence.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
            {outrasColecoes.map((conjunto) => (
              <BannerOutraColecao key={conjunto.id} conjunto={conjunto} />
            ))}
          </ul>
        </Container>
      </ThemedSection>
    </>
  );
}
