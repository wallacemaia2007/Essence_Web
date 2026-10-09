export const routes = {
  home: "/",
  sobre: "/sobre",
  contato: "/contato",
  login: "/login",
  register: "/register",
  perfil: "/perfil",
  meusPedidos: "/meus-pedidos",
  forgotPassword: "/login/forgot-password",
  verifyCode: "/verificar-codigo",
  resetPassword: "/redefinir-senha",
  colecao: "/colecao",
  conjuntos: "/conjuntos",
  produto: "/produto",
  favoritos: "/favoritos",
  carrinho: "/carrinho",
  finalizarPedido: "/finalizar-pedido",
  politicaPrivacidade: "/politica-de-privacidade",
  termosUso: "/termos-de-uso",
  guiaTamanhos: "/guia-de-tamanhos",
  trocasDevolucoes: "/trocas-e-devolucoes",
} as const;

/** Âncoras de seções da home. */
export const anchors = {
  hero: `${routes.home}#hero`,
  novidades: `${routes.home}#novidades`,
  vitrine: `${routes.home}#vitrine`,
  instagram: `${routes.home}#redes-sociais`,
  conjuntos: `${routes.home}#conjuntos`,
  sobre: `${routes.home}#sobre-a-loja`,
  localizacao: `${routes.home}#localizacao`,
  faq: `${routes.home}#faq`,
} as const;

export const navLinks = [
  { label: "Catálogo", href: routes.colecao },
  { label: "Conjuntos", href: routes.conjuntos },
  { label: "Novidades", href: anchors.novidades },
  { label: "Sobre", href: routes.sobre },
  { label: "Contato", href: routes.contato },
] as const;

export const externalLinks = {
  github: "https://github.com",
  instagram: "https://www.instagram.com/essencepassos/",
  facebook: "https://www.facebook.com/essence.passos/",
} as const;
