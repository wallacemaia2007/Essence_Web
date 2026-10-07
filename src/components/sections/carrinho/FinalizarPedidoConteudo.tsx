"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Container, ThemedSection } from "@/components/common";
import { routes } from "@/constants/routes";
import { CHECKOUT_CEP_STORAGE_KEY } from "@/constants/storage";
import { produtosVitrine } from "@/data/vitrine";
import { useCarrinho } from "@/hooks/useCarrinho";
import { formatarPreco, linkBaseWhatsapp } from "@/lib/produto";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

const DURACAO_CONTAGEM = 5;
const ITENS_POR_PAGINA = 3;
const CIRCUNFERENCIA = 2 * Math.PI * 42;
const produtosPorId = new Map(
  produtosVitrine.map((produto) => [produto.id, produto]),
);

export function FinalizarPedidoConteudo() {
  const { itens, hidratado } = useCarrinho();
  const [cep, setCep] = useState("");
  const [cepCarregado, setCepCarregado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(DURACAO_CONTAGEM);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const linkWhatsappRef = useRef("");

  const linhas = useMemo(
    () =>
      itens.flatMap((item) => {
        const produto = produtosPorId.get(item.produtoId);
        return produto ? [{ ...item, produto }] : [];
      }),
    [itens],
  );
  const numeroDePaginas = Math.ceil(linhas.length / ITENS_POR_PAGINA);
  const paginaVisivel = Math.min(
    paginaAtual,
    Math.max(numeroDePaginas - 1, 0),
  );
  const linhasDaPagina = linhas.slice(
    paginaVisivel * ITENS_POR_PAGINA,
    (paginaVisivel + 1) * ITENS_POR_PAGINA,
  );
  const subtotal = linhas.reduce(
    (total, item) => total + (item.produto.preco ?? 0) * item.quantidade,
    0,
  );
  const existemPrecosPendentes = linhas.some(
    (item) => item.produto.preco == null,
  );

  useEffect(() => {
    const carregamento = window.setTimeout(() => {
      try {
        setCep(window.sessionStorage.getItem(CHECKOUT_CEP_STORAGE_KEY) ?? "");
      } catch {
        setCep("");
      }
      setCepCarregado(true);
    }, 0);

    return () => window.clearTimeout(carregamento);
  }, []);

  const mensagemWhatsapp = useMemo(() => {
    const resumoItens = linhas
      .map((item) => {
        const precoUnitario =
          item.produto.preco == null
            ? "Preço a confirmar"
            : formatarPreco(item.produto.preco);
        const precoLinha =
          item.produto.preco == null
            ? "Preço a confirmar"
            : formatarPreco(item.produto.preco * item.quantidade);

        return [
          `• ${item.produto.nome}`,
          `  Tamanho: ${item.tamanho} | Quantidade: ${item.quantidade}`,
          `  Unitário: ${precoUnitario} | Total da peça: ${precoLinha}`,
        ].join("\n");
      })
      .join("\n\n");
    const totalParcial = existemPrecosPendentes
      ? `Total antes do frete: ${formatarPreco(subtotal)} (há preço a confirmar)`
      : `Total antes do frete: ${formatarPreco(subtotal)}`;
    const endereco = cep
      ? `Frete: a consultar para o CEP ${cep}`
      : "Frete: a consultar";

    return [
      "Olá! Gostaria de finalizar este pedido com a Essence.",
      "",
      "ITENS DO PEDIDO",
      resumoItens,
      "",
      `Subtotal conhecido: ${formatarPreco(subtotal)}`,
      endereco,
      totalParcial,
      "",
      "Aguardo a confirmação do frete e do pedido.",
    ].join("\n");
  }, [cep, existemPrecosPendentes, linhas, subtotal]);
  const linkWhatsapp = useMemo(
    () => montarLinkWhatsapp(linkBaseWhatsapp(), mensagemWhatsapp),
    [mensagemWhatsapp],
  );

  useEffect(() => {
    linkWhatsappRef.current = linkWhatsapp;
  }, [linkWhatsapp]);

  useEffect(() => {
    if (!hidratado || !cepCarregado || linhas.length === 0) return;

    let decorrido = 0;
    const temporizador = window.setInterval(() => {
      decorrido += 1;
      const restante = Math.max(DURACAO_CONTAGEM - decorrido, 0);
      setSegundosRestantes(restante);

      if (restante === 0) {
        window.clearInterval(temporizador);
        window.location.assign(linkWhatsappRef.current);
      }
    }, 1000);

    return () => window.clearInterval(temporizador);
  }, [cepCarregado, hidratado, linhas.length]);

  if (!hidratado || !cepCarregado) {
    return (
      <ThemedSection className="bg-white py-16 text-[#231f1b] sm:py-20">
        <Container className="max-w-3xl text-center">
          <p role="status" className="text-sm text-[#655e57]">
            A preparar o resumo do seu pedido…
          </p>
        </Container>
      </ThemedSection>
    );
  }

  if (linhas.length === 0) {
    return (
      <ThemedSection className="bg-white py-16 text-[#231f1b] sm:py-20">
        <Container className="max-w-3xl text-center">
          <h2 className="font-heading text-2xl tracking-wide uppercase sm:text-3xl">
            Sua sacola está vazia
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#655e57]">
            Adicione uma peça à sacola antes de iniciar a finalização do pedido.
          </p>
          <Link
            href={routes.carrinho}
            className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#231f1b] px-7 text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
          >
            Voltar à sacola
          </Link>
        </Container>
      </ThemedSection>
    );
  }

  const progresso =
    ((DURACAO_CONTAGEM - segundosRestantes) / DURACAO_CONTAGEM) *
    CIRCUNFERENCIA;

  return (
    <ThemedSection className="bg-white py-10 text-[#231f1b] sm:py-14 md:py-16">
      <Container className="max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] lg:gap-12">
          <section
            aria-labelledby="resumo-finalizacao"
            className="order-2 border border-[#e5e1dd] bg-[#faf9f7] p-5 sm:p-7 lg:order-1"
          >
            <h2
              id="resumo-finalizacao"
              className="font-heading text-xl tracking-wide uppercase"
            >
              Resumo enviado ao atendimento
            </h2>
            <ul
              id="resumo-itens-pedido"
              className="mt-5 divide-y divide-[#e5e1dd]"
            >
              {linhasDaPagina.map((item) => (
                <li
                  key={`${item.produtoId}-${item.tamanho}`}
                  className="flex list-none items-start justify-between gap-4 py-4 before:hidden first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm leading-5 font-medium text-[#231f1b]">
                      {item.produto.nome}
                    </h3>
                    <p className="mt-1 text-xs text-[#655e57]">
                      Tamanho {item.tamanho} · Quantidade {item.quantidade}
                    </p>
                    <p className="mt-1 text-xs text-[#655e57]">
                      Unitário: {formatarPreco(item.produto.preco)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-[#231f1b] tabular-nums">
                    {item.produto.preco == null
                      ? "A confirmar"
                      : formatarPreco(item.produto.preco * item.quantidade)}
                  </p>
                </li>
              ))}
            </ul>
            {numeroDePaginas > 1 ? (
              <nav
                aria-label="Paginação dos itens do pedido"
                className="mt-5 flex items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => setPaginaAtual(Math.max(paginaVisivel - 1, 0))}
                  disabled={paginaVisivel === 0}
                  aria-label="Mostrar itens anteriores"
                  aria-controls="resumo-itens-pedido"
                  className="inline-flex size-10 cursor-pointer items-center justify-center border border-[#ded9d3] text-[#51483f] transition-colors hover:bg-[#f1efec] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <span className="sr-only" aria-live="polite">
                  Página {paginaVisivel + 1} de {numeroDePaginas}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPaginaAtual(
                      Math.min(paginaVisivel + 1, numeroDePaginas - 1),
                    )
                  }
                  disabled={paginaVisivel === numeroDePaginas - 1}
                  aria-label="Mostrar próximos itens"
                  aria-controls="resumo-itens-pedido"
                  className="inline-flex size-10 cursor-pointer items-center justify-center border border-[#ded9d3] text-[#51483f] transition-colors hover:bg-[#f1efec] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </nav>
            ) : null}

            <dl className="mt-5 space-y-3 border-t border-[#e5e1dd] pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#655e57]">Subtotal conhecido</dt>
                <dd className="font-medium tabular-nums">
                  {formatarPreco(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#655e57]">Frete</dt>
                <dd className="text-right text-[#655e57]">
                  {cep ? `A consultar · CEP ${cep}` : "A consultar"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#e5e1dd] pt-3 font-semibold">
                <dt>Total antes do frete</dt>
                <dd className="tabular-nums">
                  {existemPrecosPendentes
                    ? "A confirmar"
                    : formatarPreco(subtotal)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-[#74685f]">
              O frete será confirmado pelo atendimento. Nenhuma cobrança será
              efetuada nesta etapa.
            </p>
          </section>

          <section
            aria-labelledby="redirecionamento-titulo"
            className="order-1 flex flex-col items-center justify-center px-4 py-2 text-center lg:order-2"
          >
            <div className="relative mb-6 grid size-32 place-items-center">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#e5e1dd"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#75695e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUNFERENCIA}
                  strokeDashoffset={progresso}
                  transform="rotate(-90 50 50)"
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
                />
              </svg>
              <span
                role="timer"
                aria-live="polite"
                aria-atomic="true"
                className="font-heading text-4xl text-[#231f1b] tabular-nums"
              >
                {segundosRestantes}
              </span>
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-[#74685f] uppercase">
              Pedido preparado
            </p>
            <h2
              id="redirecionamento-titulo"
              className="font-heading mt-3 text-2xl leading-tight tracking-wide uppercase sm:text-3xl"
            >
              Você será redirecionado para nosso atendimento
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#655e57]">
              Estamos abrindo o WhatsApp com os produtos, quantidades, valores e
              informações de frete do seu pedido.
            </p>
            <a
              href={linkWhatsapp}
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center border border-[#231f1b] px-6 text-xs font-semibold tracking-[0.14em] text-[#231f1b] uppercase transition-colors hover:bg-[#f1efec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Abrir WhatsApp agora
            </a>
            <Link
              href={routes.carrinho}
              className="mt-4 text-xs text-[#655e57] underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
            >
              Voltar e editar a sacola
            </Link>
          </section>
        </div>
      </Container>
    </ThemedSection>
  );
}
