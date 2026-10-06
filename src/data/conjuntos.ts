import { externalLinks } from "@/constants/routes";

export type Conjunto = {
  /** Identificador único e estável do banner. */
  id: string;
  /** Nome exibido sobre o banner (ex.: "Conjuntos Verão"). */
  titulo: string;
  /** Frase curta opcional sob o título. */
  descricao?: string;
  /** Caminho da imagem 16:9 (ex.: `/images/conjuntos/conjunto-verao.webp`). */
  image: string;
  /** Texto alternativo da imagem para leitores de tela. */
  alt: string;
  /**
   * Destino do banner (opcional). Sem `href`, o banner aparece sem link.
   * Links que começam com `http` abrem em nova aba.
   */
  href?: string;
};

/**
 * PLACEHOLDER: textos e imagens provisórios da seção "Conjuntos".
 *
 * Para trocar uma imagem, sobrescreva o arquivo em `public/images/conjuntos/`
 * com o mesmo nome (16:9, ~1280×720 ou 1600×900, WebP, até ~150 KB) ou mude o
 * caminho aqui. Para adicionar ou remover banners, edite o array `itens`.
 */
export const conjuntosData = {
  eyebrow: "Conjuntos",
  titulo: "Looks completos para cada ocasião",
  descricao:
    "Combinações prontas para vestir: do verão ao inverno, do dia a dia à festa.",
  cta: {
    label: "Ver mais no Instagram",
    href: externalLinks.instagram,
  },
  itens: [
    {
      id: "vestidos",
      titulo: "Vestidos",
      descricao: "Leves e fluidos, prontos para qualquer ocasião.",
      image: "/images/conjuntos/conjunto-vestidos.webp",
      alt: "Vestidos da Essence",
    },
    {
      id: "conjuntos-verao",
      titulo: "Conjuntos Verão",
      descricao: "Tecidos frescos para os dias quentes.",
      image: "/images/conjuntos/conjunto-verao.webp",
      alt: "Conjuntos de verão da Essence",
    },
    {
      id: "conjuntos-inverno",
      titulo: "Conjuntos Inverno",
      descricao: "Aconchego com estilo nos dias frios.",
      image: "/images/conjuntos/conjunto-inverno.webp",
      alt: "Conjuntos de inverno da Essence",
    },
    {
      id: "alfaiataria",
      titulo: "Alfaiataria",
      descricao: "Cortes precisos para o trabalho e além.",
      image: "/images/conjuntos/conjunto-alfaiataria.webp",
      alt: "Conjuntos de alfaiataria da Essence",
    },
    {
      id: "festa",
      titulo: "Festa",
      descricao: "Peças para brilhar nas ocasiões especiais.",
      image: "/images/conjuntos/conjunto-festa.webp",
      alt: "Looks de festa da Essence",
    },
    {
      id: "casual",
      titulo: "Casual",
      descricao: "Conforto e praticidade no dia a dia.",
      image: "/images/conjuntos/conjunto-casual.webp",
      alt: "Conjuntos casuais da Essence",
    },
  ] satisfies Conjunto[],
} as const;
