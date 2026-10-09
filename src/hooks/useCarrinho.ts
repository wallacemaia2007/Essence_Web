"use client";

import { useSyncExternalStore } from "react";

import { produtosVitrine } from "@/data/vitrine";

export type ItemCarrinho = {
  produtoId: string;
  tamanho: string;
  quantidade: number;
};

const STORAGE_KEY = "essence:carrinho";
const VAZIO: readonly ItemCarrinho[] = [];
const idsValidos = new Set(produtosVitrine.map((produto) => produto.id));
const ouvintes = new Set<() => void>();

let cache: readonly ItemCarrinho[] | null = null;

function lerDoArmazenamento(): readonly ItemCarrinho[] {
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    const dados: unknown = bruto ? JSON.parse(bruto) : [];

    if (!Array.isArray(dados)) return VAZIO;

    const itens = dados.filter(
      (item): item is ItemCarrinho =>
        typeof item === "object" &&
        item !== null &&
        "produtoId" in item &&
        typeof item.produtoId === "string" &&
        idsValidos.has(item.produtoId) &&
        "tamanho" in item &&
        typeof item.tamanho === "string" &&
        item.tamanho.length > 0 &&
        "quantidade" in item &&
        typeof item.quantidade === "number" &&
        Number.isInteger(item.quantidade) &&
        item.quantidade >= 1 &&
        item.quantidade <= 99,
    );

    const unicos = new Map<string, ItemCarrinho>();
    for (const item of itens) {
      unicos.set(chaveDoItem(item.produtoId, item.tamanho), item);
    }
    return [...unicos.values()];
  } catch {
    return VAZIO;
  }
}

function chaveDoItem(produtoId: string, tamanho: string) {
  return `${produtoId}::${tamanho}`;
}

function obterSnapshot(): readonly ItemCarrinho[] {
  if (cache === null) cache = lerDoArmazenamento();
  return cache;
}

function obterSnapshotDoServidor(): readonly ItemCarrinho[] {
  return VAZIO;
}

function persistir(proximo: readonly ItemCarrinho[]) {
  cache = proximo;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proximo));
  } catch {
    // O carrinho continua disponível em memória se o armazenamento estiver bloqueado.
  }
  ouvintes.forEach((ouvinte) => ouvinte());
}

function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key !== null && evento.key !== STORAGE_KEY) return;
  cache = null;
  ouvintes.forEach((ouvinte) => ouvinte());
}

function assinar(ouvinte: () => void) {
  if (ouvintes.size === 0) {
    window.addEventListener("storage", aoMudarEmOutraAba);
  }
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    if (ouvintes.size === 0) {
      window.removeEventListener("storage", aoMudarEmOutraAba);
    }
  };
}

function assinarSemEventos() {
  return () => {};
}

export function adicionarAoCarrinho(produtoId: string, tamanho: string) {
  if (!idsValidos.has(produtoId) || !tamanho.trim()) return;

  const atual = obterSnapshot();
  const chave = chaveDoItem(produtoId, tamanho);
  const existente = atual.find(
    (item) => chaveDoItem(item.produtoId, item.tamanho) === chave,
  );

  persistir(
    existente
      ? atual.map((item) =>
          chaveDoItem(item.produtoId, item.tamanho) === chave
            ? { ...item, quantidade: Math.min(99, item.quantidade + 1) }
            : item,
        )
      : [...atual, { produtoId, tamanho, quantidade: 1 }],
  );
}

export function alterarQuantidade(
  produtoId: string,
  tamanho: string,
  quantidade: number,
) {
  const chave = chaveDoItem(produtoId, tamanho);
  const proximaQuantidade = Math.max(1, Math.min(99, Math.floor(quantidade)));
  persistir(
    obterSnapshot().map((item) =>
      chaveDoItem(item.produtoId, item.tamanho) === chave
        ? { ...item, quantidade: proximaQuantidade }
        : item,
    ),
  );
}

export function alterarTamanho(
  produtoId: string,
  tamanhoAtual: string,
  tamanhoNovo: string,
) {
  if (!tamanhoNovo.trim() || tamanhoAtual === tamanhoNovo) return;

  const atual = obterSnapshot();
  const itemAtual = atual.find(
    (item) => item.produtoId === produtoId && item.tamanho === tamanhoAtual,
  );
  if (!itemAtual) return;

  const itemMesmoTamanho = atual.find(
    (item) => item.produtoId === produtoId && item.tamanho === tamanhoNovo,
  );

  persistir(
    itemMesmoTamanho
      ? atual
          .filter((item) => item !== itemAtual)
          .map((item) =>
            item === itemMesmoTamanho
              ? {
                  ...item,
                  quantidade: Math.min(
                    99,
                    item.quantidade + itemAtual.quantidade,
                  ),
                }
              : item,
          )
      : atual.map((item) =>
          item === itemAtual ? { ...item, tamanho: tamanhoNovo } : item,
        ),
  );
}

export function removerDoCarrinho(produtoId: string, tamanho: string) {
  const chave = chaveDoItem(produtoId, tamanho);
  persistir(
    obterSnapshot().filter(
      (item) => chaveDoItem(item.produtoId, item.tamanho) !== chave,
    ),
  );
}

/** Limpa a sacola após a criação bem-sucedida do pedido demonstrativo. */
export function limparCarrinho() {
  persistir(VAZIO);
}

export function useCarrinho() {
  const itens = useSyncExternalStore(
    assinar,
    obterSnapshot,
    obterSnapshotDoServidor,
  );
  const hidratado = useSyncExternalStore(
    assinarSemEventos,
    () => true,
    () => false,
  );
  return {
    itens,
    quantidadeTotal: itens.reduce((total, item) => total + item.quantidade, 0),
    hidratado,
    adicionar: adicionarAoCarrinho,
    alterar: alterarQuantidade,
    alterarTamanho,
    remover: removerDoCarrinho,
    limpar: limparCarrinho,
  };
}
