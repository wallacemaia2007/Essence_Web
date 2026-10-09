export const routes = {
  home: "/",
  sobre: "/sobre",
  contato: "/contato",
  atendimentoPersonalizado: "/atendimento-personalizado",
  login: "/login",
  conta: "/conta",
  pedidos: "/pedidos",
  pedidoDetalhe: (id: string) => `/pedidos/${encodeURIComponent(id)}`,
  register: "/register",
  perfil: "/perfil",
  meusPedidos: "/meus-pedidos",
  forgotPassword: "/login/forgot-password",
  verifyCode: "/verificar-codigo",
  resetPassword: "/redefinir-senha",
  colecao: "/colecao",
  outlet: "/outlet",
  conjuntos: "/conjuntos",
  produto: "/produto",
  favoritos: "/favoritos",
  carrinho: "/carrinho",
  checkout: "/checkout",
  pedidoConfirmacao: (id: string) => `/pedido/${encodeURIComponent(id)}`,
  finalizarPedido: "/finalizar-pedido",
  politicaPrivacidade: "/politica-de-privacidade",
  termosUso: "/termos-de-uso",
  politicaCookies: "/politica-de-cookies",
  guiaTamanhos: "/guia-de-tamanhos",
  trocasDevolucoes: "/trocas-e-devolucoes",
  entregaFrete: "/entrega-e-frete",
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
  { label: "Outlet", href: routes.outlet },
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
