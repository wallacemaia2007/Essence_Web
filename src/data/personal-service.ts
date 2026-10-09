export const personalServiceOptions = [
  {
    value: "provador-agendado",
    title: "Provador agendado",
    description:
      "Reserve um horário para experimentar as peças com calma e receber atenção de perto.",
  },
  {
    value: "separacao-de-pecas",
    title: "Separação de peças",
    description:
      "Conte o que procura e peça uma seleção de peças para conhecer na loja.",
  },
  {
    value: "look-para-evento",
    title: "Look para evento",
    description:
      "Compartilhe a ocasião e converse com a equipe sobre ideias para o seu visual.",
  },
  {
    value: "atendimento-whatsapp",
    title: "Atendimento pelo WhatsApp",
    description:
      "Tire dúvidas e peça orientação antes de vir experimentar na loja.",
  },
] as const;

export type PersonalServiceType =
  (typeof personalServiceOptions)[number]["value"];

// TODO: confirmar quais serviços a loja oferece e ajustar textos/condições antes da publicação.
export const personalServiceSteps = [
  {
    number: "01",
    title: "Conte o que procura",
    description:
      "Escolha o atendimento, indique a ocasião e compartilhe suas preferências.",
  },
  {
    number: "02",
    title: "Receba sugestões",
    description:
      "A equipe conversa com você pelo WhatsApp para alinhar ideias e disponibilidade.",
  },
  {
    number: "03",
    title: "Venha experimentar",
    description:
      "Com a confirmação da equipe, venha à loja para provar e escolher com calma.",
  },
] as const;
