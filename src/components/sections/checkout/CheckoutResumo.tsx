import { formatarPreco } from "@/lib/produto";

export type CheckoutSummaryItem = {
  id: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number | null;
};

type CheckoutResumoProps = {
  items: readonly CheckoutSummaryItem[];
  subtotal: number;
  freightLabel: string;
  totalLabel: string;
  isTotalPending: boolean;
  isSubtotalPending: boolean;
};

export function CheckoutResumo({
  items,
  subtotal,
  freightLabel,
  totalLabel,
  isTotalPending,
  isSubtotalPending,
}: CheckoutResumoProps) {
  return (
    <div>
      <h2 className="font-heading m-0 text-xl tracking-wide uppercase">
        Resumo do pedido
      </h2>
      <ul className="mt-5 max-h-[22rem] divide-y divide-black/10 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex list-none items-start justify-between gap-4 py-4 before:hidden first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="m-0 text-sm leading-5 font-medium">{item.name}</p>
              <p className="mt-1 mb-0 text-xs text-black/55">
                Tamanho {item.size} · Quantidade {item.quantity}
              </p>
            </div>
            <p className="m-0 shrink-0 text-sm font-medium tabular-nums">
              {item.unitPrice === null
                ? "A confirmar"
                : formatarPreco(item.unitPrice * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-3 border-t border-black/10 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-black/60">
            Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            itens)
          </dt>
          <dd className="m-0 text-right font-medium tabular-nums">
            {isSubtotalPending
              ? `${formatarPreco(subtotal)} + a confirmar`
              : formatarPreco(subtotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-black/60">Frete</dt>
          <dd className="m-0 text-right text-black/60">{freightLabel}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-black/10 pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="m-0 text-right tabular-nums">
            {isTotalPending ? totalLabel : formatarPreco(subtotal)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 mb-0 text-xs leading-5 text-black/55">
        Pedido demonstrativo: os preços do catálogo também são exemplos. A loja
        confirmará o frete e o valor final antes de qualquer pagamento.
      </p>
    </div>
  );
}
