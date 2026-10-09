import type { FaqGroup } from "@/data/faq";

type SummaryCard = {
  title: string;
  value: string;
  description: string;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type RuleItem = {
  label: string;
  value: string;
};

type PurchaseChannel = {
  title: string;
  description: string;
  rules: readonly RuleItem[];
};

type ReturnsPolicy = {
  page: {
    title: string;
    description: string;
  };
  summary: {
    title: string;
    description: string;
    cards: readonly SummaryCard[];
  };
  process: {
    title: string;
    description: string;
    steps: readonly ProcessStep[];
  };
  purchases: readonly PurchaseChannel[];
  withdrawal: {
    title: string;
    legalBasis: string;
    body: string;
    validationNote: string;
  };
  exclusions: {
    title: string;
    description: string;
    items: readonly RuleItem[];
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
 * Rascunho editorial. Regras comerciais só devem ser publicadas depois de
 * confirmadas pela loja; cada informação pendente permanece marcada abaixo.
 */
export const returnsPolicy = {
  page: {
    title: "Trocas e devoluções",
    description:
      "Consulte as orientações para solicitar uma troca ou devolução. Prazos e condições comerciais estão em confirmação pela loja.",
  },
  summary: {
    title: "Informações principais",
    description:
      "Um resumo inicial do atendimento. Os campos pendentes não representam regras definitivas.",
    cards: [
      {
        title: "Prazo",
        // TODO: confirmar com a loja
        value: "PLACEHOLDER",
        description: "Prazo para solicitar uma troca voluntária.",
      },
      {
        title: "Condições da peça",
        // TODO: confirmar com a loja
        value: "PLACEHOLDER",
        description: "Condições exigidas para análise de uma solicitação.",
      },
      {
        title: "Como solicitar",
        value: "WhatsApp",
        description:
          "Fale com a equipe; ela orientará os próximos passos do atendimento.",
      },
    ],
  },
  process: {
    title: "Passo a passo da troca",
    description:
      "O fluxo abaixo organiza o atendimento. Critérios, prazos e logística ainda dependem de confirmação da loja.",
    steps: [
      {
        number: "01",
        title: "Fale com a equipe pelo WhatsApp",
        // TODO: confirmar com a loja
        description:
          "Conte que deseja solicitar uma troca ou devolução. As informações necessárias para localizar a compra: PLACEHOLDER.",
      },
      {
        number: "02",
        title: "Envio ou entrega na loja",
        // TODO: confirmar com a loja
        description:
          "A equipe orientará se a peça deve ser enviada ou entregue na loja. Modalidade, endereço, prazo e custos: PLACEHOLDER.",
      },
      {
        number: "03",
        title: "Análise da solicitação",
        // TODO: confirmar com a loja
        description:
          "A peça e a solicitação serão analisadas. Critérios e prazo da análise: PLACEHOLDER.",
      },
      {
        number: "04",
        title: "Conclusão",
        // TODO: confirmar com a loja
        description:
          "Depois da análise, a equipe informa a conclusão e os próximos passos. Solução e prazo: PLACEHOLDER.",
      },
    ],
  },
  purchases: [
    {
      title: "Compra pelo site",
      description:
        "As condições comerciais para trocas voluntárias de pedidos feitos pelo site serão informadas após confirmação da loja.",
      rules: [
        {
          label: "Prazo para troca voluntária",
          // TODO: confirmar com a loja
          value: "PLACEHOLDER",
        },
        {
          label: "Procedimento e logística de envio",
          // TODO: confirmar com a loja
          value: "PLACEHOLDER",
        },
      ],
    },
    {
      title: "Compra na loja física",
      description:
        "As condições para compras presenciais são apresentadas separadamente das compras pelo site e aguardam confirmação da loja.",
      rules: [
        {
          label: "Prazo para troca voluntária",
          // TODO: confirmar com a loja
          value: "PLACEHOLDER",
        },
        {
          label: "Apresentação da peça e comprovante",
          // TODO: confirmar com a loja
          value: "PLACEHOLDER",
        },
      ],
    },
  ],
  withdrawal: {
    title: "Direito de arrependimento",
    legalBasis: "Código de Defesa do Consumidor (CDC), art. 49",
    // TODO: confirmar com a loja e validar a redação final antes da publicação
    body: "Em contratações feitas fora do estabelecimento comercial — como compras pela internet — o CDC prevê o direito de desistência no prazo de 7 dias, contado da assinatura ou do recebimento do produto ou serviço, conforme o art. 49.",
    validationNote:
      "Texto informativo provisório. A redação final e sua aplicação ao fluxo da loja devem ser validadas antes da publicação.",
  },
  exclusions: {
    title: "Peças que não podem ser trocadas",
    description:
      "Os exemplos abaixo são pontos para a loja avaliar, não regras vigentes. Nenhuma restrição será apresentada como definitiva até a confirmação; direitos previstos em lei permanecem preservados.",
    items: [
      {
        label: "Peças em liquidação",
        // TODO: confirmar com a loja
        value: "PLACEHOLDER",
      },
      {
        label: "Peças usadas",
        // TODO: confirmar com a loja
        value: "PLACEHOLDER",
      },
      {
        label: "Outras situações ou categorias",
        // TODO: confirmar com a loja
        value: "PLACEHOLDER",
      },
    ],
  },
  quickFaq: {
    title: "Dúvidas rápidas",
    items: [
      {
        id: "prazo-troca-voluntaria",
        question: "Qual é o prazo para solicitar uma troca?",
        // TODO: confirmar com a loja
        answer: "Prazo para troca voluntária: PLACEHOLDER.",
      },
      {
        id: "como-solicitar-troca",
        question: "Como solicito uma troca?",
        // TODO: confirmar com a loja
        answer:
          "Entre em contato com a equipe pelo WhatsApp. Demais etapas e informações necessárias: PLACEHOLDER.",
      },
      {
        id: "restricoes-troca",
        question: "Há peças que não podem ser trocadas?",
        // TODO: confirmar com a loja
        answer:
          "Possíveis restrições para peças em liquidação, peças usadas ou outras situações: PLACEHOLDER.",
      },
    ],
  },
  contact: {
    title: "Ficou com alguma dúvida?",
    description:
      "Fale com a equipe da Essence pelo WhatsApp para receber orientação sobre sua solicitação.",
    ctaLabel: "Falar com a equipe",
    whatsappMessage:
      "Olá! Gostaria de orientação sobre troca ou devolução de uma peça.",
  },
} satisfies ReturnsPolicy;
