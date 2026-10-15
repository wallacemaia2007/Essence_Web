import { routes } from "@/constants/routes";

export const aboutData = {
  eyebrow: "Sobre a Essence",
  titulo: "Moda pensada para ser vivida",
  // TODO: confirmar com a loja antes da publicação final.
  paragrafos: [
    "A Essence nasceu da vontade de reunir, em um só lugar, peças com personalidade, conforto e acabamento cuidadoso. Cada coleção é escolhida para vestir o dia a dia sem abrir mão do estilo.",
    "Nosso espaço foi desenhado para você experimentar com calma, descobrir combinações e sair com algo que realmente tem a sua cara. Venha conhecer a loja e sentir a diferença de perto.",
  ],
  cta: {
    label: "Conheça nossa história",
    href: routes.sobre,
  },
} as const;
