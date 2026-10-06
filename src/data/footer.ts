import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  title: string;
  links: readonly FooterLink[];
};

/**
 * PLACEHOLDER: `href: "#"` marca páginas que ainda não existem no projeto.
 * Quando a rota entrar no ar, troque o "#" pelo caminho real (ou adicione a
 * rota em `src/constants/routes.ts` e use aqui).
 */
const PENDING = "#";

export const footerData = {
  marca: "Essence",
  descricaoBreve: "Moda que expressa quem você é.",

  newsletter: {
    titulo: "Receba novidades e lançamentos",
    descricao: "Cadastre seu e-mail e fique por dentro das próximas coleções.",
    placeholder: "Seu melhor e-mail",
    botao: "Inscrever-se",
    sucesso: "Pronto! Você está na lista da Essence.",
  },

  grupos: [
    {
      title: "Loja",
      links: [
        { label: "Novidades", href: PENDING },
        { label: "Coleções", href: PENDING },
        { label: "Feminino", href: PENDING },
        { label: "Masculino", href: PENDING },
        { label: "Acessórios", href: PENDING },
        { label: "Outlet", href: PENDING },
      ],
    },
    {
      title: "Ajuda",
      links: [
        { label: "Trocas e devoluções", href: PENDING },
        { label: "Entregas e prazos", href: PENDING },
        { label: "Tabela de medidas", href: PENDING },
        { label: "Perguntas frequentes", href: PENDING },
        { label: "Contato", href: routes.contato },
      ],
    },
    {
      title: "Institucional",
      links: [
        { label: "Sobre a Essence", href: routes.sobre },
        { label: "Nossa história", href: PENDING },
        { label: "Lojas físicas", href: PENDING },
        { label: "Trabalhe conosco", href: PENDING },
      ],
    },
  ] satisfies FooterLinkGroup[],

  /** PLACEHOLDER: dados de contato fictícios, troque pelos reais. */
  contato: {
    titulo: "Contato",
    endereco: ["Rua Exemplo, 123 — Centro", "São Paulo — SP"],
    email: contato.email,
    telefone: "(11) 99999-9999",
    whatsapp: `https://wa.me/${contato.whatsapp}`,
    horario: "Seg a sex, 9h às 18h",
  },

  /** PLACEHOLDER: formas de pagamento exibidas como selos monocromáticos. */
  pagamentos: ["Pix", "Visa", "Mastercard", "Elo", "Boleto"],

  legal: [
    { label: "Política de Privacidade", href: PENDING },
    { label: "Termos de Uso", href: PENDING },
  ] satisfies FooterLink[],

  creditos: {
    prefixo: "Desenvolvido por",
    nome: "MaiaWall",
    href: "https://maiawall.com",
  },
} as const;
