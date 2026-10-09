"use client";

import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import { Container, ThemedSection } from "@/components/common";
import { ProdutoColecaoCard } from "@/components/sections/colecao/ProdutoColecaoCard";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { CHECKOUT_CEP_STORAGE_KEY } from "@/constants/storage";
import {
  produtosVitrine,
  type ProdutoVitrine,
  VITRINE_INTERVALO_MS,
  VITRINE_MAX_PRODUTOS,
  VITRINE_PRODUTOS_POR_SLIDE,
} from "@/data/vitrine";
import { useCarouselSlides } from "@/hooks/useCarouselSlides";
import {
  alterarQuantidade,
  alterarTamanho,
  removerDoCarrinho,
  useCarrinho,
} from "@/hooks/useCarrinho";
import { detalharProduto, formatarPreco } from "@/lib/produto";
import { cn } from "@/lib/utils";

const produtosEmDestaque = produtosVitrine
  .filter((produto) => produto.featured)
  .slice(0, VITRINE_MAX_PRODUTOS);

function CartItem({
  produto,
  tamanho,
  quantidade,
}: {
  produto: ProdutoVitrine;
  tamanho: string;
  quantidade: number;
}) {
  const preco = produto.preco ?? 0;
  const tamanhosDisponiveis = detalharProduto(produto).tamanhos.filter(
    (item) => item.disponivel,
  );
  const tamanhoAtualDisponivel = tamanhosDisponiveis.some(
    (item) => item.rotulo === tamanho,
  );

  return (
    <li className="grid list-none grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-[#e5e1dd] py-5 before:hidden sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
      <Link
        href={`${routes.produto}/${produto.id}`}
        aria-label={`Ver ${produto.nome}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[#f1efec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
      >
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.alt}
            fill
            sizes="(min-width: 640px) 112px, 88px"
            className="object-cover"
          />
        ) : (
          <span
            role="img"
            aria-label={`Foto pendente: ${produto.alt}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#74685f]"
          >
            <ImagePlus className="size-7 opacity-70" aria-hidden="true" />
            <span className="px-2 text-center text-[0.55rem] tracking-[0.15em] uppercase">
              Foto em breve
            </span>
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.15em] text-[#74685f] uppercase">
              {produto.colecao}
            </p>
            <Link
              href={`${routes.produto}/${produto.id}`}
              className="mt-1 inline-block text-sm leading-5 text-[#231f1b] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] sm:text-base"
            >
              {produto.nome}
            </Link>
          </div>
          <p className="shrink-0 text-sm font-medium text-[#231f1b] sm:text-base">
            {produto.preco != null
              ? formatarPreco(preco * quantidade)
              : "Preço a cadastrar"}
          </p>
        </div>

        <p className="mt-2 text-xs text-[#655e57]">
          Unitário: {formatarPreco(preco)}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
          <label className="flex items-center gap-2 text-xs text-[#51483f]">
            <span>Tamanho</span>
            <select
              value={tamanho}
              onChange={(event) =>
                alterarTamanho(produto.id, tamanho, event.target.value)
              }
              aria-label={`Tamanho de ${produto.nome}`}
              className="essence-select h-10 min-w-16 text-sm"
            >
              {!tamanhoAtualDisponivel ? (
                <option value={tamanho}>{tamanho} (indisponível)</option>
              ) : null}
              {tamanhosDisponiveis.map((item) => (
                <option key={item.rotulo} value={item.rotulo}>
                  {item.rotulo}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex h-10 items-center border border-[#ded9d3]"
              aria-label={`Quantidade de ${produto.nome}`}
            >
              <button
                type="button"
                onClick={() =>
                  alterarQuantidade(produto.id, tamanho, quantidade - 1)
                }
                disabled={quantidade <= 1}
                aria-label={`Diminuir quantidade de ${produto.nome}`}
                className="inline-flex size-9 cursor-pointer items-center justify-center text-[#51483f] hover:bg-[#f1efec] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>
              <span
                aria-live="polite"
                className="min-w-7 text-center text-sm tabular-nums"
              >
                {quantidade}
              </span>
              <button
                type="button"
                onClick={() =>
                  alterarQuantidade(produto.id, tamanho, quantidade + 1)
                }
                disabled={quantidade >= 99}
                aria-label={`Aumentar quantidade de ${produto.nome}`}
                className="inline-flex size-9 cursor-pointer items-center justify-center text-[#51483f] hover:bg-[#f1efec] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removerDoCarrinho(produto.id, tamanho)}
              aria-label={`Remover ${produto.nome} tamanho ${tamanho} da sacola`}
              className="inline-flex size-10 cursor-pointer items-center justify-center text-[#74685f] transition-colors hover:bg-[#f1efec] hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function CarrinhoConteudo({
  showCheckoutEmptyNotice = false,
}: {
  showCheckoutEmptyNotice?: boolean;
}) {
  const { itens, hidratado } = useCarrinho();
  const router = useRouter();
  const { slides, slideAtual, irParaSlide, pausarPorFoco, retomarPorFoco } =
    useCarouselSlides(
      produtosEmDestaque,
      VITRINE_PRODUTOS_POR_SLIDE,
      VITRINE_INTERVALO_MS,
      { pauseOnHover: false },
    );
  const [cep, setCep] = useState("");
  const [mensagemFrete, setMensagemFrete] = useState("");
  const avisoCheckout = showCheckoutEmptyNotice
    ? "Sua sacola está vazia. Adicione uma peça antes de iniciar a finalização."
    : "";
  const produtosPorId = useMemo(
    () => new Map(produtosVitrine.map((produto) => [produto.id, produto])),
    [],
  );
  const linhas = itens.flatMap((item) => {
    const produto = produtosPorId.get(item.produtoId);
    return produto ? [{ ...item, produto }] : [];
  });
  const subtotal = linhas.reduce(
    (total, item) => total + (item.produto.preco ?? 0) * item.quantidade,
    0,
  );
  const pecasNoCarrinho = linhas.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  function consultarFrete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cepNumerico = cep.replace(/\D/g, "");
    if (cepNumerico.length !== 8) {
      setMensagemFrete("Informe um CEP válido com 8 dígitos.");
      return;
    }
    setMensagemFrete(
      "CEP anotado. A cotação será exibida aqui quando a API de frete for integrada.",
    );
  }

  function finalizarPedido() {
    try {
      if (cep) {
        window.sessionStorage.setItem(CHECKOUT_CEP_STORAGE_KEY, cep);
      } else {
        window.sessionStorage.removeItem(CHECKOUT_CEP_STORAGE_KEY);
      }
    } catch {
      // A finalização continua mesmo se o armazenamento da sessão estiver bloqueado.
    }

    router.push(routes.checkout);
  }

  return (
    <>
      <ThemedSection
        aria-label="Sacola de compras"
        className="min-h-[55vh] bg-white py-12 text-[#231f1b] sm:py-16 md:py-20"
      >
        <Container className="max-w-7xl">
          {avisoCheckout ? (
            <p
              role="status"
              className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
            >
              {avisoCheckout}
            </p>
          ) : null}
          <div className="mb-6 flex justify-end">
            <Link
              href={routes.trocasDevolucoes}
              className="inline-flex min-h-11 items-center text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Trocas e devoluções
            </Link>
            <Link
              href={routes.entregaFrete}
              className="inline-flex min-h-11 items-center text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Entrega e frete
            </Link>
          </div>
          {!hidratado ? null : linhas.length === 0 ? (
            <div className="border border-dashed border-[#d7d1ca] px-6 py-14 text-center sm:py-20">
              <p className="font-heading text-2xl tracking-wide uppercase">
                Sua sacola está vazia
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#655e57]">
                Explore a seleção Essence e adicione as peças que deseja levar.
              </p>
              <Link
                href={routes.colecao}
                className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#231f1b] px-7 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)] lg:gap-14">
              <section aria-labelledby="sacola-itens-titulo">
                <h2 id="sacola-itens-titulo" className="sr-only">
                  Produtos na sacola
                </h2>
                <ul className="divide-y divide-[#e5e1dd]">
                  {linhas.map((item) => (
                    <CartItem
                      key={`${item.produtoId}-${item.tamanho}`}
                      produto={item.produto}
                      tamanho={item.tamanho}
                      quantidade={item.quantidade}
                    />
                  ))}
                </ul>
                <Link
                  href={routes.colecao}
                  className="mt-6 inline-flex min-h-11 items-center text-xs font-semibold tracking-[0.12em] text-[#51483f] uppercase underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
                >
                  Continuar comprando
                </Link>
              </section>

              <aside className="border border-[#e5e1dd] bg-[#faf9f7] p-5 sm:p-7">
                <h2 className="font-heading text-xl tracking-wide uppercase">
                  Resumo do pedido
                </h2>
                <form
                  onSubmit={consultarFrete}
                  className="mt-6 border-y border-[#e5e1dd] py-5"
                >
                  <label
                    htmlFor="carrinho-cep"
                    className="text-sm font-medium text-[#231f1b]"
                  >
                    Calcular frete
                  </label>
                  <p className="mt-1 text-xs leading-5 text-[#655e57]">
                    Consulte as opções de entrega para o seu CEP.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <input
                      id="carrinho-cep"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={9}
                      value={cep}
                      onChange={(event) => {
                        const digitos = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8);
                        setCep(
                          digitos.length > 5
                            ? `${digitos.slice(0, 5)}-${digitos.slice(5)}`
                            : digitos,
                        );
                        setMensagemFrete("");
                      }}
                      placeholder="00000-000"
                      aria-describedby="carrinho-frete-mensagem"
                      className="h-11 min-w-0 flex-1 border border-[#ded9d3] bg-white px-3 text-sm outline-none focus:border-[#75695e] focus:ring-2 focus:ring-[#75695e]/15"
                    />
                    <button
                      type="submit"
                      className="min-h-11 cursor-pointer border border-[#231f1b] px-4 text-xs font-semibold tracking-wide text-[#231f1b] uppercase transition-colors hover:bg-[#231f1b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
                    >
                      Consultar
                    </button>
                  </div>
                  <p
                    id="carrinho-frete-mensagem"
                    role="status"
                    aria-live="polite"
                    className="mt-2 min-h-5 text-xs leading-5 text-[#655e57]"
                  >
                    {mensagemFrete}
                  </p>
                </form>

                <dl className="space-y-3 py-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#655e57]">
                      Subtotal ({pecasNoCarrinho} peças)
                    </dt>
                    <dd className="font-medium tabular-nums">
                      {formatarPreco(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#655e57]">Entrega</dt>
                    <dd className="text-right text-[#655e57]">A calcular</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#e5e1dd] pt-3 text-base font-semibold">
                    <dt>Total parcial</dt>
                    <dd className="tabular-nums">{formatarPreco(subtotal)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={finalizarPedido}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-center bg-[#231f1b] px-4 text-center text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
                >
                  Finalizar pedido
                </button>
                <p className="mt-3 text-center text-[0.68rem] leading-5 text-[#74685f]">
                  O frete será confirmado após a integração da consulta por CEP.
                </p>
              </aside>
            </div>
          )}
        </Container>
      </ThemedSection>

      <ThemedSection
        aria-labelledby="carrinho-destaques"
        className="border-t border-[#e5e1dd] bg-[#f7f5f2] py-12 text-[#231f1b] md:py-16"
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
        <Container className="max-w-7xl">
          <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#74685f] uppercase">
                Curadoria Essence
              </p>
              <h2
                id="carrinho-destaques"
                className="font-heading mt-2 text-2xl tracking-wide uppercase sm:text-3xl"
              >
                Destaques
              </h2>
              <p className="mt-2 text-sm text-[#655e57]">
                Peças em destaque na vitrine principal.
              </p>
            </div>

            {slides.length > 1 ? (
              <div className="ml-auto flex items-center gap-2 sm:ml-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => irParaSlide(slideAtual - 1)}
                  aria-label="Mostrar os três destaques anteriores"
                  className="size-11 cursor-pointer rounded-full"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => irParaSlide(slideAtual + 1)}
                  aria-label="Mostrar os três próximos destaques"
                  className="size-11 cursor-pointer rounded-full"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
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
                    {slide.map((produto, index) => (
                      <li
                        key={produto.id}
                        className="min-w-0 list-none p-0 before:hidden"
                      >
                        <ProdutoColecaoCard
                          produto={produto}
                          priority={slideIndex === 0 && index === 0}
                        />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {slides.length > 1 ? (
              <div
                role="group"
                aria-label="Páginas dos destaques"
                className="mt-7 flex items-center justify-center gap-2"
              >
                {slides.map((_, index) => (
                  <button
                    key={`destaque-indicator-${index}`}
                    type="button"
                    onClick={() => irParaSlide(index)}
                    aria-label={`Ir para o grupo de destaques ${index + 1}`}
                    aria-current={slideAtual === index ? "page" : undefined}
                    className={cn(
                      "h-1 cursor-pointer transition-[width,background-color] duration-300 motion-reduce:transition-none",
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
    </>
  );
}
