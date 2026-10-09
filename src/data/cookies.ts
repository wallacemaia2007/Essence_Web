export type CookieCategoryLabel =
  | "Necessários"
  | "Preferências"
  | "Estatísticas"
  | "Marketing";

export type CookieInventoryItem = {
  name: string;
  purpose: string;
  category: CookieCategoryLabel;
  duration: string;
};

// TODO: confirmar com o que realmente é usado e com as configurações de produção, hospedagem e provedores externos.
export const cookieInventory: readonly CookieInventoryItem[] = [
  {
    name: "essence_consent · localStorage",
    purpose:
      "Guarda a versão, a data e as categorias escolhidas para o consentimento neste navegador.",
    category: "Necessários",
    duration: "Persistente até ser removido; uma nova versão solicita nova escolha.",
  },
  {
    name: "essence:carrinho · localStorage",
    purpose: "Mantém os itens da sacola enquanto você navega pelo site.",
    category: "Necessários",
    duration: "Até ser removido pelo usuário ou pelo navegador.",
  },
  {
    name: "essence:checkout-cep · sessionStorage",
    purpose: "Lembra temporariamente o CEP informado durante o fluxo demonstrativo.",
    category: "Necessários",
    duration: "Até o encerramento da sessão da aba.",
  },
  {
    name: "essence:checkout-orders · sessionStorage",
    purpose:
      "Mantém os pedidos de demonstração criados nesta aba; não armazena dados de cartão.",
    category: "Necessários",
    duration: "Até o encerramento da sessão da aba.",
  },
  {
    name: "essence:favoritos · localStorage",
    purpose: "Mantém a lista de produtos favoritos neste navegador.",
    category: "Preferências",
    duration: "Até ser removido pelo usuário ou pelo navegador.",
  },
  {
    name: "theme · localStorage (next-themes)",
    purpose:
      "Pode guardar a preferência de aparência do site quando a funcionalidade de tema é usada.",
    category: "Preferências",
    duration: "Até ser removido pelo usuário ou pelo navegador; confirmar uso efetivo.",
  },
  {
    name: "essence:demo-auth-session · localStorage",
    purpose: "Mantém a sessão de conta demonstrativa neste navegador.",
    category: "Necessários",
    duration: "Removido ao sair da conta; confirmar retenção em produção.",
  },
  {
    name: "essence:demo-auth-accounts · localStorage",
    purpose:
      "Mantém dados de perfil usados apenas pela demonstração de cadastro e login.",
    category: "Necessários",
    duration: "Até ser removido pelo usuário ou pelo navegador; confirmar retenção.",
  },
  {
    name: "essence-demo-verified-emails · localStorage",
    purpose: "Registra localmente os e-mails confirmados no fluxo demonstrativo.",
    category: "Necessários",
    duration: "Até ser removido pelo usuário ou pelo navegador.",
  },
  {
    name: "essence:demo-auth-pending-registration:<email> · sessionStorage",
    purpose: "Mantém temporariamente nome e e-mail durante o cadastro demonstrativo.",
    category: "Necessários",
    duration: "Até o encerramento da sessão da aba.",
  },
  {
    name: "Google Maps incorporado · provedor externo",
    purpose:
      "Exibe o mapa da loja somente após autorização da categoria Preferências; nomes de cookies são definidos pelo provedor.",
    category: "Preferências",
    duration: "Variável conforme o Google; confirmar nomes e prazos aplicáveis.",
  },
  {
    name: "Instagram/Meta · mídia externa dos Reels",
    purpose:
      "Busca Reels e miniaturas somente após autorização da categoria Marketing; cookies e identificadores dependem do provedor.",
    category: "Marketing",
    duration: "Variável conforme a Meta; confirmar nomes e prazos aplicáveis.",
  },
  {
    name: "Identificadores de estatísticas · fornecedor a confirmar",
    purpose:
      "Medição de navegação caso haja ferramenta ativa no ambiente de produção ou na hospedagem.",
    category: "Estatísticas",
    duration: "A confirmar com a ferramenta e a configuração realmente utilizadas.",
  },
];
