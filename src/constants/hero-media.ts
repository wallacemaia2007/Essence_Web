/**
 * Mídia do hero da home.
 *
 * Este é o ÚNICO lugar onde os caminhos dos arquivos ficam definidos —
 * trocar o vídeo é só trocar a string aqui (e o nome do arquivo em `public/`).
 *
 * Arquivos esperados (servidos a partir da raiz do site):
 *   public/videos/hero-essence.mp4        → H.264, referência de compatibilidade
 *   public/videos/hero-essence.webm       → VP9, usado onde houver suporte
 *   public/images/hero/hero-essence-poster.webp → primeiro frame do vídeo
 *
 * Ver `docs/hero.md` para os comandos de ffmpeg que geram esses arquivos.
 */
export const heroMedia = {
  /** H.264 (AAC removido). Primeiro <source>: funciona em qualquer navegador. */
  mp4: "/videos/hero-essence.mp4",
  /** VP9. Segundo <source>: mesma resolução, ~30-50% menor. */
  webm: "/videos/hero-essence.webm",
  /** Imagem do primeiro frame — evita tela preta e protege o LCP. */
  poster: "/images/hero/hero-essence-poster.webp",
} as const;

export type HeroMedia = typeof heroMedia;
