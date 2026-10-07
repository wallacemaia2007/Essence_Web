import Link from "next/link";

import { Container, ImageBanner, ThemedSection } from "@/components/common";
import { ProdutosConjuntoCarrossel } from "@/components/sections/conjuntos/ProdutosConjuntoCarrossel";
import { routes } from "@/constants/routes";
import type { Conjunto } from "@/data/conjuntos";
import { conjuntosData } from "@/data/conjuntos";
import { produtosVitrine, VITRINE_MAX_PRODUTOS } from "@/data/vitrine";
import { slugificarColecao } from "@/lib/colecao";

const conjuntosSelecionados = conjuntosData.itens.filter(
  (conjunto) => conjunto.mostrarNaPaginaConjuntos,
);

function ProdutosDoConjunto({
  conjunto,
  index,
}: {
  conjunto: Conjunto;
  index: number;
}) {
  const produtos = produtosVitrine
    .filter((produto) => slugificarColecao(produto.colecao) === conjunto.id)
    .slice(0, VITRINE_MAX_PRODUTOS);
  const hrefColecao = conjunto.href ?? `${routes.colecao}/${conjunto.id}`;
  const isRightAligned = index % 2 !== 0;

  return (
    <article className="border-b border-[#e7e4e0] pb-12 last:border-b-0 last:pb-0 md:pb-16">
      <div className="relative">
        <ImageBanner
          imageSrc={conjunto.image}
          imageAlt={conjunto.alt}
          buttonLabel="Ver mais"
          buttonAriaLabel={`Ver mais da coleção ${conjunto.titulo}`}
          href={hrefColecao}
          buttonPosition="bottom"
          buttonVariant="light"
          overlay="strong"
          sizes="100vw"
          className="min-h-[25rem] md:min-h-[32rem] lg:min-h-[36rem]"
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <Container className="max-w-7xl">
            <div
              className={`max-w-xl ${
                isRightAligned
                  ? "ml-auto md:translate-x-4"
                  : "mr-auto md:-translate-x-4"
              } text-left`}
            >
              <p className="text-xs font-semibold tracking-[0.28em] text-white/80 uppercase">
                Coleção selecionada · {String(index + 1).padStart(2, "0")}
              </p>
              <h2
                id={`conjunto-${conjunto.id}`}
                className="font-heading mt-3 text-3xl leading-[1.02] tracking-wide text-white uppercase sm:text-4xl md:text-6xl"
              >
                {conjunto.titulo}
              </h2>
              {conjunto.descricao ? (
                <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                  {conjunto.descricao}
                </p>
              ) : null}
            </div>
          </Container>
        </div>
      </div>

      <Container className="max-w-7xl pt-8 md:pt-10">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-[#74685f] uppercase">
              Uma pequena amostra
            </p>
            <h3 className="font-heading mt-2 text-xl tracking-wide text-[#231f1b] uppercase sm:text-2xl">
              Peças deste conjunto
            </h3>
          </div>
          <Link
            href={hrefColecao}
            className="shrink-0 text-xs font-semibold tracking-[0.16em] text-[#231f1b] uppercase underline underline-offset-4 transition-colors hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b]"
          >
            Ver coleção completa
          </Link>
        </div>

        {produtos.length > 0 ? (
          <ProdutosConjuntoCarrossel
            conjuntoTitulo={conjunto.titulo}
            produtos={produtos}
          />
        ) : (
          <p className="border border-[#e7e4e0] px-5 py-8 text-sm leading-6 text-[#655e57]">
            As peças desta coleção serão adicionadas em breve.
          </p>
        )}
      </Container>
    </article>
  );
}

export function PaginaConjuntos() {
  return (
    <>
      <section
        id="hero"
        data-page-hero
        aria-labelledby="conjuntos-hero-titulo"
        className="relative isolate"
      >
        <ImageBanner
          imageSrc="/images/conjuntos/hero-conjuntos-essence.webp"
          imageAlt="Editorial Essence com looks de diferentes coleções femininas"
          buttonLabel="Explorar conjuntos"
          href="#conjuntos-selecionados"
          buttonAriaLabel="Ir para os conjuntos selecionados"
          buttonPosition="bottom"
          buttonVariant="light"
          overlay="strong"
          priority
          sizes="100vw"
          className="min-h-[clamp(28rem,62svh,44rem)] md:min-h-[clamp(34rem,70svh,50rem)]"
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
          <Container className="max-w-7xl">
            <div className="max-w-2xl pb-12 text-white sm:pb-16 md:pb-20">
              <p className="text-xs font-semibold tracking-[0.3em] text-white/80 uppercase sm:text-sm">
                Curadoria Essence
              </p>
              <h1
                id="conjuntos-hero-titulo"
                className="font-heading mt-4 text-4xl leading-[0.98] tracking-wide uppercase sm:text-5xl md:text-7xl"
              >
                Looks que contam sua história
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                Descubra combinações escolhidas para acompanhar seus momentos e
                expressar o seu estilo.
              </p>
            </div>
          </Container>
        </div>
      </section>

      <ThemedSection
        id="conjuntos-selecionados"
        aria-labelledby="conjuntos-lista-titulo"
        className="bg-white py-12 text-[#231f1b] md:py-16"
      >
        <Container className="max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.26em] text-[#74685f] uppercase">
              Escolhas da loja
            </p>
            <h2
              id="conjuntos-lista-titulo"
              className="font-heading mt-3 text-3xl leading-tight tracking-wide uppercase sm:text-4xl md:text-5xl"
            >
              Conjuntos em destaque
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#655e57] sm:text-base sm:leading-7">
              Uma seleção especial de coleções Essence. Cada conjunto traz uma
              pequena amostra das peças disponíveis.
            </p>
          </div>
        </Container>

        <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
          {conjuntosSelecionados.map((conjunto, index) => (
            <ProdutosDoConjunto
              key={conjunto.id}
              conjunto={conjunto}
              index={index}
            />
          ))}
        </div>

        {conjuntosSelecionados.length === 0 ? (
          <Container className="mt-10 max-w-7xl">
            <p className="border border-[#e7e4e0] px-5 py-8 text-sm leading-6 text-[#655e57]">
              Novos conjuntos serão anunciados em breve.
            </p>
          </Container>
        ) : null}
      </ThemedSection>
    </>
  );
}
