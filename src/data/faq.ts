import { routes } from "@/constants/routes";

export type FaqItem = {
  /** Identificador único e estável (usado como valor do accordion). */
  id: string;
  question: string;
  link?: { href: string; label: string };
  /**
   * Resposta em texto simples. Separe parágrafos com uma linha em branco
   * (`\n\n`). Texto simples porque o mesmo conteúdo alimenta os dados
   * estruturados (JSON-LD) para o Google.
   */
  answer: string;
};

export type FaqGroup = {
  /** Título do grupo (ex.: "Pedidos e entrega"). */
  title: string;
  items: readonly FaqItem[];
};

/**
 * Perguntas frequentes exibidas em `FaqSection`.
 *
 * PLACEHOLDER: textos fictícios para validar o layout. Troque pelas respostas
 * reais da loja (ou substitua por um `fetch` mantendo os tipos acima — o
 * componente não muda).
 */
export const faqGroups = [
  {
    title: "Pedidos e entrega",
    items: [
      {
        id: "prazo-entrega",
        question: "Qual é o prazo de entrega?",
        // TODO: confirmar com a loja
        answer:
          "Prazo estimado por modalidade: PLACEHOLDER. Consulte a página Entrega e frete para acompanhar as informações atualizadas.",
        link: {
          href: routes.entregaFrete,
          label: "Consultar entrega e frete",
        },
      },
      {
        id: "rastrear-pedido",
        question: "Como acompanho meu pedido?",
        // TODO: confirmar com a loja
        answer:
          "Quando disponível, use o código de rastreio informado pela equipe. Canal e prazo para receber o código: PLACEHOLDER.",
        link: {
          href: routes.entregaFrete,
          label: "Ver informações de rastreio",
        },
      },
      {
        id: "frete-gratis",
        question: "Vocês oferecem frete grátis?",
        // TODO: confirmar com a loja
        answer:
          "Valor mínimo, regiões atendidas e condições para frete grátis: PLACEHOLDER.",
        link: {
          href: routes.entregaFrete,
          label: "Consultar condições de frete",
        },
      },
    ],
  },
  {
    title: "Trocas e devoluções",
    items: [
      {
        id: "prazo-troca",
        question: "Qual é o prazo para trocar ou devolver?",
        // TODO: confirmar com a loja
        answer:
          "Prazo para troca voluntária: PLACEHOLDER. Consulte a página de Trocas e devoluções para ver as orientações atualizadas.",
        link: {
          href: routes.trocasDevolucoes,
          label: "Consultar trocas e devoluções",
        },
      },
      {
        id: "como-trocar",
        question: "Como solicito uma troca?",
        // TODO: confirmar com a loja
        answer:
          "Entre em contato com a equipe pelo WhatsApp. Procedimento detalhado e condições aplicáveis: PLACEHOLDER. Consulte a página de Trocas e devoluções.",
        link: {
          href: routes.trocasDevolucoes,
          label: "Ver como solicitar",
        },
      },
    ],
  },
  {
    title: "Pagamento",
    items: [
      {
        id: "formas-pagamento",
        question: "Quais formas de pagamento são aceitas?",
        answer:
          "Cartão de crédito, Pix e boleto bancário. Os meios disponíveis podem variar de acordo com a campanha em andamento.",
      },
      {
        id: "parcelamento",
        question: "Posso parcelar a compra?",
        answer:
          "Sim, no cartão de crédito, em até o número de parcelas exibido no carrinho. As condições de juros aparecem antes de você finalizar o pedido.",
      },
    ],
  },
  {
    title: "Produtos e cuidados",
    items: [
      {
        id: "tabela-medidas",
        question: "Como escolho o tamanho certo?",
        answer:
          "Consulte o guia para aprender a medir busto, cintura e quadril. Se suas medidas ficarem entre dois tamanhos, fale com a equipe para considerar a modelagem da peça.",
        link: {
          href: routes.guiaTamanhos,
          label: "Acessar o guia de tamanhos",
        },
      },
      {
        id: "cuidados-pecas",
        question: "Como devo lavar as peças?",
        answer:
          "Siga as instruções da etiqueta interna. Em geral, lavar do avesso, em água fria e com sabão neutro ajuda a preservar cor e caimento.",
      },
    ],
  },
] as const satisfies readonly FaqGroup[];
