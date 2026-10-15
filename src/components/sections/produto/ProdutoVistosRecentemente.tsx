"use client";

import { useEffect, useSyncExternalStore } from "react";

import { ProdutoColecaoCard } from "@/components/sections/colecao/ProdutoColecaoCard";
import { produtosVitrine } from "@/data/vitrine";

const CHAVE_VISTOS = "essence:produtos-vistos";
const produtosPorId = new Map(
  produtosVitrine.map((produto) => [produto.id, produto]),
);
const VAZIO: readonly string[] = [];
const ouvintes = new Set<() => void>();
let cache: readonly string[] | null = null;

function lerDoArmazenamento(): readonly string[] {
  if (typeof window === "undefined") return VAZIO;

  try {
    const valor: unknown = JSON.parse(
      window.localStorage.getItem(CHAVE_VISTOS) ?? "[]",
    );
    if (!Array.isArray(valor)) return VAZIO;
    return [
      ...new Set(
        valor.filter(
          (id): id is string => typeof id === "string" && produtosPorId.has(id),
        ),
      ),
    ];
  } catch {
    return VAZIO;
  }
}

function obterSnapshot(): readonly string[] {
  if (cache === null) cache = lerDoArmazenamento();
  return cache;
}

function obterSnapshotDoServidor(): readonly string[] {
  return VAZIO;
}

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function aoMudarEmOutraAba(evento: StorageEvent) {
  if (evento.key !== null && evento.key !== CHAVE_VISTOS) return;
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

function persistirIds(ids: readonly string[]) {
  cache = ids;
  try {
    window.localStorage.setItem(CHAVE_VISTOS, JSON.stringify(ids));
  } catch {
    // A seção continua funcionando durante a sessão se o armazenamento estiver bloqueado.
  }
  notificar();
}

export function ProdutoVistosRecentemente({
  produtoAtualId,
}: {
  produtoAtualId: string;
}) {
  const ids = useSyncExternalStore(
    assinar,
    obterSnapshot,
    obterSnapshotDoServidor,
  );

  useEffect(() => {
    if (!produtosPorId.has(produtoAtualId)) return;
    const anteriores = obterSnapshot().filter((id) => id !== produtoAtualId);
    persistirIds([produtoAtualId, ...anteriores].slice(0, 8));
  }, [produtoAtualId]);

  const produtosRecentes = ids
    .filter((id) => id !== produtoAtualId)
    .slice(0, 4)
    .map((id) => produtosPorId.get(id))
    .filter((produto) => produto !== undefined);

  if (produtosRecentes.length === 0) return null;

  return (
    <section
      aria-labelledby="produto-vistos-recentemente"
      className="mt-16 border-t border-[#e5e1dd] pt-12 md:mt-20 md:pt-16"
    >
      <h2
        id="produto-vistos-recentemente"
        className="font-heading text-2xl tracking-wide uppercase md:text-3xl"
      >
        Vistos recentemente
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {produtosRecentes.map((produto) => (
          <ProdutoColecaoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </section>
  );
}
