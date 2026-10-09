"use client";

import { ArrowLeft, Check, Circle, MapPin, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDemoAuth } from "@/components/auth/DemoAuthProvider";
import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import { mockOrdersRepository } from "@/data/orders";
import {
  type Order,
  ORDER_STATUS_PRESENTATION,
  type OrderStatus,
} from "@/lib/orders";
import { formatarPreco } from "@/lib/produto";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

type DetalhePedidoProps = {
  orderId: string;
};

const timelineLabels: Record<OrderStatus, string> = {
  received: "Recebido",
  "payment-confirmed": "Pagamento confirmado",
  separating: "Separando",
  shipped: "Enviado",
  delivered: "Entregue",
  "ready-for-pickup": "Pronto para retirada",
};

function OrderDetailSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      <p role="status" className="sr-only">
        Carregando os detalhes do pedido…
      </p>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className="animate-pulse rounded-2xl border border-black/10 p-6"
        >
          <div className="h-5 w-48 rounded bg-black/5" />
          <div className="mt-5 h-14 rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

function Timeline({ order }: { order: Order }) {
  return (
    <ol aria-label="Linha do tempo do pedido" className="mt-6">
      {order.timeline.map((event, index) => (
        <li
          key={`${event.status}-${index}`}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {index < order.timeline.length - 1 ? (
            <span
              aria-hidden="true"
              className={`absolute top-8 left-[0.9rem] h-[calc(100%-1.5rem)] w-px ${event.completed ? "bg-black/30" : "bg-black/10"}`}
            />
          ) : null}
          <span
            aria-hidden="true"
            className={`relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border ${event.completed ? "border-black bg-black text-white" : "border-black/20 bg-white text-black/35"}`}
          >
            {event.completed ? (
              <Check className="size-4" />
            ) : (
              <Circle className="size-2.5 fill-current" />
            )}
          </span>
          <div className="pt-1">
            <p
              className={`m-0 text-sm font-semibold ${event.completed ? "text-black" : "text-black/45"}`}
            >
              {timelineLabels[event.status]}
            </p>
            <p className="mt-1 mb-0 text-xs text-black/50">
              {event.occurredAt ?? "Aguardando atualização"}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DetalhePedido({ orderId }: DetalhePedidoProps) {
  const { user } = useDemoAuth();
  const userEmail = user?.email;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      if (!userEmail) return;
      setLoading(true);
      setError("");

      try {
        const result = await mockOrdersRepository.getById(orderId, userEmail);
        if (!active) return;
        if (!result) {
          setError(
            "Não encontramos esse pedido. Confira o número e tente novamente.",
          );
          setOrder(null);
        } else {
          setOrder(result);
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar o pedido. Tente novamente.");
          setOrder(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrder();
    return () => {
      active = false;
    };
  }, [orderId, retryKey, userEmail]);

  if (loading) return <OrderDetailSkeleton />;

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
        <p role="alert" className="m-0 text-sm leading-6 text-black/70">
          {error || "Pedido não encontrado."}
        </p>
        <Link
          href={routes.pedidos}
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-black/20 px-4 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar aos pedidos
        </Link>
        <button
          type="button"
          onClick={() => setRetryKey((current) => current + 1)}
          className="mt-5 ml-2 inline-flex min-h-10 items-center rounded-full bg-black px-4 text-xs font-semibold text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const status = ORDER_STATUS_PRESENTATION[order.status];
  const message = `Olá! Preciso de ajuda com o pedido ${order.number}.`;
  const helpHref = montarLinkWhatsapp(
    `https://wa.me/${contato.whatsapp}`,
    message,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
        <div>
          <p className="m-0 text-xs text-black/50">Número do pedido</p>
          <h2 className="font-heading mt-1 mb-0 text-2xl font-medium tracking-wide">
            {order.number}
          </h2>
          <p className="mt-2 mb-0 text-sm text-black/55">
            Feito em {order.date.split("-").reverse().join("/")}
          </p>
        </div>
        <span
          aria-label={`Status do pedido: ${status.label}`}
          className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold ${status.badgeClassName}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <section
          aria-labelledby="itens-pedido-titulo"
          className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
        >
          <h2
            id="itens-pedido-titulo"
            className="font-heading m-0 text-xl font-medium"
          >
            Itens do pedido
          </h2>
          <ul className="mt-5 divide-y divide-black/8">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="m-0 text-sm font-semibold">{item.name}</p>
                  <p className="mt-1 mb-0 text-xs text-black/55">
                    Tamanho {item.size} · Quantidade {item.quantity}
                  </p>
                </div>
                <p className="m-0 text-sm font-medium">
                  {formatarPreco(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-base font-semibold">
              {formatarPreco(order.total)}
            </span>
          </div>
        </section>

        <div className="space-y-6">
          <section
            aria-labelledby="entrega-pedido-titulo"
            className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <MapPin aria-hidden="true" className="size-5" />
              <h2
                id="entrega-pedido-titulo"
                className="font-heading m-0 text-xl font-medium"
              >
                {order.fulfillment.kind === "pickup"
                  ? "Retirada na loja"
                  : "Endereço de entrega"}
              </h2>
            </div>
            <p className="mt-4 mb-0 text-sm leading-6 text-black/65">
              {order.fulfillment.address}
            </p>
            {order.fulfillment.kind === "delivery" &&
            order.fulfillment.trackingCode ? (
              <p className="mt-4 mb-0 rounded-xl bg-black/[0.035] p-3 text-xs leading-5 text-black/60">
                Código de rastreio demonstrativo:{" "}
                <strong>{order.fulfillment.trackingCode}</strong>
              </p>
            ) : null}
          </section>

          <section
            aria-labelledby="pagamento-pedido-titulo"
            className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <PackageCheck aria-hidden="true" className="size-5" />
              <h2
                id="pagamento-pedido-titulo"
                className="font-heading m-0 text-xl font-medium"
              >
                Pagamento
              </h2>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-black/55">Forma</dt>
                <dd className="m-0 text-right font-medium">
                  {order.payment.method}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-black/55">Status</dt>
                <dd className="m-0 text-right font-medium">
                  {order.payment.status}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <section
        aria-labelledby="linha-tempo-pedido-titulo"
        className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
      >
        <h2
          id="linha-tempo-pedido-titulo"
          className="font-heading m-0 text-xl font-medium"
        >
          Acompanhamento
        </h2>
        <Timeline order={order} />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link
          href={routes.pedidos}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/20 px-5 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar aos pedidos
        </Link>
        <a
          href={helpHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Ajuda com este pedido
          <span className="sr-only"> (abre em uma nova aba)</span>
        </a>
      </div>
      <p className="m-0 text-center text-xs leading-5 text-black/45">
        Dados e status acima são exemplos visuais; não correspondem a uma compra
        real.
      </p>
    </div>
  );
}
