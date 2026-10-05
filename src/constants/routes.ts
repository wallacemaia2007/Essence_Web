export const routes = {
  home: "/",
  sobre: "/sobre",
  contato: "/contato",
} as const;

export const navLinks = [
  { label: "Sobre", href: routes.sobre },
  { label: "Contato", href: routes.contato },
] as const;

export const externalLinks = {
  github: "https://github.com",
} as const;