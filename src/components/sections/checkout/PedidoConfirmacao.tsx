"use client";

import { ArrowUpRight, CircleHelp, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Container, ThemedSection } from "@/components/common";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { getCheckoutOrder, getCheckoutWhatsappMessage } from "@/lib/checkout";
import { montarMensagemPedidoWhatsapp } from "@/lib/checkout-whatsapp";
import { formatarPreco } from "@/lib/produto";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

const COUNTDOWN_SECONDS = 3;
const countdownCircumference = 2 * Math.PI * 46;

type PedidoConfirmacaoProps = {
  orderId: string;
};

function subscribeToOrder() {
  return () => {};
}

function ConfirmationSkeleton() {
  return (
    <ThemedSection className="flex-1 bg-white py-14 text-[#171717] sm:py-20">
      <Container className="max-w-6xl">
        <div aria-busy="true" className="grid gap-8 lg:grid-cols-2">
          <p role="status" className="sr-only">
            Carregando a confirmação do pedido…
          </p>
          <div className="h-[28rem] animate-pulse border border-black/10 bg-[#f8f6f4]" />
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="size-28 animate-pulse rounded-full bg-black/5" />
            <div className="h-8 w-72 animate-pulse bg-black/5" />
            <div className="h-12 w-60 animate-pulse bg-black/5" />
          </div>
        </div>
      </Container>
    </ThemedSection>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Agora";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function PedidoConfirmacao({ orderId }: PedidoConfirmacaoProps) {
  const clientHydrated = useSyncExternalStore(
    subscribeToOrder,
    () => true,
    () => false,
  );
  const order = useSyncExternalStore(
    subscribeToOrder,
    () => getCheckoutOrder(orderId),
    () => null,
  );
  const preparedMessage = useSyncExternalStore(
    subscribeToOrder,
    () => getCheckoutWhatsappMessage(orderId),
    () => null,
  );
  const whatsappMessage = order
    ? (preparedMessage ?? montarMensagemPedidoWhatsapp(order))
    : "";
  const whatsappHref = whatsappMessage
    ? montarLinkWhatsapp(
        `https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`,
        whatsappMessage,
      )
    : "";
  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!clientHydrated || !order || !whatsappHref) return;

    let remaining = COUNTDOWN_SECONDS;
    const interval = window.setInterval(() => {
      remaining -= 1;
      setSecondsRemaining(Math.max(remaining, 0));

      if (remaining <= 0) {
        window.clearInterval(interval);
        window.location.assign(whatsappHref);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [clientHydrated, order, whatsappHref]);

  if (!clientHydrated) return <ConfirmationSkeleton />;

  if (!order) {
    return (
      <ThemedSection className="flex-1 bg-white py-14 text-[#171717] sm:py-20">
        <Container className="max-w-3xl text-center">
          <CircleHelp
            aria-hidden="true"
            className="mx-auto size-12 text-black/55"
          />
          <h1 className="font-heading mt-5 text-2xl font-medium">
            Não encontramos esse pedido nesta sessão
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/60">
            Como o pedido é demonstrativo, os detalhes ficam disponíveis
            temporariamente apenas nesta aba.
          </p>
          <Link
            href={routes.carrinho}
            className="mt-7 inline-flex min-h-11 items-center justify-center border border-black/20 px-5 text-xs font-semibold hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Voltar à sacola
          </Link>
        </Container>
      </ThemedSection>
    );
  }

  const countdownProgress =
    (COUNTDOWN_SECONDS - secondsRemaining) / COUNTDOWN_SECONDS;

  return (
    <ThemedSection className="flex-1 bg-white py-10 text-[#171717] sm:py-14 md:py-16">
      <Container className="max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:gap-16">
          <section
            aria-labelledby="confirmation-summary-title"
            className="order-2 min-h-[27rem] border border-[#ded9d4] bg-[#fbf9f7] p-6 sm:p-8 lg:order-1 lg:p-9"
          >
            <p className="m-0 text-[0.65rem] font-medium tracking-[0.18em] text-[#766c63] uppercase">
              Resumo preparado para o atendimento
            </p>
            <h2
              id="confirmation-summary-title"
              className="font-heading mt-3 text-2xl font-normal tracking-wide uppercase sm:text-[1.7rem]"
            >
              Seu pedido
            </h2>

            <ul className="mt-5 divide-y divide-[#ded9d4]">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex list-none items-start justify-between gap-4 py-4 before:hidden first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-medium">{item.name}</p>
                    <p className="mt-1 mb-0 text-xs leading-5 text-[#766c63]">
                      Tamanho {item.size} · Quantidade {item.quantity}
                    </p>
                    <p className="mt-1 mb-0 text-xs text-[#766c63]">
                      Unitário: {formatarPreco(item.unitPrice)}
                    </p>
                  </div>
                  <p className="m-0 shrink-0 text-sm font-medium tabular-nums">
                    {formatarPreco(item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-[#ded9d4] pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#766c63]">Subtotal conhecido</dt>
                <dd className="m-0 font-medium tabular-nums">
                  {formatarPreco(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#766c63]">Frete</dt>
                <dd className="m-0 text-right text-[#766c63]">A consultar</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#ded9d4] pt-3 font-semibold">
                <dt>Total antes do frete</dt>
                <dd className="m-0 text-right tabular-nums">
                  {formatarPreco(order.subtotal)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 mb-0 text-xs leading-5 text-[#766c63]">
              O frete e o valor final serão confirmados pelo atendimento.
              Nenhuma cobrança foi feita nesta etapa.
            </p>
          </section>

          <section className="order-1 flex flex-col items-center text-center lg:order-2">
            <div
              className="relative flex size-28 items-center justify-center"
              role="img"
              aria-label={`Redirecionamento ao WhatsApp em ${secondsRemaining} segundos`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#e6e2de"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#81766c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={countdownCircumference}
                  strokeDashoffset={countdownCircumference * countdownProgress}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
                />
              </svg>
              <span className="font-heading text-4xl font-normal tabular-nums">
                {secondsRemaining}
              </span>
            </div>

            <p className="mt-6 mb-0 text-[0.65rem] font-medium tracking-[0.22em] text-[#766c63] uppercase">
              Pedido preparado
            </p>
            <h1 className="font-heading mt-3 max-w-xl text-3xl leading-[1.12] font-normal tracking-wide uppercase sm:text-4xl">
              Pedido criado. Você será redirecionado para o WhatsApp.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-[#766c63] sm:text-base sm:leading-7">
              Estamos abrindo o WhatsApp com os dados do pedido para a equipe
              confirmar disponibilidade, entrega ou retirada e o valor final. A
              mensagem ficará preenchida; você poderá revisar e tocar em enviar.
            </p>
            <p className="mt-3 mb-0 text-xs text-[#766c63]">
              Pedido {order.number} · criado em {formatDate(order.createdAt)}
            </p>

            <a
              href={whatsappHref}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 border border-[#171717] px-6 text-xs font-semibold tracking-[0.15em] uppercase transition-colors hover:bg-[#171717] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#171717] motion-reduce:transition-none"
            >
              Abrir WhatsApp agora
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
            <p
              role="status"
              aria-live="polite"
              className="mt-3 mb-0 text-xs text-[#766c63]"
            >
              Redirecionando em {secondsRemaining} segundo
              {secondsRemaining === 1 ? "" : "s"}…
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
              <Link
                href={routes.colecao}
                className="text-[#766c63] underline underline-offset-4 hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                Voltar para a loja
              </Link>
              <Link
                href={routes.pedidos}
                className="text-[#766c63] underline underline-offset-4 hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
              >
                Meus pedidos
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-8 flex items-start justify-center gap-2 border-t border-black/10 pt-5 text-center text-xs leading-5 text-black/50">
          <PackageCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="m-0 max-w-3xl">
            A mensagem inclui nome, e-mail, telefone, CPF informado, itens,
            recebimento, endereço/CEP e forma de pagamento escolhida. O site não
            coleta dados de cartão e nenhum pagamento é processado.
          </p>
        </div>
      </Container>
    </ThemedSection>
  );
}
