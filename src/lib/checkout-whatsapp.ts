import type { CheckoutOrder } from "@/lib/checkout";
import { formatarPreco } from "@/lib/produto";

const paymentLabels = {
  pix: "Pix",
  card: "Cartão",
  boleto: "Boleto",
} as const;

function textoSeguro(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function formatarCep(cep: string) {
  const digits = cep.replace(/\D/g, "");
  return digits.length === 8
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : textoSeguro(cep);
}

function formatarCpf(cpf?: string) {
  const digits = cpf?.replace(/\D/g, "") ?? "";
  if (digits.length !== 11) return "Não informado";

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function montarMensagemPedidoWhatsapp(
  order: CheckoutOrder,
  cpf?: string,
) {
  const fulfillmentLines =
    order.fulfillment.method === "pickup"
      ? [
          "*Recebimento:* Retirada na loja",
          `*Endereço para retirada:* ${textoSeguro(order.fulfillment.address)}`,
        ]
      : [
          "*Recebimento:* Entrega",
          `*CEP:* ${formatarCep(order.fulfillment.cep)}`,
          `*Endereço:* ${textoSeguro(order.fulfillment.street)}, ${textoSeguro(order.fulfillment.number)}`,
          ...(order.fulfillment.complement
            ? [`*Complemento:* ${textoSeguro(order.fulfillment.complement)}`]
            : []),
          `*Bairro:* ${textoSeguro(order.fulfillment.district)}`,
          `*Cidade/UF:* ${textoSeguro(order.fulfillment.city)}/${textoSeguro(order.fulfillment.state)}`,
        ];

  const itemLines = order.items.map(
    (item, index) =>
      `${index + 1}. ${textoSeguro(item.name)} — tam. ${textoSeguro(item.size)} — ${item.quantity} un. — unitário ${formatarPreco(item.unitPrice)} — subtotal ${formatarPreco(item.unitPrice * item.quantity)}`,
  );

  return [
    "Olá, equipe Essence! Gostaria de confirmar meu pedido.",
    "",
    `*Pedido:* ${order.number}`,
    "",
    "*Dados do cliente*",
    `*Nome:* ${textoSeguro(order.customer.name)}`,
    `*E-mail:* ${textoSeguro(order.customer.email)}`,
    `*Telefone:* ${textoSeguro(order.customer.phone)}`,
    `*CPF:* ${formatarCpf(cpf)}`,
    "",
    ...fulfillmentLines,
    "",
    `*Forma de pagamento escolhida:* ${paymentLabels[order.paymentMethod]}`,
    "",
    "*Itens do pedido*",
    ...itemLines,
    "",
    `*Subtotal conhecido:* ${formatarPreco(order.subtotal)}`,
    "*Frete:* A consultar com a loja",
    `*Total antes do frete:* ${formatarPreco(order.subtotal)}`,
    "",
    "Nenhum pagamento foi processado pelo site. Aguardo a confirmação do frete, disponibilidade e valor final pela equipe.",
  ].join("\n");
}
