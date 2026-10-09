import type { ProdutoVitrine } from "@/data/vitrine";
import { emPromocao, percentualDesconto } from "@/lib/pricing";
import { formatarPreco } from "@/lib/produto";
import { cn } from "@/lib/utils";

type PrecoProdutoProps = {
  produto: Pick<ProdutoVitrine, "preco" | "precoOriginal">;
  className?: string;
  precoAtualClassName?: string;
};

export function PrecoProduto({
  produto,
  className,
  precoAtualClassName,
}: PrecoProdutoProps) {
  const promocao = emPromocao(produto);
  const precoAtual = formatarPreco(produto.preco);
  const precoAnterior = formatarPreco(produto.precoOriginal);
  const percentual =
    promocao && produto.preco !== null && produto.preco !== undefined
      ? percentualDesconto(produto.precoOriginal!, produto.preco)
      : 0;

  return (
    <div
      role="group"
      aria-label={
        promocao
          ? `De ${precoAnterior} por ${precoAtual}`
          : `Preço: ${precoAtual}`
      }
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}
    >
      {promocao ? (
        <>
          <span
            aria-hidden="true"
            className="inline-flex items-center bg-[#231f1b] px-2 py-1 text-[0.58rem] font-semibold tracking-[0.12em] text-white uppercase"
          >
            -{percentual}%
          </span>
          <span
            aria-hidden="true"
            className="text-xs text-[#75695e] line-through"
          >
            {precoAnterior}
          </span>
          <span
            aria-hidden="true"
            className={cn("font-semibold text-[#231f1b]", precoAtualClassName)}
          >
            {precoAtual}
          </span>
        </>
      ) : (
        <span
          aria-hidden="true"
          className={cn("text-[#51483f]", precoAtualClassName)}
        >
          {precoAtual}
        </span>
      )}
    </div>
  );
}
