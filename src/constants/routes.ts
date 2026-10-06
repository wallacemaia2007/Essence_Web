export const routes = {
  home: "/",
  sobre: "/sobre",
  contato: "/contato",
} as const;

/** Âncoras de seções da home. */
export const anchors = {
  hero: `${routes.home}#hero`,
  novidades: `${routes.home}#novidades`,
  instagram: `${routes.home}#redes-sociais`,
  conjuntos: `${routes.home}#conjuntos`,
  sobre: `${routes.home}#sobre-a-loja`,
  localizacao: `${routes.home}#localizacao`,
  faq: `${routes.home}#faq`,
} as const;

export const navLinks = [
  { label: "Novidades", href: anchors.novidades },
  { label: "Instagram", href: anchors.instagram },
  { label: "Looks", href: anchors.conjuntos },
  { label: "Sobre", href: anchors.sobre },
  { label: "Localização", href: anchors.localizacao },
  { label: "Dúvidas", href: anchors.faq },
] as const;

export const externalLinks = {
  github: "https://github.com",
  instagram: "https://www.instagram.com/essencepassos/",
  facebook: "https://www.facebook.com/essence.passos/",
} as const;
