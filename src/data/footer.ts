import { anchors, routes } from "@/constants/routes";
import { conjuntosData } from "@/data/conjuntos";
import { contato } from "@/data/contato";
import { localizacaoLoja } from "@/data/localizacao";
import { testimonials } from "@/data/testimonials";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = {
  title: string;
  links: readonly FooterLink[];
};

const whatsappHref = `https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`;

function formatarTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  const numeroLocal = digitos.startsWith("55") ? digitos.slice(2) : digitos;

  if (numeroLocal.length === 11) {
    return `(${numeroLocal.slice(0, 2)}) ${numeroLocal.slice(2, 7)}-${numeroLocal.slice(7)}`;
  }

  if (numeroLocal.length === 10) {
    return `(${numeroLocal.slice(0, 2)}) ${numeroLocal.slice(2, 6)}-${numeroLocal.slice(6)}`;
  }

  return telefone;
}

export const footerData = {
  marca: "Essence",
  localidade: "Passos",
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
      title: "Navegue",
      links: [
        { label: "Novidades", href: anchors.novidades },
        { label: "Vitrine", href: anchors.vitrine },
        { label: "Catálogo completo", href: routes.colecao },
        { label: "Outlet", href: routes.outlet },
        { label: "Conjuntos", href: routes.conjuntos },
        ...(testimonials.some((item) => item.published)
          ? [{ label: "Depoimentos", href: anchors.depoimentos }]
          : []),
        { label: "Instagram", href: anchors.instagram },
      ],
    },
    {
      title: "Conjuntos",
      links: conjuntosData.itens.map((conjunto) => ({
        label: conjunto.titulo,
        href: conjunto.href ?? `${routes.colecao}/${conjunto.id}`,
      })),
    },
    {
      title: "Atendimento",
      links: [
        { label: "Dúvidas frequentes", href: anchors.faq },
        { label: "Guia de tamanhos", href: routes.guiaTamanhos },
        { label: "Trocas e devoluções", href: routes.trocasDevolucoes },
        { label: "Entrega e frete", href: routes.entregaFrete },
        { label: "Meus pedidos", href: routes.pedidos },
        { label: "Fale com a loja", href: routes.contato },
        { label: "Clube da Essence", href: routes.clube },
        {
          label: "Atendimento personalizado",
          href: routes.atendimentoPersonalizado,
        },
        { label: "WhatsApp", href: whatsappHref, external: true },
      ],
    },
    {
      title: "Institucional",
      links: [
        { label: "Sobre a Essence", href: routes.sobre },
        { label: "Loja física em Passos", href: anchors.localizacao },
        { label: "Política de Privacidade", href: routes.politicaPrivacidade },
        { label: "Termos de Uso", href: routes.termosUso },
        { label: "Política de Cookies", href: routes.politicaCookies },
      ],
    },
  ] satisfies FooterLinkGroup[],

  /** O endereço e o telefone usam os dados de localização e WhatsApp cadastrados. */
  contato: {
    titulo: "Contato",
    endereco: localizacaoLoja.endereco,
    email: contato.email,
    telefone: formatarTelefone(contato.whatsapp),
    whatsapp: whatsappHref,
    horario: localizacaoLoja.horario,
  },

  /** PLACEHOLDER: formas de pagamento exibidas como selos monocromáticos. */
  pagamentos: ["Pix", "Visa", "Mastercard", "Elo", "Boleto"],

  legal: [
    { label: "Política de Privacidade", href: routes.politicaPrivacidade },
    { label: "Política de Cookies", href: routes.politicaCookies },
    { label: "Termos de Uso", href: routes.termosUso },
  ] satisfies FooterLink[],

  creditos: {
    prefixo: "Desenvolvido por",
    nome: "Maiawall",
    href: "https://maiawall.com",
  },
} as const;
