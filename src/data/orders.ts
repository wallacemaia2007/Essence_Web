import type { Order, OrdersRepository } from "@/lib/orders";

/**
 * Pedidos inteiramente fictícios para validar as telas enquanto não há backend.
 * Substitua este repositório por uma implementação de OrdersRepository.
 */
export const mockOrders: readonly Order[] = [
  {
    id: "pedido-demo-ESS-2026-00142",
    number: "ESS-2026-00142",
    date: "2026-10-02",
    total: 418,
    status: "shipped",
    items: [
      {
        id: "vestido-aurora-m",
        name: "Vestido Aurora",
        size: "M",
        quantity: 1,
        unitPrice: 249,
      },
      {
        id: "blusa-essencial-p",
        name: "Blusa Essencial",
        size: "P",
        quantity: 1,
        unitPrice: 169,
      },
    ],
    fulfillment: {
      kind: "delivery",
      address: "Endereço fictício para demonstração · Centro · Passos — MG",
      trackingCode: "DEMO-ESS-2026-00142",
    },
    payment: {
      method: "Pix",
      status: "Confirmado (demonstração)",
    },
    timeline: [
      {
        status: "received",
        occurredAt: "02 out 2026 · 10:30",
        completed: true,
      },
      {
        status: "payment-confirmed",
        occurredAt: "02 out 2026 · 10:42",
        completed: true,
      },
      {
        status: "separating",
        occurredAt: "03 out 2026 · 09:15",
        completed: true,
      },
      {
        status: "shipped",
        occurredAt: "04 out 2026 · 15:20",
        completed: true,
      },
      { status: "delivered", occurredAt: null, completed: false },
    ],
  },
  {
    id: "pedido-demo-ESS-2026-00137",
    number: "ESS-2026-00137",
    date: "2026-09-28",
    total: 289,
    status: "ready-for-pickup",
    items: [
      {
        id: "conjunto-sol-m",
        name: "Conjunto Sol",
        size: "M",
        quantity: 1,
        unitPrice: 289,
      },
    ],
    fulfillment: {
      kind: "pickup",
      address: "Avenida Comendador Francisco Avelino Maia, 3014, Passos, MG",
    },
    payment: {
      method: "Cartão de crédito",
      status: "Confirmado (demonstração)",
    },
    timeline: [
      {
        status: "received",
        occurredAt: "28 set 2026 · 11:05",
        completed: true,
      },
      {
        status: "payment-confirmed",
        occurredAt: "28 set 2026 · 11:06",
        completed: true,
      },
      {
        status: "separating",
        occurredAt: "29 set 2026 · 14:30",
        completed: true,
      },
      {
        status: "ready-for-pickup",
        occurredAt: "30 set 2026 · 10:15",
        completed: true,
      },
    ],
  },
];

function mockDelay() {
  return new Promise<void>((resolve) => setTimeout(resolve, 220));
}

export const mockOrdersRepository: OrdersRepository = {
  async listByCustomer(customerEmail) {
    await mockDelay();
    return customerEmail.trim() ? mockOrders : [];
  },

  async getById(orderId, customerEmail) {
    await mockDelay();
    if (!customerEmail.trim()) return null;
    return mockOrders.find((order) => order.id === orderId) ?? null;
  },

  async findByNumber(orderNumber, customerEmail) {
    await mockDelay();
    if (!customerEmail.trim()) return null;
    const normalizedNumber = orderNumber.trim().toLocaleUpperCase("pt-BR");

    return (
      mockOrders.find(
        (order) => order.number.toLocaleUpperCase("pt-BR") === normalizedNumber,
      ) ?? null
    );
  },
};
