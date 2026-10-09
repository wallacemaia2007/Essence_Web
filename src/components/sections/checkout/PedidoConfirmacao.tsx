"use client";

import {
  ArrowRight,
  Check,
  CircleHelp,
  MapPin,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { Container, ThemedSection } from "@/components/common";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { type CheckoutPaymentMethod, getCheckoutOrder } from "@/lib/checkout";
import { formatarPreco } from "@/lib/produto";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

const paymentLabels: Record<CheckoutPaymentMethod, string> = {
  pix: "Pix",
  card: "Cartão",
  boleto: "Boleto",
};

type PedidoConfirmacaoProps = {
  orderId: string;
};

function subscribeToOrder() {
  return () => {};
}

function ConfirmationSkeleton() {
  return (
    <ThemedSection className="bg-white py-14 text-[#171717] sm:py-20">
      <Container className="max-w-4xl">
        <div aria-busy="true" className="animate-pulse space-y-5">
          <p role="status" className="sr-only">
            Carregando a confirmação do pedido…
          </p>
          <div className="mx-auto size-14 rounded-full bg-black/5" />
          <div className="mx-auto h-8 w-64 rounded bg-black/5" />
          <div className="h-64 rounded-2xl bg-black/5" />
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

  if (!clientHydrated) return <ConfirmationSkeleton />;

  if (!order) {
    return (
      <ThemedSection className="bg-white py-14 text-[#171717] sm:py-20">
        <Container className="max-w-3xl text-center">
          <CircleHelp
            aria-hidden="true"
            className="mx-auto size-12 text-black/55"
          />
          <h2 className="font-heading mt-5 mb-0 text-2xl font-medium">
            Não encontramos esse pedido nesta sessão
          </h2>
          <p className="mx-auto mt-3 mb-0 max-w-xl text-sm leading-6 text-black/60">
            Como este pedido é demonstrativo, os detalhes ficam disponíveis
            temporariamente apenas nesta aba. Se você acabou de finalizar, volte
            e tente novamente.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={routes.carrinho}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/20 px-5 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Voltar à sacola
            </Link>
            <Link
              href={routes.pedidos}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Meus pedidos
            </Link>
          </div>
        </Container>
      </ThemedSection>
    );
  }

  const whatsappMessage = `Olá! Estou entrando em contato sobre o pedido ${order.number}. Vou enviar o comprovante quando o pagamento for confirmado pela equipe.`;
  const whatsappHref = montarLinkWhatsapp(
    `https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`,
    whatsappMessage,
  );

  return (
    <ThemedSection className="bg-white py-10 text-[#171717] sm:py-14 md:py-16">
      <Container className="max-w-4xl">
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <Check aria-hidden="true" className="size-7" />
          </span>
          <p className="mt-5 mb-0 text-[0.65rem] font-semibold tracking-[0.2em] text-black/50 uppercase">
            Pedido criado · Demonstração
          </p>
          <h2 className="font-heading mt-2 mb-0 text-3xl font-medium sm:text-4xl">
            Recebemos seu pedido
          </h2>
          <p className="mt-3 mb-0 text-sm leading-6 text-black/60">
            O pedido <strong className="text-black">{order.number}</strong> foi
            preparado em {formatDate(order.createdAt)}. Nenhum pagamento foi
            processado.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)]">
          <section
            aria-labelledby="confirmation-items-title"
            className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
          >
            <h3
              id="confirmation-items-title"
              className="font-heading m-0 text-xl font-medium"
            >
              Resumo do pedido
            </h3>
            <ul className="mt-5 divide-y divide-black/10">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="m-0 text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 mb-0 text-xs text-black/55">
                      Tamanho {item.size} · Quantidade {item.quantity}
                    </p>
                  </div>
                  <p className="m-0 shrink-0 text-sm font-medium tabular-nums">
                    {formatarPreco(item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-3 border-t border-black/10 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-black/55">Subtotal</dt>
                <dd className="m-0 font-medium">
                  {formatarPreco(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-black/55">Frete</dt>
                <dd className="m-0 text-right text-black/55">
                  A confirmar pela loja
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-black/10 pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd className="m-0 text-right">A confirmar</dd>
              </div>
            </dl>
            <p className="mt-4 mb-0 text-xs leading-5 text-black/55">
              Os preços do catálogo e este pedido são demonstrativos. O valor
              final será confirmado pela equipe antes da cobrança.
            </p>
          </section>

          <div className="space-y-6">
            <section
              aria-labelledby="confirmation-fulfillment-title"
              className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                {order.fulfillment.method === "pickup" ? (
                  <MapPin aria-hidden="true" className="size-5" />
                ) : (
                  <PackageCheck aria-hidden="true" className="size-5" />
                )}
                <h3
                  id="confirmation-fulfillment-title"
                  className="font-heading m-0 text-lg font-medium"
                >
                  {order.fulfillment.method === "pickup"
                    ? "Retirada"
                    : "Entrega"}
                </h3>
              </div>
              {order.fulfillment.method === "pickup" ? (
                <p className="mt-4 mb-0 text-sm leading-6 text-black/65">
                  Retirada na loja: {order.fulfillment.address}
                </p>
              ) : (
                <p className="mt-4 mb-0 text-sm leading-6 text-black/65">
                  {order.fulfillment.street}, {order.fulfillment.number}
                  {order.fulfillment.complement
                    ? ` · ${order.fulfillment.complement}`
                    : ""}
                  <br />
                  {order.fulfillment.district} · {order.fulfillment.city}/
                  {order.fulfillment.state}
                  <br />
                  CEP {order.fulfillment.cep}
                </p>
              )}
            </section>
            <section
              aria-labelledby="confirmation-payment-title"
              className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <h3
                id="confirmation-payment-title"
                className="font-heading m-0 text-lg font-medium"
              >
                Preferência de pagamento
              </h3>
              <p className="mt-3 mb-0 text-sm font-medium">
                {paymentLabels[order.paymentMethod]}
              </p>
              <p className="mt-2 mb-0 text-xs leading-5 text-black/55">
                Forma selecionada para a demonstração; aguarde a confirmação da
                loja. Nenhuma transação foi realizada.
              </p>
            </section>
          </div>
        </div>

        <section
          aria-labelledby="next-steps-title"
          className="mt-6 rounded-2xl bg-black/[0.035] p-5 sm:p-7"
        >
          <h3
            id="next-steps-title"
            className="font-heading m-0 text-xl font-medium"
          >
            Próximos passos
          </h3>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              "A equipe confirmará a disponibilidade das peças, o frete e o valor final.",
              "Você receberá as instruções de pagamento pelo canal combinado com a loja.",
              "Após realizar o pagamento, envie o comprovante pelo WhatsApp para agilizar a confirmação.",
            ].map((text, index) => (
              <li
                key={text}
                className="flex gap-3 text-sm leading-6 text-black/65"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-xs font-semibold text-black">
                  {index + 1}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
          >
            Enviar comprovante pelo WhatsApp{" "}
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <Link
            href={routes.pedidos}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/20 px-6 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
          >
            Acessar meus pedidos{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <p className="mt-5 mb-0 text-center text-xs leading-5 text-black/45">
          O pedido mock fica guardado temporariamente nesta aba. Não informe
          dados de cartão; o pagamento ainda não está integrado.
        </p>
      </Container>
    </ThemedSection>
  );
}
