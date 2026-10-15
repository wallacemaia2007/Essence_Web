"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

async function copiarLink(url: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const campo = document.createElement("textarea");
  campo.value = url;
  campo.setAttribute("readonly", "");
  campo.style.position = "fixed";
  campo.style.opacity = "0";
  document.body.append(campo);
  campo.select();
  const copiado = document.execCommand("copy");
  campo.remove();

  if (!copiado) {
    throw new Error("A cópia do link não foi concluída.");
  }
}

export function ProdutoCompartilhar({ nome }: { nome: string }) {
  async function compartilhar() {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: nome, url });
        return;
      } catch (erro) {
        if (erro instanceof DOMException && erro.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copiarLink(url);
      toast.success("Link do produto copiado.");
    } catch {
      toast.error("Não foi possível copiar o link. Tente novamente.");
    }
  }

  return (
    <button
      type="button"
      onClick={compartilhar}
      aria-label={`Compartilhar ${nome}`}
      className="inline-flex min-h-9 items-center gap-2 text-xs font-medium text-[#74685f] underline decoration-[#bdb5ad] underline-offset-4 transition-colors hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
    >
      <Share2 className="size-4" aria-hidden="true" />
      Compartilhar
    </button>
  );
}
