export type OrderStatus =
  | "received"
  | "payment-confirmed"
  | "separating"
  | "shipped"
  | "delivered"
  | "ready-for-pickup";

export type OrderItem = {
  id: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type OrderTimelineEvent = {
  status: OrderStatus;
  occurredAt: string | null;
  completed: boolean;
};

export type OrderFulfillment =
  | {
      kind: "delivery";
      address: string;
      trackingCode?: string;
    }
  | {
      kind: "pickup";
      address: string;
    };

export type Order = {
  id: string;
  number: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: readonly OrderItem[];
  fulfillment: OrderFulfillment;
  payment: {
    method: string;
    status: string;
  };
  timeline: readonly OrderTimelineEvent[];
};

export const ORDER_STATUS_PRESENTATION: Record<
  OrderStatus,
  { label: string; badgeClassName: string }
> = {
  received: {
    label: "Recebido",
    badgeClassName: "bg-slate-100 text-slate-700",
  },
  "payment-confirmed": {
    label: "Pagamento confirmado",
    badgeClassName: "bg-emerald-50 text-emerald-800",
  },
  separating: {
    label: "Separando",
    badgeClassName: "bg-amber-50 text-amber-800",
  },
  shipped: {
    label: "Enviado",
    badgeClassName: "bg-sky-50 text-sky-800",
  },
  delivered: {
    label: "Entregue",
    badgeClassName: "bg-green-50 text-green-800",
  },
  "ready-for-pickup": {
    label: "Pronto para retirada",
    badgeClassName: "bg-violet-50 text-violet-800",
  },
};

/** Contrato desacoplado do mock para facilitar a troca por uma API real. */
export interface OrdersRepository {
  listByCustomer(customerEmail: string): Promise<readonly Order[]>;
  getById(orderId: string, customerEmail: string): Promise<Order | null>;
  findByNumber(
    orderNumber: string,
    customerEmail: string,
  ): Promise<Order | null>;
}

export function formatOrderDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
