import { externalLinks } from "@/constants/routes";
import { contato } from "@/data/contato";
import { buildGmailComposeUrl } from "@/lib/gmail";

export type FooterUsefulLink = {
  label: string;
  href: string;
};

export const footerData = {
  descricaoBreve:
    "Template moderno Next.js com Tailwind CSS, tipografia personalizada e sistema de temas alternados.",
  creditos: {
    prefixo: "Desenvolvido por",
    nome: "Essence Web",
    href: externalLinks.github,
  },
  linksUteis: [
    {
      label: "GitHub",
      href: externalLinks.github,
    },
    {
      label: "E-mail direto",
      href: buildGmailComposeUrl({ to: contato.email }),
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${contato.whatsapp}`,
    },
  ] satisfies FooterUsefulLink[],
} as const;