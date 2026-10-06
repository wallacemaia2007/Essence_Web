export const contato = {
  email: "contato@example.com",
  whatsapp: "5535992050341",
  telefone: "+55 (35) 99205-0341",
};

export const contatoAssuntos = [
  "Dúvida Geral",
  "Parceria",
  "Proposta Comercial",
  "Outro",
] as const;

export type ContatoAssunto = (typeof contatoAssuntos)[number];
