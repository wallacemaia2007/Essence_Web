import { externalLinks } from "@/constants/routes";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://homolog-essence.vercel.app";

export const baseUrl = new URL(configuredSiteUrl);

export function absoluteUrl(path = "/") {
  return new URL(path, baseUrl).toString();
}

export const siteName = "Essence";
export const siteTagline = "Moda que expressa quem você é.";
export const siteDescription =
  "Moda feminina para expressar quem você é. Essence Passos.";

// TODO: substituir pela foto oficial da loja quando a Essence enviar a imagem.
export const ogImage = "/images/about/about-essence.webp";

// TODO: confirmar com a loja e configurar o e-mail oficial de atendimento.
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

export const socialLinks = [
  externalLinks.instagram,
  externalLinks.facebook,
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
    title: "Essence Passos",
    description: siteDescription,
    path: "/",
    ogImage,
    type: "website",
  },
  sobre: {
    title: "Sobre a Essence Passos | Moda feminina",
    description:
      "Conheça a Essence Passos e a proposta de moda que expressa quem você é.",
    path: "/sobre",
    ogImage,
    type: "website",
  },
  clube: {
    title: "Clube da Essence",
    description: "Informações institucionais sobre o Clube da Essence.",
    path: "/clube",
    ogImage,
    type: "website",
  },
  contato: {
    title: "Contato",
    description:
      "Fale com a equipe da Essence Passos sobre produtos, pedidos, trocas, entregas ou uma visita à loja.",
    path: "/contato",
    ogImage,
    type: "website",
  },
};
