import { routes } from "@/constants/routes";

export type Collection = {
  /** Nome exibido na faixa do carrossel do hero. */
  name: string;
  /** Slug usado para montar a URL da coleção (`/colecao/<slug>`). */
  slug: string;
  /**
   * Link da coleção (opcional).
   *
   * Sem destino disponível, o hero renderiza texto simples em vez de criar
   * um link para uma página inexistente.
   */
  href?: string;
};

/**
 * Coleções exibidas na faixa infinita do rodapé do hero.
 *
 * PLACEHOLDER: os nomes abaixo são fictícios e servem apenas para validar o
 * layout. Troque pelos nomes reais do catálogo (ou substitua este array por um
 * `fetch` da API mantendo o mesmo tipo `Collection` — o componente não muda).
 */
export const collections = [
  { name: "Verão 26", slug: "verao-26" },
  { name: "Essentials", slug: "essentials" },
  { name: "Streetwear", slug: "streetwear" },
  { name: "Linho", slug: "linho" },
  { name: "Noite", slug: "noite" },
  { name: "Básicos", slug: "basicos" },
  { name: "Denim", slug: "denim" },
  { name: "Acessórios", slug: "acessorios" },
  { name: "Novidades", slug: "novidades" },
  { name: "Outlet", slug: "outlet", href: routes.outlet },
] as const satisfies readonly Collection[];
