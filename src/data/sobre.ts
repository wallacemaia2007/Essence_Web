export type SobreMetrica = {
  chave: "anos" | "pecas" | "clientes";
  valor: number | null;
  placeholder: string;
  rotulo: string;
};

/** Substituir `null` pelo número confirmado para ativar a contagem GSAP. */
export const sobreMetricas: readonly SobreMetrica[] = [
  {
    chave: "anos",
    valor: null,
    placeholder: "[ANOS]",
    rotulo: "anos de história",
  },
  {
    chave: "pecas",
    valor: null,
    placeholder: "[PEÇAS]",
    rotulo: "peças na curadoria",
  },
  {
    chave: "clientes",
    valor: null,
    placeholder: "[CLIENTES]",
    rotulo: "clientes atendidas",
  },
] as const;

export const historiaSobre = {
  eyebrow: "Uma escolha em cada detalhe",
  titulo: "Moda para viver do seu jeito.",
  paragrafos: [
    "A Essence reúne roupas e acessórios escolhidos para acompanhar diferentes momentos, com atenção ao caimento, à versatilidade e aos detalhes que fazem uma peça ter a sua cara.",
    "Entre novidades, combinações e atendimento próximo, a proposta é tornar cada descoberta mais leve — seja na loja física, em Passos, ou na vitrine online.",
  ],
} as const;

export const valoresSobre = [
  {
    numero: "01",
    titulo: "Curadoria",
    descricao:
      "Peças escolhidas com intenção, para que cada look encontre o equilíbrio entre estilo e conforto.",
  },
  {
    numero: "02",
    titulo: "Acolhimento",
    descricao:
      "Um atendimento próximo, com tempo para experimentar, combinar e descobrir sem pressa.",
  },
  {
    numero: "03",
    titulo: "Expressão",
    descricao:
      "Acreditamos que vestir-se é um jeito pessoal de mostrar ao mundo quem você é.",
  },
] as const;
