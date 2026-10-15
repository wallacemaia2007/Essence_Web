import { detalhesPorProduto, tamanhosPadrao } from "@/data/produto-detalhes";
import {
  type CategoriaProduto,
  CATEGORIAS_PRODUTO,
  type ProdutoVitrine,
} from "@/data/vitrine";
import { emPromocao } from "@/lib/pricing";

export type CatalogoFiltros = {
  precoMinimo: string;
  precoMaximo: string;
  categorias: CategoriaProduto[];
  colecoes: string[];
  tamanhos: string[];
  cores: string[];
  promocao: boolean;
  disponivel: boolean;
  atributos: Record<string, string[]>;
};

export type CatalogoOrdenacao =
  "recentes" | "menor-preco" | "maior-preco" | "maior-desconto";

export type CatalogoOpcao = {
  nome: string;
  quantidade: number;
};

export type CatalogoOpcaoCor = CatalogoOpcao & {
  hex: string;
};

export type CatalogoAtributo = {
  chave: string;
  rotulo: string;
  categorias: CategoriaProduto[];
  opcoes: CatalogoOpcao[];
};

const categoriaSet = new Set<string>(CATEGORIAS_PRODUTO);
const ordemTamanhos = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

export function criarFiltrosVazios(): CatalogoFiltros {
  return {
    precoMinimo: "",
    precoMaximo: "",
    categorias: [],
    colecoes: [],
    tamanhos: [],
    cores: [],
    promocao: false,
    disponivel: false,
    atributos: {},
  };
}

function parsePreco(value: string | null) {
  if (!value?.trim()) return "";
  const preco = Number(value.replace(",", "."));
  return Number.isFinite(preco) && preco >= 0 ? String(preco) : "";
}

function valoresUnicos(values: string[]) {
  return [...new Set(values)];
}

export function tamanhosDisponiveis(produto: ProdutoVitrine) {
  const tamanhos = detalhesPorProduto[produto.id]?.tamanhos ?? tamanhosPadrao;
  return tamanhos
    .filter((tamanho) => tamanho.disponivel)
    .map((tamanho) => tamanho.rotulo);
}

export function ordenarTamanhos(values: Iterable<string>) {
  return [...new Set(values)].sort((a, b) => {
    const indexA = ordemTamanhos.indexOf(a.toUpperCase());
    const indexB = ordemTamanhos.indexOf(b.toUpperCase());
    if (indexA !== -1 || indexB !== -1) {
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      if (indexA !== indexB) return indexA - indexB;
    }
    return a.localeCompare(b, "pt-BR", { numeric: true });
  });
}

export function rotuloAtributo(chave: string) {
  const rotulos: Record<string, string> = {
    comprimento: "Comprimento",
  };
  return (
    rotulos[chave] ??
    chave
      .replace(/[-_]+/g, " ")
      .replace(/\b\p{L}/gu, (letra) => letra.toLocaleUpperCase("pt-BR"))
  );
}

export function obterAtributosCatalogo(produtos: readonly ProdutoVitrine[]) {
  const grupos = new Map<
    string,
    {
      categorias: Set<CategoriaProduto>;
      opcoes: Map<string, number>;
    }
  >();

  for (const produto of produtos) {
    for (const [chave, valores] of Object.entries(produto.attributes ?? {})) {
      const grupo = grupos.get(chave) ?? {
        categorias: new Set<CategoriaProduto>(),
        opcoes: new Map<string, number>(),
      };
      grupo.categorias.add(produto.categoria);
      for (const valor of valoresUnicos(valores)) {
        grupo.opcoes.set(valor, (grupo.opcoes.get(valor) ?? 0) + 1);
      }
      grupos.set(chave, grupo);
    }
  }

  return [...grupos.entries()]
    .map(([chave, grupo]): CatalogoAtributo => ({
      chave,
      rotulo: rotuloAtributo(chave),
      categorias: [...grupo.categorias],
      opcoes: [...grupo.opcoes.entries()]
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    }))
    .sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));
}

export function parseFiltrosCatalogo(
  parametros: URLSearchParams,
  produtos: readonly ProdutoVitrine[],
): CatalogoFiltros {
  const colecoesValidas = new Set(produtos.map((produto) => produto.colecao));
  const tamanhosValidos = new Set(produtos.flatMap(tamanhosDisponiveis));
  const coresValidas = new Set(
    produtos.flatMap((produto) =>
      (produto.colors ?? []).map((cor) => cor.name),
    ),
  );
  const categorias = valoresUnicos(parametros.getAll("categoria")).filter(
    (categoria): categoria is CategoriaProduto => categoriaSet.has(categoria),
  );
  const atributosValidos = new Map<string, Set<string>>();

  for (const produto of produtos) {
    if (!categorias.includes(produto.categoria)) continue;
    for (const [chave, valores] of Object.entries(produto.attributes ?? {})) {
      const validos = atributosValidos.get(chave) ?? new Set<string>();
      valores.forEach((valor) => validos.add(valor));
      atributosValidos.set(chave, validos);
    }
  }

  const atributos: Record<string, string[]> = {};

  for (const chave of new Set([...parametros.keys()])) {
    if (!chave.startsWith("atributo.")) continue;
    const nome = chave.slice("atributo.".length);
    const opcoesValidas = atributosValidos.get(nome);
    if (!opcoesValidas) continue;
    const selecionados = valoresUnicos(parametros.getAll(chave)).filter(
      (valor) => opcoesValidas.has(valor),
    );
    if (selecionados.length > 0) atributos[nome] = selecionados;
  }

  let precoMinimo = parsePreco(parametros.get("precoMinimo"));
  let precoMaximo = parsePreco(parametros.get("precoMaximo"));
  if (precoMinimo && precoMaximo && Number(precoMinimo) > Number(precoMaximo)) {
    precoMinimo = "";
    precoMaximo = "";
  }

  return {
    precoMinimo,
    precoMaximo,
    categorias,
    colecoes: valoresUnicos(parametros.getAll("colecao")).filter((colecao) =>
      colecoesValidas.has(colecao),
    ),
    tamanhos: valoresUnicos(parametros.getAll("tamanho")).filter((tamanho) =>
      tamanhosValidos.has(tamanho),
    ),
    cores: valoresUnicos(parametros.getAll("cor")).filter((cor) =>
      coresValidas.has(cor),
    ),
    promocao: parametros.get("promocao") === "1",
    disponivel: parametros.get("disponivel") === "1",
    atributos,
  };
}

export function parseOrdenacaoCatalogo(
  value: string | null,
  isOutlet: boolean,
): CatalogoOrdenacao {
  const valores: CatalogoOrdenacao[] = [
    "recentes",
    "menor-preco",
    "maior-preco",
    "maior-desconto",
  ];
  if (value && valores.includes(value as CatalogoOrdenacao)) {
    return value as CatalogoOrdenacao;
  }
  return isOutlet ? "maior-desconto" : "recentes";
}

export function contarFiltrosAtivos(filtros: CatalogoFiltros) {
  return (
    Number(Boolean(filtros.precoMinimo || filtros.precoMaximo)) +
    filtros.categorias.length +
    filtros.colecoes.length +
    filtros.tamanhos.length +
    filtros.cores.length +
    Number(filtros.promocao) +
    Number(filtros.disponivel) +
    Object.values(filtros.atributos).reduce(
      (total, valores) => total + valores.length,
      0,
    )
  );
}

function normalizarTexto(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function precoNumerico(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function filtrarProdutosCatalogo(
  produtos: readonly ProdutoVitrine[],
  busca: string,
  filtros: CatalogoFiltros,
) {
  const termo = normalizarTexto(busca);
  const precoMinimo = precoNumerico(filtros.precoMinimo);
  const precoMaximo = precoNumerico(filtros.precoMaximo);

  return produtos.filter((produto) => {
    const combinaBusca =
      !termo ||
      [produto.nome, produto.categoria, produto.colecao].some((texto) =>
        normalizarTexto(texto).includes(termo),
      );
    if (!combinaBusca) return false;

    if (
      filtros.categorias.length > 0 &&
      !filtros.categorias.includes(produto.categoria)
    ) {
      return false;
    }
    if (
      filtros.colecoes.length > 0 &&
      !filtros.colecoes.includes(produto.colecao)
    ) {
      return false;
    }
    if (
      filtros.tamanhos.length > 0 &&
      !tamanhosDisponiveis(produto).some((tamanho) =>
        filtros.tamanhos.includes(tamanho),
      )
    ) {
      return false;
    }
    if (
      filtros.cores.length > 0 &&
      !(produto.colors ?? []).some((cor) => filtros.cores.includes(cor.name))
    ) {
      return false;
    }
    if (filtros.promocao && !emPromocao(produto)) return false;
    if (
      filtros.disponivel &&
      produto.stock !== "ok" &&
      produto.stock !== "low"
    ) {
      return false;
    }

    for (const [chave, selecionados] of Object.entries(filtros.atributos)) {
      if (
        selecionados.length > 0 &&
        !(produto.attributes?.[chave] ?? []).some((valor) =>
          selecionados.includes(valor),
        )
      ) {
        return false;
      }
    }

    if (precoMinimo !== null || precoMaximo !== null) {
      if (produto.preco == null) return false;
      if (precoMinimo !== null && produto.preco < precoMinimo) return false;
      if (precoMaximo !== null && produto.preco > precoMaximo) return false;
    }

    return true;
  });
}
