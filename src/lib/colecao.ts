import { conjuntosData } from "@/data/conjuntos";

export function slugificarColecao(valor: string) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Caminho da página da coleção a partir do nome exibido no produto. */
export function caminhoDaColecao(nome: string) {
  const conjunto = conjuntosData.itens.find(
    (item) => item.id === slugificarColecao(nome),
  );

  return conjunto?.href ?? (conjunto ? `/colecao/${conjunto.id}` : undefined);
}
