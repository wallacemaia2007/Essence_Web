const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com";

export const baseUrl = new URL(configuredSiteUrl);

if (baseUrl.hostname === "example.com") {
  baseUrl.hostname = "www.example.com";
}

export function absoluteUrl(path = "/") {
  return new URL(path, baseUrl).toString();
}

export const siteName = "Essence Web Template";
export const siteDescription =
  "Um template moderno Next.js com Tailwind CSS, tipografia personalizada e sistema de temas alternados.";

export const ogImage = "/images/og-template.svg";

export const socialLinks = [
  "https://github.com",
  "https://twitter.com",
  "https://linkedin.com",
] as const;

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "profile" | "website";
};

export const pages: Record<string, PageSeo> = {
  home: {
    title: "Essence Web Template",
    description: siteDescription,
    path: "/",
    ogImage,
    type: "website",
  },
  sobre: {
    title: "Sobre",
    description: "Conheça mais sobre este template e sua arquitetura.",
    path: "/sobre",
    ogImage,
    type: "website",
  },
  contato: {
    title: "Contato",
    description: "Entre em contato para dúvidas, sugestões ou parcerias.",
    path: "/contato",
    ogImage,
    type: "website",
  },
};