"use client";

import { ArrowRight, PackageSearch, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { useDemoAuth } from "@/components/auth/DemoAuthProvider";
import { routes } from "@/constants/routes";
import { mockOrdersRepository } from "@/data/orders";
import {
  formatOrderDate,
  type Order,
  ORDER_STATUS_PRESENTATION,
} from "@/lib/orders";
import { formatarPreco } from "@/lib/produto";

function OrderListSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <p role="status" className="sr-only">
        Carregando seus pedidos…
      </p>
      {[0, 1].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className="animate-pulse rounded-2xl border border-black/10 p-5"
        >
          <div className="h-4 w-40 rounded bg-black/5" />
          <div className="mt-5 h-6 w-56 rounded bg-black/5" />
          <div className="mt-5 h-4 w-32 rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export function PedidosLista() {
  const { user } = useDemoAuth();
  const userEmail = user?.email;
  const router = useRouter();
  const [orders, setOrders] = useState<readonly Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  async function loadOrders() {
    if (!user) return;
    setLoading(true);
    setLoadError("");

    try {
      const result = await mockOrdersRepository.listByCustomer(user.email);
      setOrders(result);
    } catch {
      setLoadError("Não foi possível carregar seus pedidos agora.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      if (!userEmail) return;
      setLoading(true);
      setLoadError("");

      try {
        const result = await mockOrdersRepository.listByCustomer(userEmail);
        if (active) setOrders(result);
      } catch {
        if (active)
          setLoadError("Não foi possível carregar seus pedidos agora.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [userEmail]);

  async function acompanharPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const normalizedNumber = orderNumber.trim();
    if (!normalizedNumber) {
      setSearchError("Digite o número do pedido para continuar.");
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const order = await mockOrdersRepository.findByNumber(
        normalizedNumber,
        user.email,
      );
      if (!order) {
        setSearchError("Não encontramos um pedido com esse número.");
        return;
      }
      router.push(routes.pedidoDetalhe(order.id));
    } catch {
      setSearchError(
        "Não foi possível consultar esse pedido. Tente novamente.",
      );
    } finally {
      setSearching(false);
    }
  }

  if (loading) return <OrderListSkeleton />;

  if (loadError) {
    return (
      <div
        className="rounded-2xl border border-red-200 bg-red-50 p-6"
        role="alert"
      >
        <p className="m-0 text-sm font-semibold text-red-900">Não carregou</p>
        <p className="mt-2 mb-0 text-sm text-red-800">{loadError}</p>
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="mt-4 inline-flex min-h-10 items-center rounded-full border border-red-300 px-4 text-xs font-semibold text-red-900 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={acompanharPedido}
        className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
        aria-labelledby="acompanhar-pedido-titulo"
      >
        <div className="flex items-center gap-3">
          <PackageSearch aria-hidden="true" className="size-5" />
          <h2
            id="acompanhar-pedido-titulo"
            className="font-heading m-0 text-xl font-medium"
          >
            Acompanhar pedido
          </h2>
        </div>
        <p className="mt-2 mb-4 text-sm leading-6 text-black/55">
          Digite o número do pedido para abrir os detalhes e acompanhar o
          status.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="numero-pedido" className="sr-only">
            Número do pedido
          </label>
          <input
            id="numero-pedido"
            name="order-number"
            type="text"
            autoComplete="off"
            value={orderNumber}
            onChange={(event) => {
              setOrderNumber(event.target.value);
              setSearchError("");
            }}
            placeholder="Ex.: ESS-2026-00142"
            aria-invalid={Boolean(searchError)}
            aria-describedby={searchError ? "pedido-busca-erro" : undefined}
            className="min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm transition outline-none placeholder:text-black/40 focus:border-black focus:ring-2 focus:ring-black/10 aria-invalid:border-red-600"
          />
          <button
            type="submit"
            disabled={searching}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-5 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60"
          >
            <Search aria-hidden="true" className="size-4" />
            {searching ? "Consultando…" : "Buscar pedido"}
          </button>
        </div>
        {searchError ? (
          <p
            id="pedido-busca-erro"
            role="alert"
            className="mt-3 mb-0 text-xs text-red-700"
          >
            {searchError}
          </p>
        ) : null}
      </form>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-black/15 px-5 py-12 text-center">
          <PackageSearch aria-hidden="true" className="size-10 text-black/45" />
          <h2 className="font-heading mt-5 mb-0 text-2xl font-medium">
            Ainda não há pedidos
          </h2>
          <p className="mt-2 mb-0 max-w-md text-sm leading-6 text-black/55">
            Quando você fizer um pedido, ele aparecerá nesta área.
          </p>
          <Link
            href={routes.colecao}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
          >
            Ver catálogo
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : (
        <section aria-labelledby="meus-pedidos-titulo">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-black/50 uppercase">
                Histórico
              </p>
              <h2
                id="meus-pedidos-titulo"
                className="font-heading m-0 mt-1 text-2xl font-medium"
              >
                Seus pedidos
              </h2>
            </div>
            <p className="m-0 text-xs text-black/50">
              {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
            </p>
          </div>
          <p className="mb-4 rounded-xl bg-black/[0.035] px-4 py-3 text-xs leading-5 text-black/55">
            Pedidos de exemplo para demonstração da interface; nenhum pedido
            real está conectado.
          </p>
          <ul className="space-y-4">
            {orders.map((order) => {
              const status = ORDER_STATUS_PRESENTATION[order.status];

              return (
                <li
                  key={order.id}
                  className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="m-0 text-xs text-black/50">Pedido</p>
                      <h3 className="mt-1 mb-0 text-base font-semibold tracking-wide">
                        {order.number}
                      </h3>
                    </div>
                    <span
                      aria-label={`Status do pedido: ${status.label}`}
                      className={`inline-flex min-h-7 items-center rounded-full px-3 text-[0.68rem] font-semibold ${status.badgeClassName}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <dl className="mt-5 grid gap-4 border-t border-black/8 pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-xs text-black/50">Data</dt>
                      <dd className="mt-1 font-medium">
                        {formatOrderDate(order.date)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-black/50">Itens</dt>
                      <dd className="mt-1 font-medium">
                        {order.items.reduce(
                          (total, item) => total + item.quantity,
                          0,
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-black/50">Total</dt>
                      <dd className="mt-1 font-medium">
                        {formatarPreco(order.total)}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex justify-end">
                    <Link
                      href={routes.pedidoDetalhe(order.id)}
                      aria-label={`Ver detalhes do pedido ${order.number}`}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/20 px-4 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Ver pedido
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
