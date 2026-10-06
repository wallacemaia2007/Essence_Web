"use client";

import { useCallback, useSyncExternalStore } from "react";

import { produtosVitrine } from "@/data/vitrine";

/**
 * Favoritos guardados no navegador (localStorage), sem login.
 * Guarda só os ids das peças, do mais antigo para o mais recente.
 * O estado é compartilhado entre todos os componentes e entre abas.
 */
const STORAGE_KEY = "essence:favoritos";
const VAZIO: readonly string[] = [];
const idsValidos = new Set(produtosVitrine.map((produto) => produto.id));
const ouvintes = new Set<() => void>();

let cache: readonly string[] | null = null;

function lerDoArmazenamento(): readonly string[] {
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    const dados: unknown = bruto ? JSON.parse(bruto) : [];

    if (!Array.isArray(dados)) {
      return VAZIO;
    }

    // Ignora ids repetidos e peças que não existem mais no catálogo.
    const ids = dados.filter(
      (id): id is string => typeof id === "string" && idsValidos.has(id),
    );

    return [...new Set(ids)];
  } catch {
    return VAZIO;
  }
}

function obterSnapshot(): readonly string[] {
  if (cache === null) {
    cache = lerDoArmazenamento();
  }

  return cache;
}

function obterSnapshotDoServidor(): readonly string[] {
  return VAZIO;
}

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function persistir(proximo: readonly string[]) {
  cache = proximo;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proximo));
  } catch {
    // Armazenamento bloqueado (modo privado, cota cheia): segue só em memória.
  }

  notificar();
}

function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key !== null && evento.key !== STORAGE_KEY) {
    return;
  }

  cache = null;
  notificar();
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

export function useFavoritos() {
  const ids = useSyncExternalStore(
    assinar,
    obterSnapshot,
    obterSnapshotDoServidor,
  );
  // Falso no servidor e na primeira renderização; verdadeiro após hidratar.
  // Evita mostrar "lista vazia" por um instante antes de ler o armazenamento.
  const hidratado = useSyncExternalStore(
    assinarSemEventos,
    () => true,
    () => false,
  );

  /** Adiciona ou remove a peça. Retorna `true` se ela passou a ser favorita. */
  const alternar = useCallback((id: string) => {
    const atual = obterSnapshot();
    const jaFavorita = atual.includes(id);

    persistir(
      jaFavorita ? atual.filter((item) => item !== id) : [...atual, id],
    );

    return !jaFavorita;
  }, []);

  return { ids, total: ids.length, hidratado, alternar };
}
