export const contato = {
  email: "contato@example.com",
  whatsapp: "5535992050341",
  telefone: "+55 (35) 99205-0341",
};

export const contatoAssuntos = [
  "Dúvida sobre produtos",
  "Pedido e entrega",
  "Trocas e devoluções",
  "Loja física",
  "Outro",
] as const;

export type ContatoAssunto = (typeof contatoAssuntos)[number];
