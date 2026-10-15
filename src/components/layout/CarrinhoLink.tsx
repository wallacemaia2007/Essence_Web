"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { routes } from "@/constants/routes";
import { useCarrinho } from "@/hooks/useCarrinho";
import { cn } from "@/lib/utils";

type CarrinhoLinkProps = {
  className?: string;
};

export function CarrinhoLink({ className }: CarrinhoLinkProps) {
  const { quantidadeTotal, hidratado } = useCarrinho();
  const temItens = hidratado && quantidadeTotal > 0;

  return (
    <Link
      href={routes.carrinho}
      aria-label="Sacola"
      title="Sacola"
      className={cn("relative", className)}
    >
      <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.75} />
      <span className="sr-only">Sacola</span>
      {temItens ? (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0.5 h-4 min-w-4 rounded-full bg-[#000000] px-1 text-center text-[0.6rem] leading-4 font-semibold text-white"
        >
          {quantidadeTotal > 99 ? "99+" : quantidadeTotal}
        </span>
      ) : null}
    </Link>
  );
}
