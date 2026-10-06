/**
 * PLACEHOLDER: destino provisório dos botões "Comprar" (Instagram da loja).
 * Troque, em cada item, pelo link de compra da peça (produto, WhatsApp...).
 */
const COMPRAR_PROVISORIO = "https://www.instagram.com/essencepassos/";

/** Máximo de imagens da seção: 5 pares (esquerda + direita). */
export const NOVIDADES_MAX_ITENS = 10;

export type Novidade = {
  /** Identificador único e estável. */
  id: string;
  /** Nome da peça/look (usado no texto acessível do botão). */
  nome: string;
  /** Caminho da imagem (ex.: `/images/novidades/novidade-01.webp`). */
  image: string;
  /** Texto alternativo da imagem para leitores de tela. */
  alt: string;
  /**
   * Destino do botão "Comprar" (página do produto, WhatsApp, Instagram...).
   * Links que começam com `http` abrem em nova aba.
   */
  href: string;
  /** Rótulo do botão. Padrão: "Comprar". */
  buttonLabel?: string;
  /** Enquadramento da foto (object-position). Padrão: "center". */
  objectPosition?: string;
};

/**
 * PLACEHOLDER: textos, imagens e links provisórios da seção "Novidades".
 *
 * Como funciona: as imagens entram em ordem, de duas em duas — a 1ª fica à
 * esquerda e a 2ª à direita do primeiro par, a 3ª e a 4ª formam o segundo par,
 * e assim por diante, até 10 imagens (5 pares). Acima de 10, o excedente é
 * ignorado. Se o total for ímpar, a última imagem ocupa a largura toda.
 *
 * Para trocar uma foto, sobrescreva o arquivo em `public/images/novidades/`
 * (mesmo nome; sugestão: vertical 4:5, ~1200×1500, WebP, até ~250 KB) ou mude
 * o caminho aqui. Troque também o `href` pelo link de compra de cada peça.
 */
export const novidadesData = {
  eyebrow: "Novidades",
  titulo: "Acabou de chegar",
  itens: [
    {
      id: "novidade-01",
      nome: "Novidade 01",
      image: "/images/novidades/novidade-01.webp",
      alt: "Novidade 01 da Essence",
      href: COMPRAR_PROVISORIO,
    },
    {
      id: "novidade-02",
      nome: "Novidade 02",
      image: "/images/novidades/novidade-02.webp",
      alt: "Novidade 02 da Essence",
      href: COMPRAR_PROVISORIO,
    },
    {
      id: "novidade-03",
      nome: "Novidade 03",
      image: "/images/novidades/novidade-03.webp",
      alt: "Novidade 03 da Essence",
      href: COMPRAR_PROVISORIO,
    },
    {
      id: "novidade-04",
      nome: "Novidade 04",
      image: "/images/novidades/novidade-04.webp",
      alt: "Novidade 04 da Essence",
      href: COMPRAR_PROVISORIO,
    },
  ] satisfies Novidade[],
} as const;
