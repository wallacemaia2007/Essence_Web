export type TestimonialRating = 1 | 2 | 3 | 4 | 5;

export type TestimonialType = "texto" | "print";

export type Testimonial = {
  id: string;
  nome: string;
  cidade: string;
  nota: TestimonialRating;
  texto: string;
  /** Foto de perfil (tipo "texto") ou captura de conversa (tipo "print"). */
  foto?: string;
  tipo: TestimonialType;
  published: boolean;
};

export type RatingSummary = {
  notaMedia: number;
  quantidade: number;
};

// TODO: substituir por depoimentos reais, com autorização escrita das clientes.
export const testimonials: readonly Testimonial[] = [
  {
    id: "exemplo-depoimento-texto",
    nome: "Nome da cliente",
    cidade: "Cidade",
    nota: 5,
    texto: "Exemplo de depoimento. Substituir por texto real autorizado.",
    tipo: "texto",
    published: true,
  },
  {
    id: "exemplo-depoimento-print",
    nome: "Nome da cliente",
    cidade: "Cidade",
    nota: 5,
    texto: "Exemplo de depoimento. Substituir por texto real autorizado.",
    tipo: "print",
    published: true,
  },
  {
    id: "exemplo-depoimento-texto1",
    nome: "Nome da cliente",
    cidade: "Cidade",
    nota: 5,
    texto: "Exemplo de depoimento. Substituir por texto real autorizado.",
    tipo: "texto",
    published: true,
  },
  {
    id: "exemplo-depoimento-print2",
    nome: "Nome da cliente",
    cidade: "Cidade",
    nota: 5,
    texto: "Exemplo de depoimento. Substituir por texto real autorizado.",
    tipo: "print",
    published: true,
  }
];

// TODO: preencher somente com dados agregados reais e verificáveis.
export const ratingSummary: RatingSummary | undefined = undefined;
