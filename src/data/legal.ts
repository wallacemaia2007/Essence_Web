export type LegalSubsection = {
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  subsections?: readonly LegalSubsection[];
};

export type LegalDocument = {
  title: string;
  eyebrow: string;
  description: string;
  updatedAt: string;
  updatedIso: string;
  contactPrompt: string;
  sections: readonly LegalSection[];
};

const enderecoLoja =
  "Avenida Comendador Francisco Avelino Maia, 3014, Passos, Minas Gerais.";
const updatedAt = "6 de outubro de 2026";
const updatedIso = "2026-10-06";

/**
 * Rascunhos informativos elaborados conforme os fluxos atualmente presentes no
 * repositório. Antes da publicação definitiva, confirmar a razão social/nome do
 * controlador, o canal de privacidade e os prazos reais de retenção.
 */
export const politicaPrivacidade: LegalDocument = {
  title: "Política de Privacidade",
  eyebrow: "Privacidade e proteção de dados",
  description:
    "Este documento explica quais informações podem ser tratadas quando você navega pelo site da Essence ou entra em contato com a loja.",
  updatedAt,
  updatedIso,
  contactPrompt:
    "Para dúvidas sobre este aviso ou solicitações relacionadas aos seus dados pessoais, fale com a loja pelos canais oficiais.",
  sections: [
    {
      id: "escopo",
      title: "Escopo e aplicação",
      paragraphs: [
        "Esta Política de Privacidade se aplica ao site da Essence, à vitrine de produtos e aos contatos iniciados por meio dos canais apresentados neste site. Ela não substitui os avisos de privacidade de serviços externos que você escolha acessar, como Gmail, WhatsApp, Instagram ou Facebook.",
        "Ao navegar ou iniciar um contato, leia este documento para entender como as informações relacionadas à sua interação podem ser utilizadas. Se não concordar com estas condições, você pode deixar de usar o site e os formulários.",
      ],
    },
    {
      id: "responsavel",
      title: "Responsável pelo tratamento",
      paragraphs: [
        `O site identifica a loja pela marca Essence, com endereço físico em ${enderecoLoja}`,
        "A identificação empresarial completa do controlador e um canal dedicado de privacidade devem ser confirmados pela loja e mantidos atualizados. Para solicitações, use a página de Contato ou os canais oficiais indicados no rodapé.",
      ],
    },
    {
      id: "dados-tratados",
      title: "Dados que podem ser tratados",
      subsections: [
        {
          title: "Informações fornecidas em contato",
          paragraphs: [
            "O formulário de contato solicita nome, e-mail, assunto e mensagem; o telefone é opcional. No fluxo atualmente implementado, o site prepara uma mensagem no Gmail para você revisar e decidir se deseja enviar. O formulário não grava a mensagem em uma base própria do site.",
          ],
        },
        {
          title: "Newsletter",
          paragraphs: [
            "O campo de newsletter exibido no rodapé ainda não está conectado a um serviço de mailing. Na implementação atual, a inscrição é apenas simulada: o endereço informado não é incluído em uma lista nem salvo por esse recurso.",
          ],
        },
        {
          title: "Informações técnicas",
          paragraphs: [
            "A infraestrutura de hospedagem pode processar registros técnicos de acesso para entregar e proteger o site. A rota de contato também pode usar temporariamente o endereço IP recebido para limitar tentativas automatizadas. Esses dados técnicos não são exibidos na vitrine de produtos.",
          ],
        },
      ],
    },
    {
      id: "finalidades",
      title: "Finalidades do tratamento",
      paragraphs: [
        "Quando informações pessoais são efetivamente recebidas, elas podem ser utilizadas somente na medida necessária para as finalidades relacionadas à sua interação com a loja, como:",
      ],
      bullets: [
        "responder a uma dúvida, solicitação ou mensagem enviada por você;",
        "dar andamento a uma consulta sobre produtos ou atendimento;",
        "manter, proteger e corrigir o funcionamento do site, inclusive reduzindo abuso automatizado;",
        "cumprir obrigações legais ou atender solicitações válidas de autoridades competentes.",
      ],
    },
    {
      id: "bases-legais",
      title: "Bases legais",
      paragraphs: [
        "A base legal aplicável depende do contexto e da finalidade. Quando pertinente, o tratamento poderá se apoiar em procedimentos preliminares solicitados pelo titular, no cumprimento de obrigação legal ou regulatória, no exercício regular de direitos, no legítimo interesse avaliado para a situação concreta ou no consentimento, quando exigido pela legislação.",
        "Esta página não autoriza o uso dos dados para finalidades incompatíveis com aquelas informadas no momento da coleta.",
      ],
    },
    {
      id: "compartilhamento",
      title: "Compartilhamento de informações",
      paragraphs: [
        "O site não oferece venda de dados pessoais. Informações podem ser tratadas por prestadores técnicos estritamente necessários ao funcionamento da página ou ao encaminhamento de uma comunicação. Se você optar por enviar uma mensagem pelo Gmail ou acessar WhatsApp, Instagram ou Facebook, o respectivo serviço poderá tratar dados conforme seus próprios termos e avisos de privacidade.",
        "O compartilhamento também poderá ocorrer quando necessário para cumprir a lei, responder a uma ordem válida ou proteger direitos e a segurança de pessoas e serviços.",
      ],
    },
    {
      id: "retencao-seguranca",
      title: "Armazenamento e segurança",
      paragraphs: [
        "A implementação atual não mantém uma base própria de mensagens do formulário ou de inscrições da newsletter. Se você enviar uma mensagem por um serviço de e-mail, ela poderá permanecer nas caixas de entrada e sistemas desse serviço e da loja pelo tempo definido por esses provedores e pela loja.",
        "Os registros técnicos são mantidos conforme a configuração e os prazos da infraestrutura utilizada. Nenhuma transmissão ou armazenamento conectado à internet é isento de riscos; a loja deve adotar medidas adequadas à natureza dos dados e rever os controles dos serviços que utilizar.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies e armazenamento no navegador",
      paragraphs: [
        "O código atualmente revisado não configura pixels publicitários nem uma ferramenta de analytics de terceiros. O recurso de tema do site pode guardar localmente no navegador a preferência de aparência. A hospedagem também pode utilizar recursos técnicos necessários à entrega e segurança da página.",
        "Se forem adicionados cookies de publicidade, medição ou outros recursos de terceiros, este aviso deverá ser atualizado e, quando necessário, será solicitado consentimento antes de ativá-los.",
      ],
    },
    {
      id: "direitos",
      title: "Seus direitos como titular",
      paragraphs: [
        "Nos termos da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), você pode solicitar, conforme aplicável:",
      ],
      bullets: [
        "confirmação da existência de tratamento e acesso aos dados;",
        "correção de dados incompletos, inexatos ou desatualizados;",
        "anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;",
        "informações sobre compartilhamentos e sobre a possibilidade de não fornecer consentimento;",
        "portabilidade e eliminação de dados tratados com consentimento, observadas as regras e exceções legais;",
        "revogação do consentimento ou oposição ao tratamento, quando cabível.",
      ],
    },
    {
      id: "servicos-externos",
      title: "Links e serviços externos",
      paragraphs: [
        "O site pode direcionar você para páginas de redes sociais, mapas, e-mail ou outros serviços que não são operados pela Essence. Ao sair do site, o tratamento de dados passa a seguir também as regras do serviço acessado. Consulte os avisos desses provedores antes de compartilhar informações com eles.",
      ],
    },
    {
      id: "alteracoes",
      title: "Alterações desta política",
      paragraphs: [
        "Esta política pode ser atualizada quando o site, os canais de atendimento ou as práticas de tratamento forem alterados. A data no início do documento indica a revisão mais recente. Mudanças relevantes devem ser comunicadas de forma apropriada aos titulares afetados.",
      ],
    },
    {
      id: "contato-privacidade",
      title: "Dúvidas e solicitações",
      paragraphs: [
        "Para exercer seus direitos ou esclarecer uma dúvida de privacidade, acesse a página de Contato ou use o WhatsApp divulgado nos canais oficiais da loja. Para sua segurança, envie somente as informações necessárias para que a solicitação seja compreendida e atendida.",
      ],
    },
  ],
};

export const termosDeUso: LegalDocument = {
  title: "Termos de Uso",
  eyebrow: "Condições de navegação",
  description:
    "Estes termos explicam as condições básicas para navegar pelo site e consultar a vitrine da Essence.",
  updatedAt,
  updatedIso,
  contactPrompt:
    "Se tiver dúvidas sobre estes termos, consulte a loja antes de tomar uma decisão de compra.",
  sections: [
    {
      id: "aceitacao",
      title: "Escopo e aceitação",
      paragraphs: [
        "Estes Termos de Uso se aplicam ao acesso e à navegação pelo site da Essence. Ao utilizar as páginas, você declara que leu estas condições. Se não concordar com elas, interrompa o uso do site.",
        "Estes termos devem ser interpretados em conjunto com a Política de Privacidade e não afastam direitos assegurados pela legislação brasileira, inclusive as normas de proteção ao consumidor.",
      ],
    },
    {
      id: "funcionalidades",
      title: "O que o site oferece",
      paragraphs: [
        "O site apresenta informações institucionais, canais de contato, localização da loja física e uma vitrine de produtos e coleções. Na versão atual, não há checkout para concluir compras nem processamento de pagamento diretamente pelo site.",
        "A navegação, o envio de uma mensagem ou a visualização de um produto, por si só, não confirmam pedido, reserva ou disponibilidade de estoque.",
      ],
    },
    {
      id: "produtos",
      title: "Produtos, imagens e informações",
      paragraphs: [
        "A loja procura manter as informações da vitrine claras e atualizadas, mas nomes, descrições, imagens, cores, tamanhos, preços e disponibilidade podem mudar. A exibição de uma peça não garante que ela esteja em estoque ou disponível em determinada condição.",
        "Antes de se deslocar à loja ou concluir uma compra por um canal de atendimento, confirme diretamente com a equipe as características, o preço vigente e a disponibilidade do produto.",
      ],
    },
    {
      id: "compras",
      title: "Compras, pagamentos e atendimento",
      paragraphs: [
        "Como o site não conclui transações, condições de pagamento, entrega, retirada, troca ou cancelamento são informadas pela loja no atendimento e no momento da contratação. A aplicação dessas condições deve respeitar os direitos previstos em lei e as regras específicas comunicadas para cada operação.",
        "Não envie dados completos de cartão, senhas ou códigos de autenticação por formulários, e-mail ou mensagens em redes sociais.",
      ],
    },
    {
      id: "uso-adequado",
      title: "Uso adequado do site",
      paragraphs: [
        "Você se compromete a usar o site de forma lícita e a não tentar comprometer sua disponibilidade, segurança ou funcionamento. Ao utilizar os canais de contato, forneça informações verdadeiras e não envie conteúdo ilegal, abusivo ou que viole direitos de terceiros.",
        "O acesso poderá ser limitado temporariamente quando necessário para proteger o site, seus usuários ou a loja contra abuso, falhas ou ameaças de segurança.",
      ],
    },
    {
      id: "propriedade-intelectual",
      title: "Conteúdo e propriedade intelectual",
      paragraphs: [
        "Marcas, logotipos, textos, elementos visuais, fotografias e demais conteúdos do site pertencem à Essence ou são utilizados com autorização de seus respectivos titulares. A navegação não concede licença para reproduzir, distribuir ou explorar comercialmente esse conteúdo.",
        "Para solicitar autorização de uso de conteúdo, entre em contato com a loja. Direitos que a legislação não permita limitar permanecem preservados.",
      ],
    },
    {
      id: "links-externos",
      title: "Links e plataformas de terceiros",
      paragraphs: [
        "O site pode conter links para serviços externos, como WhatsApp, Instagram, Facebook e mapas. Esses serviços têm operação e regras próprias. A Essence não controla a disponibilidade nem as práticas de privacidade e segurança das plataformas de terceiros.",
      ],
    },
    {
      id: "privacidade",
      title: "Privacidade e dados pessoais",
      paragraphs: [
        "O tratamento de dados relacionados à navegação e ao contato é explicado na Política de Privacidade. Leia esse documento antes de enviar informações pessoais. O formulário de contato prepara uma mensagem para revisão e envio por e-mail; o usuário decide se conclui o envio.",
      ],
    },
    {
      id: "disponibilidade-alteracoes",
      title: "Disponibilidade e alterações",
      paragraphs: [
        "A loja pode corrigir, atualizar ou reorganizar o site e seu conteúdo. Embora sejam adotados esforços para manter as páginas acessíveis, podem ocorrer interrupções para manutenção, falhas técnicas ou motivos de segurança.",
        "Estes termos podem ser revisados quando o serviço mudar. A versão vigente será a publicada nesta página, acompanhada da data de atualização.",
      ],
    },
    {
      id: "legislacao-contato",
      title: "Legislação aplicável e contato",
      paragraphs: [
        "Estes termos são regidos pelas leis brasileiras, sem prejuízo de normas obrigatórias de proteção ao consumidor e das regras legais de competência aplicáveis a cada caso.",
        `A loja física Essence está localizada em ${enderecoLoja} Para dúvidas, acesse a página de Contato ou os canais oficiais divulgados no rodapé do site.`,
      ],
    },
  ],
};
