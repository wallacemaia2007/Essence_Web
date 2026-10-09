import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

import { Container, ThemedSection } from "@/components/common";
import { FavoritoButton } from "@/components/common/favorito-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { routes } from "@/constants/routes";
import { caminhoDaColecao } from "@/lib/colecao";
import {
  linkBaseWhatsapp,
  type ProdutoDetalhado,
  produtosRelacionados,
} from "@/lib/produto";
import { mensagemDeAjuda, montarLinkWhatsapp } from "@/lib/whatsapp";

import { PrecoProduto } from "../catalogo/PrecoProduto";
import { ProdutoColecaoCard } from "../colecao/ProdutoColecaoCard";
import { ProdutoCompra } from "./ProdutoCompra";
import { ProdutoGaleria } from "./ProdutoGaleria";

const gatilhoClasse = "py-3.5 text-sm tracking-wide md:text-base";

function Paragrafos({ texto }: { texto: string }) {
  return texto
    .split("\n\n")
    .map((paragrafo) => <p key={paragrafo}>{paragrafo}</p>);
}

/** Página de detalhe da peça: galeria, preço, tamanhos, informações e relacionadas. */
export function ProdutoDetalhe({ detalhe }: { detalhe: ProdutoDetalhado }) {
  const { composicao, cuidados, fotos, produto, referencia, sobre, tamanhos } =
    detalhe;
  const whatsappBase = linkBaseWhatsapp();
  const hrefColecao = caminhoDaColecao(produto.colecao);
  const relacionados = produtosRelacionados(produto);

  const linkClasse =
    "transition-colors hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]";

  return (
    <ThemedSection
      aria-label={produto.nome}
      className="bg-white pt-28 pb-16 text-[#231f1b] md:pt-32 md:pb-24"
    >
      <Container className="max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <ProdutoGaleria nome={produto.nome} fotos={fotos} />

          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#74685f]"
            >
              <Link href={routes.home} className={linkClasse}>
                Início
              </Link>
              <span aria-hidden="true">›</span>
              <Link href={routes.colecao} className={linkClasse}>
                Catálogo
              </Link>
              <span aria-hidden="true">›</span>
              {hrefColecao ? (
                <Link href={hrefColecao} className={linkClasse}>
                  {produto.colecao}
                </Link>
              ) : (
                <span>{produto.colecao}</span>
              )}
              <span aria-hidden="true">›</span>
              <span aria-current="page" className="text-[#231f1b]">
                {produto.nome}
              </span>
            </nav>

            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-2xl leading-tight tracking-wide sm:text-3xl">
                {produto.nome}
              </h1>
              <FavoritoButton produto={produto} className="mt-1" />
            </div>

            <PrecoProduto
              produto={produto}
              className="mt-5 justify-start"
              precoAtualClassName="text-xl"
            />
            <p className="mt-3 text-sm text-[#74685f]">Ref.: {referencia}</p>

            <hr className="my-6 border-[#e5e1dd]" />

            <ProdutoCompra
              produtoId={produto.id}
              nome={produto.nome}
              referencia={referencia}
              tamanhos={tamanhos}
              whatsappBase={whatsappBase}
            />

            <div className="mt-8 flex items-start gap-4 bg-[#f1efec] p-5">
              <FaWhatsapp
                className="mt-0.5 size-6 shrink-0 text-[#51483f]"
                aria-hidden="true"
              />
              <div>
                <p className="text-base">Atendimento personalizado</p>
                <a
                  href={montarLinkWhatsapp(
                    whatsappBase,
                    mensagemDeAjuda({ nome: produto.nome, referencia }),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-4 hover:text-[#51483f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
                >
                  Tirar dúvidas de tamanho com a equipe
                </a>
              </div>
            </div>

            <h2 className="sr-only">Detalhes da peça</h2>
            <Accordion hiddenUntilFound className="mt-8">
              <AccordionItem value="sobre">
                <AccordionTrigger className={gatilhoClasse}>
                  Sobre o produto
                </AccordionTrigger>
                <AccordionContent>
                  <Paragrafos texto={sobre} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="composicao">
                <AccordionTrigger className={gatilhoClasse}>
                  Composição
                </AccordionTrigger>
                <AccordionContent>
                  <Paragrafos texto={composicao} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cuidados">
                <AccordionTrigger className={gatilhoClasse}>
                  Cuidados com o produto
                </AccordionTrigger>
                <AccordionContent>
                  <Paragrafos texto={cuidados} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relacionados.length > 0 ? (
          <section
            aria-labelledby="produto-relacionados"
            className="mt-16 border-t border-[#e5e1dd] pt-12 md:mt-24 md:pt-16"
          >
            <h2
              id="produto-relacionados"
              className="font-heading text-2xl tracking-wide uppercase md:text-3xl"
            >
              Você também pode gostar
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {relacionados.map((item) => (
                <ProdutoColecaoCard key={item.id} produto={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </ThemedSection>
  );
}
