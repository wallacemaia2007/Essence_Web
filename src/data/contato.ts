export const contato = {
  email: "contato@example.com",
  whatsapp: "5535992050341",
  institutoMotiro: "https://github.com",
};

export const contatoAssuntos = [
  "Dúvida Geral",
  "Parceria",
  "Proposta Comercial",
  "Outro",
] as const;

export type ContatoAssunto = (typeof contatoAssuntos)[number];
