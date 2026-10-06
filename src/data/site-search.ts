/**
 * Índice de busca do site (páginas + âncoras da home).
 * Usado pelo diálogo de busca acessível — sem backend.
 */
import { anchors, routes } from "@/constants/routes";

export type SiteSearchEntry = {
  label: string;
  description: string;
  href: string;
};

export const siteSearchIndex: readonly SiteSearchEntry[] = [
  {
    label: "Início",
    description: "Página inicial da Essence",
    href: routes.home,
  },
  {
    label: "Sobre",
    description: "Conheça a Essence e o projeto",
    href: routes.sobre,
  },
  {
    label: "Contato",
    description: "Fale com a loja",
    href: routes.contato,
  },
  {
    label: "Localização",
    description: "Loja física em Passos — MG",
    href: `${routes.home}#localizacao`,
  },
  {
    label: "Redes sociais",
    description: "Instagram da Essence",
    href: `${routes.home}#redes-sociais`,
  },
  {
    label: "Conjuntos",
    description: "Coleções e conjuntos em destaque",
    href: `${routes.home}#conjuntos`,
  },
  {
    label: "Sobre a loja",
    description: "Nossa história e presença",
    href: `${routes.home}#sobre-a-loja`,
  },
  {
    label: "Novidades",
    description: "Lançamentos recentes",
    href: `${routes.home}#novidades`,
  },
  {
    label: "Perguntas frequentes",
    description: "Dúvidas sobre pedidos, trocas e entrega",
    href: anchors.faq,
  },
];

export function searchSite(query: string): SiteSearchEntry[] {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");

  if (!normalized) {
    return [];
  }

  return siteSearchIndex.filter((entry) => {
    const haystack = `${entry.label} ${entry.description}`.toLocaleLowerCase(
      "pt-BR",
    );

    return normalized
      .split(/\s+/)
      .every((term) => haystack.includes(term));
  });
}
