import { CHECKOUT_ORDERS_STORAGE_KEY } from "@/constants/storage";

export type CheckoutPaymentMethod = "pix" | "card" | "boleto";
export type CheckoutFulfillmentMethod = "delivery" | "pickup";

export type CheckoutOrderItem = {
  id: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type CheckoutOrder = {
  id: string;
  number: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: readonly CheckoutOrderItem[];
  fulfillment:
    | {
        method: "delivery";
        cep: string;
        street: string;
        number: string;
        complement: string;
        district: string;
        city: string;
        state: string;
      }
    | {
        method: "pickup";
        address: string;
      };
  paymentMethod: CheckoutPaymentMethod;
  subtotal: number;
  freight: null;
  total: null;
  status: "awaiting-store-confirmation";
  demo: true;
};

export type CreateOrderInput = {
  customer: CheckoutOrder["customer"];
  items: readonly CheckoutOrderItem[];
  fulfillment: CheckoutOrder["fulfillment"];
  paymentMethod: CheckoutPaymentMethod;
};

const ORDER_TTL_MS = 24 * 60 * 60 * 1000;
const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const memoryOrders = new Map<string, CheckoutOrder>();
const pendingWhatsappMessages = new Map<string, string>();

function isPaymentMethod(value: unknown): value is CheckoutPaymentMethod {
  return value === "pix" || value === "card" || value === "boleto";
}

function isCheckoutOrder(value: unknown): value is CheckoutOrder {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Partial<CheckoutOrder>;

  return (
    typeof order.id === "string" &&
    /^[A-Z0-9]{8}$/.test(order.id) &&
    typeof order.number === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.customer === "object" &&
    order.customer !== null &&
    typeof order.customer.name === "string" &&
    typeof order.customer.email === "string" &&
    typeof order.customer.phone === "string" &&
    Array.isArray(order.items) &&
    (order.fulfillment?.method === "delivery" ||
      order.fulfillment?.method === "pickup") &&
    isPaymentMethod(order.paymentMethod) &&
    typeof order.subtotal === "number" &&
    order.freight === null &&
    order.total === null &&
    order.demo === true
  );
}

function readSessionOrders() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_ORDERS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const now = Date.now();
    return parsed.filter(
      (order): order is CheckoutOrder =>
        isCheckoutOrder(order) &&
        Number.isFinite(Date.parse(order.createdAt)) &&
        now - Date.parse(order.createdAt) <= ORDER_TTL_MS,
    );
  } catch {
    return [];
  }
}

function persistSessionOrders(orders: readonly CheckoutOrder[]) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      CHECKOUT_ORDERS_STORAGE_KEY,
      JSON.stringify(orders.slice(-20)),
    );
  } catch {
    // A ordem permanece disponível em memória para a navegação desta sessão.
  }
}

function createShortId() {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(
    bytes,
    (byte) => ORDER_ALPHABET[byte % ORDER_ALPHABET.length],
  )
    .join("")
    .slice(0, 8);
}

/**
 * Cria um pedido exclusivamente demonstrativo. Substitua por API/gateway quando
 * houver backend; não recebe, registra nem persiste CPF ou dados de cartão.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<CheckoutOrder> {
  if (input.items.length === 0) {
    throw new Error("Não é possível criar um pedido sem itens.");
  }

  for (const item of input.items) {
    if (
      !item.id ||
      !item.name ||
      !item.size ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      !Number.isFinite(item.unitPrice) ||
      item.unitPrice < 0
    ) {
      throw new Error("O resumo do pedido contém um item inválido.");
    }
  }

  const subtotal = input.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const id = createShortId();
  const order: CheckoutOrder = {
    id,
    number: `ESS-${new Date().getFullYear()}-${id}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: input.customer.name.trim(),
      email: input.customer.email.trim().toLowerCase(),
      phone: input.customer.phone.trim(),
    },
    items: input.items.map((item) => ({ ...item })),
    fulfillment: { ...input.fulfillment },
    paymentMethod: input.paymentMethod,
    subtotal,
    freight: null,
    total: null,
    status: "awaiting-store-confirmation",
    demo: true,
  };

  memoryOrders.set(order.id, order);
  const existingOrders = readSessionOrders().filter((saved) => saved.id !== id);
  persistSessionOrders([...existingOrders, order]);

  return order;
}

/** Retorna apenas pedidos mock da aba atual, sem fazer chamadas externas. */
export function getCheckoutOrder(id: string): CheckoutOrder | null {
  if (!/^[A-Z0-9]{8}$/.test(id)) return null;

  const inMemory = memoryOrders.get(id);
  if (inMemory) return inMemory;

  const order = readSessionOrders().find((saved) => saved.id === id) ?? null;
  if (order) memoryOrders.set(order.id, order);
  return order;
}

/** Mantém a mensagem pré-preenchida apenas na memória durante a troca de rota. */
export function setCheckoutWhatsappMessage(orderId: string, message: string) {
  pendingWhatsappMessages.clear();
  pendingWhatsappMessages.set(orderId, message);
}

export function getCheckoutWhatsappMessage(orderId: string) {
  return pendingWhatsappMessages.get(orderId) ?? null;
}
