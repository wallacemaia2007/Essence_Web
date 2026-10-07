"use client";

import { ArrowRight, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container, ThemedSection } from "@/components/common";
import { FavoritoButton } from "@/components/common/favorito-button";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import {
  produtosVitrine,
  type ProdutoVitrine,
  VITRINE_INTERVALO_MS,
  VITRINE_MAX_PRODUTOS,
  VITRINE_PRODUTOS_POR_SLIDE,
} from "@/data/vitrine";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import { caminhoDoProduto } from "@/lib/produto";
import { cn } from "@/lib/utils";

function formatarPreco(preco: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

const produtosEmDestaque = produtosVitrine
  .filter((produto) => produto.featured)
  .slice(0, VITRINE_MAX_PRODUTOS);

function ProductCard({ produto }: { produto: ProdutoVitrine }) {
  return (
    <li className="min-w-0 list-none p-0 before:hidden">
      <article className="group relative">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f5f5f5]">
          {produto.imagem ? (
            <>
              <Image
                src={produto.imagem}
                alt={produto.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className={cn(
                  "!rounded-none object-cover !shadow-none transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                  produto.imagemHover
                    ? "group-hover:scale-[1.025] group-hover:opacity-0"
                    : "group-hover:scale-[1.035]",
                )}
              />
              {produto.imagemHover ? (
                <Image
                  src={produto.imagemHover}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="!rounded-none object-cover opacity-0 !shadow-none transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.025] group-hover:opacity-100 motion-reduce:transition-none"
                />
              ) : null}
            </>
          ) : (
            <div
              role="img"
              aria-label={`Foto pendente: ${produto.alt}`}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#ffffff,#f1f1ef)] text-[#74685f] transition-colors duration-500 group-hover:bg-[linear-gradient(145deg,#f5f5f5,#e9e9e7)] motion-reduce:transition-none"
            >
              <ImagePlus
                className="size-8 opacity-70"
                aria-hidden="true"
                strokeWidth={1.2}
              />
              <span className="text-[0.65rem] tracking-[0.2em] uppercase">
                Adicionar foto da peça
              </span>
            </div>
          )}

          <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[0.58rem] tracking-[0.17em] text-[#51483f] uppercase">
            Novidade
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-left text-sm leading-5 text-[#231f1b] sm:text-base">
              {/* Link "esticado": o ::after cobre o card inteiro e abre a peça. */}
              <Link
                href={caminhoDoProduto(produto.id)}
                className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                {produto.nome}
              </Link>
            </p>
            <p className="mt-1 text-left text-xs text-[#51483f] sm:text-sm">
              {produto.preco != null
                ? formatarPreco(produto.preco)
                : "Preço a cadastrar"}
            </p>
          </div>

          <FavoritoButton produto={produto} className="relative z-10" />
        </div>
      </article>
    </li>
  );
}

export function HomeVitrine() {
  const {
    slides,
    slideAtual,
    irParaSlide,
    pausarPorHover,
    retomarPorHover,
    pausarPorFoco,
    retomarPorFoco,
  } = useCarouselSlides(
    produtosEmDestaque,
    VITRINE_PRODUTOS_POR_SLIDE,
    VITRINE_INTERVALO_MS,
  );

  if (produtosEmDestaque.length === 0) {
    return null;
  }

  return (
    <ThemedSection
      id="vitrine"
      aria-labelledby="vitrine-title"
      className="bg-white py-14 text-[#231f1b] sm:py-16 md:py-24"
      onMouseEnter={pausarPorHover}
      onMouseLeave={retomarPorHover}
      onFocusCapture={pausarPorFoco}
      onBlurCapture={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          retomarPorFoco();
        }
      }}
    >
      <Container className="max-w-[1600px] px-5 sm:px-7 lg:px-10">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#75695e] uppercase">
              Curadoria Essence
            </p>
            <h2
              id="vitrine-title"
              className="font-heading mt-2 text-3xl leading-tight tracking-wide uppercase sm:text-4xl md:text-5xl"
            >
              Peças em destaque
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <Link
              href={routes.colecao}
              prefetch={false}
              className="inline-flex min-h-11 items-center gap-2 border-b border-[#231f1b] px-1 text-xs font-semibold tracking-[0.15em] text-[#231f1b] uppercase transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
            >
              Mostrar tudo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            {slides.length > 1 ? (
              <div className="ml-auto flex items-center gap-2 sm:ml-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => irParaSlide(slideAtual - 1)}
                  aria-label="Mostrar os três produtos anteriores"
                  className="size-11 rounded-full"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => irParaSlide(slideAtual + 1)}
                  aria-label="Mostrar os três próximos produtos"
                  className="size-11 rounded-full"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Produtos em destaque da Essence"
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(-${slideAtual * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <ul
                  key={`slide-${slideIndex}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${slideIndex + 1} de ${slides.length}`}
                  aria-hidden={slideIndex !== slideAtual}
                  className="grid w-full shrink-0 grid-cols-1 gap-x-4 gap-y-8 p-0 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6"
                >
                  {slide.map((produto) => (
                    <ProductCard key={produto.id} produto={produto} />
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {slides.length > 1 ? (
            <div
              role="group"
              aria-label="Páginas da vitrine"
              className="mt-7 flex items-center justify-center gap-2"
            >
              {slides.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  type="button"
                  onClick={() => irParaSlide(index)}
                  aria-label={`Ir para o grupo de produtos ${index + 1}`}
                  aria-current={slideAtual === index ? "page" : undefined}
                  className={cn(
                    "h-1 transition-[width,background-color] duration-300 motion-reduce:transition-none",
                    slideAtual === index
                      ? "w-8 bg-[#231f1b]"
                      : "w-4 bg-[#cfc6bc] hover:bg-[#8e8175]",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </ThemedSection>
  );
}
