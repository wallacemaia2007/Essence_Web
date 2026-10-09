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
        answer:
          "O prazo é calculado no carrinho, a partir do CEP, e começa a contar depois da confirmação do pagamento.\n\nPedidos com itens de coleções diferentes podem ser enviados separadamente.",
      },
      {
        id: "rastrear-pedido",
        question: "Como acompanho meu pedido?",
        answer:
          "Assim que o pedido for despachado, enviamos o código de rastreio por e-mail. Você também pode consultar o status na área da sua conta.",
      },
      {
        id: "frete-gratis",
        question: "Vocês oferecem frete grátis?",
        answer:
          "Sim, em compras acima de um valor mínimo definido pela loja. A condição aparece no carrinho quando disponível para o seu CEP.",
      },
    ],
  },
  {
    title: "Trocas e devoluções",
    items: [
      {
        id: "prazo-troca",
        question: "Qual é o prazo para trocar ou devolver?",
        answer:
          "Você tem 7 dias corridos após o recebimento para desistir da compra, e 30 dias para solicitar troca por tamanho ou defeito.",
      },
      {
        id: "como-trocar",
        question: "Como solicito uma troca?",
        answer:
          "Entre em contato pelo formulário do site informando o número do pedido e o item. Enviaremos as instruções de envio e, depois de recebermos a peça, concluímos a troca.\n\nA peça deve estar sem uso, com etiquetas e na embalagem original.",
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
