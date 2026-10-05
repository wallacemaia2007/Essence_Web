import { z } from "zod";

import { contatoAssuntos } from "@/data/contato";

export const contatoFormSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome."),
  email: z.email("Informe um e-mail válido."),
  telefone: z.string().trim().optional(),
  assunto: z.enum(contatoAssuntos, {
    error: "Selecione um assunto.",
  }),
  mensagem: z
    .string()
    .trim()
    .min(10, "Escreva uma mensagem com pelo menos 10 caracteres."),
  _gotcha: z.string().optional(),
});

export type ContatoFormValues = z.infer<typeof contatoFormSchema>;
