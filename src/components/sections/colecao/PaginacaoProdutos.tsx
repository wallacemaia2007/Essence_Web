import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginacaoProdutosProps = {
  paginaAtual: number;
  totalDePaginas: number;
  indiceInicial: number;
  indiceFinal: number;
  totalDeProdutos: number;
  aoMudarPagina: (pagina: number) => void;
  /** `id` do elemento que contém a lista paginada (aria-controls). */
  controlaId: string;
  /** Rótulo acessível da navegação de páginas. */
  rotulo: string;
};

export function PaginacaoProdutos({
  paginaAtual,
  totalDePaginas,
  indiceInicial,
  indiceFinal,
  totalDeProdutos,
  aoMudarPagina,
  controlaId,
  rotulo,
}: PaginacaoProdutosProps) {
  if (totalDeProdutos === 0) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#e5e1dd] pt-6 sm:flex-row sm:justify-between">
      <p
        aria-live="polite"
        className="text-center text-xs text-[#655e57] sm:text-left"
      >
        Página {paginaAtual} de {totalDePaginas} · Exibindo {indiceInicial + 1}–
        {indiceFinal} de {totalDeProdutos} peças
      </p>

      <nav
        aria-label={rotulo}
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <Button
          type="button"
          variant="outline"
          disabled={paginaAtual <= 1}
          onClick={() => aoMudarPagina(paginaAtual - 1)}
          aria-label="Ir para a página anterior"
          aria-controls={controlaId}
          className="min-h-11 rounded-full border-[#ded9d3] px-4 text-[#231f1b]"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Anterior
        </Button>

        <div role="group" aria-label="Escolher página" className="flex gap-1">
          {Array.from({ length: totalDePaginas }, (_, indice) => {
            const pagina = indice + 1;
            const paginaSelecionada = paginaAtual === pagina;

            return (
              <Button
                key={pagina}
                type="button"
                variant="outline"
                onClick={() => aoMudarPagina(pagina)}
                aria-label={`Ir para a página ${pagina}`}
                aria-current={paginaSelecionada ? "page" : undefined}
                aria-controls={controlaId}
                className={
                  paginaSelecionada
                    ? "min-h-11 min-w-11 rounded-full border-[#231f1b] bg-[#231f1b] px-3 text-white hover:bg-[#51483f] hover:text-white"
                    : "min-h-11 min-w-11 rounded-full border-[#ded9d3] px-3 text-[#231f1b]"
                }
              >
                {pagina}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={paginaAtual >= totalDePaginas}
          onClick={() => aoMudarPagina(paginaAtual + 1)}
          aria-label="Ir para a próxima página"
          aria-controls={controlaId}
          className="min-h-11 rounded-full border-[#ded9d3] px-4 text-[#231f1b]"
        >
          Próxima
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
