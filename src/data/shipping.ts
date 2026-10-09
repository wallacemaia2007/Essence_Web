import type { FaqGroup } from "@/data/faq";

type ShippingDetail = {
  label: string;
  value: string;
};

type ShippingMethod = {
  id: "pickup" | "local" | "other-cities";
  title: string;
  description: string;
  details: readonly ShippingDetail[];
};

type ShippingPageContent = {
  page: {
    title: string;
    description: string;
  };
  methods: {
    title: string;
    description: string;
    items: readonly ShippingMethod[];
  };
  pickup: {
    addressLabel: string;
    hoursLabel: string;
    directionsLabel: string;
  };
  calculator: {
    title: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    submitLabel: string;
    invalidCepMessage: string;
    resultTitle: string;
    priceLabel: string;
    deadlineLabel: string;
    mockPrice: string;
    mockDeadline: string;
    mockNotice: string;
  };
  freeShipping: {
    title: string;
    description: string;
    minimumLabel: string;
    minimumValue: string;
    conditionsLabel: string;
    conditionsValue: string;
  };
  tracking: {
    title: string;
    description: string;
    ordersPath: string;
    ordersPageAvailable: boolean;
    linkLabel: string;
    unavailableMessage: string;
  };
  quickFaq: FaqGroup;
  contact: {
    title: string;
    description: string;
    ctaLabel: string;
    whatsappMessage: string;
  };
};

/**
 * Conteúdo de entrega e frete separado do JSX para edição pela loja.
 * Prazos, valores, disponibilidade e condições seguem pendentes de confirmação.
 */
export const shippingInfo = {
  page: {
    title: "Entrega e frete",
    description:
      "Confira as opções de retirada e entrega da Essence. Prazos, valores e disponibilidade ainda estão em confirmação pela loja.",
  },
  methods: {
    title: "Opções de recebimento",
    description:
      "Veja as modalidades previstas para receber seu pedido. As informações marcadas como PLACEHOLDER precisam ser confirmadas antes da publicação.",
    items: [
      {
        id: "pickup",
        title: "Retirada na loja",
        description:
          "Consulte a equipe para combinar a retirada no endereço da Essence em Passos.",
        details: [
          {
            label: "Custo da retirada",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
          {
            label: "Prazo para retirada",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
        ],
      },
      {
        id: "local",
        title: "Entrega local em Passos",
        // TODO: confirmar com a loja se essa modalidade existe
        description:
          "Disponibilidade e bairros atendidos em Passos: PLACEHOLDER.",
        details: [
          {
            label: "Disponibilidade",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
          {
            label: "Prazo estimado",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
          {
            label: "Valor",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
        ],
      },
      {
        id: "other-cities",
        title: "Envio para outras cidades",
        // TODO: confirmar com a loja se o envio é feito pelos Correios ou por transportadora
        description:
          "Serviço utilizado para envios fora de Passos: PLACEHOLDER.",
        details: [
          {
            label: "Serviço de envio",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
          {
            label: "Prazo estimado",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
          {
            label: "Valor",
            // TODO: confirmar com a loja
            value: "PLACEHOLDER",
          },
        ],
      },
    ],
  },
  pickup: {
    addressLabel: "Endereço da loja",
    hoursLabel: "Horário de atendimento",
    directionsLabel: "Como chegar",
  },
  calculator: {
    title: "Calcule seu frete",
    description:
      "Informe o CEP de destino para ver uma simulação local. Esta consulta não acessa Correios, transportadoras nem gateway de frete.",
    inputLabel: "CEP de destino",
    inputPlaceholder: "00000-000",
    submitLabel: "Calcular frete",
    invalidCepMessage: "Informe um CEP válido com 8 dígitos.",
    resultTitle: "Simulação para este CEP",
    priceLabel: "Valor estimado",
    deadlineLabel: "Prazo estimado",
    // TODO: confirmar com a loja
    mockPrice: "PLACEHOLDER",
    // TODO: confirmar com a loja
    mockDeadline: "PLACEHOLDER",
    mockNotice:
      "Resultado demonstrativo: nenhum serviço externo foi consultado. Valores e prazos reais dependem da confirmação da loja.",
  },
  freeShipping: {
    title: "Frete grátis",
    description:
      "A disponibilidade, as regiões atendidas e as condições da oferta precisam ser definidas pela loja.",
    minimumLabel: "Valor mínimo da compra",
    // TODO: confirmar com a loja
    minimumValue: "PLACEHOLDER",
    conditionsLabel: "Regiões e condições",
    // TODO: confirmar com a loja
    conditionsValue: "PLACEHOLDER",
  },
  tracking: {
    title: "Acompanhe seu pedido",
    // TODO: confirmar com a loja
    description:
      "Quando houver código de rastreio, use-o para consultar as atualizações junto ao serviço de entrega. Canal e prazo para receber o código: PLACEHOLDER.",
    ordersPath: "/pedidos",
    ordersPageAvailable: true,
    linkLabel: "Acompanhar pedido",
    unavailableMessage:
      "O link para /pedidos será ativado quando a página de pedidos estiver disponível.",
  },
  quickFaq: {
    title: "Entrega, frete e rastreio",
    items: [
      {
        id: "prazo-entrega",
        question: "Qual é o prazo de entrega?",
        // TODO: confirmar com a loja
        answer: "Prazo estimado por modalidade: PLACEHOLDER.",
      },
      {
        id: "acompanhar-entrega",
        question: "Como acompanho meu pedido?",
        // TODO: confirmar com a loja
        answer:
          "Quando disponível, use o código de rastreio informado pela equipe. Canal e prazo para receber o código: PLACEHOLDER.",
      },
      {
        id: "frete-gratis",
        question: "Vocês oferecem frete grátis?",
        // TODO: confirmar com a loja
        answer:
          "Valor mínimo, regiões atendidas e condições para frete grátis: PLACEHOLDER.",
      },
    ],
  },
  contact: {
    title: "Precisa de ajuda com a entrega?",
    description:
      "Fale com a equipe da Essence para confirmar as opções disponíveis para o seu pedido.",
    ctaLabel: "Falar com a equipe",
    whatsappMessage:
      "Olá! Gostaria de saber sobre as opções de entrega e frete da Essence.",
  },
} satisfies ShippingPageContent;
