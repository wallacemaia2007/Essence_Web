import {
  ArrowUpRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

import { contato } from "@/data/contato";
import { localizacaoLoja } from "@/data/localizacao";
import { socialLinks } from "@/data/social";

const cardClassName =
  "group flex min-h-40 flex-col justify-between border border-[#dedede] bg-white p-5 transition-colors hover:border-[#999999] sm:p-6";

const telefoneWhatsApp = contato.whatsapp.replace(/\D/g, "");
const mensagemInicial = encodeURIComponent(
  "Olá, vim pelo site da Essence e gostaria de atendimento.",
);
const whatsappHref = `https://wa.me/${telefoneWhatsApp}?text=${mensagemInicial}`;
const instagram = socialLinks.find((link) => link.platform === "instagram");
const facebook = socialLinks.find((link) => link.platform === "facebook");

export function CanaisContato() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex size-11 items-center justify-center bg-black text-white">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <ArrowUpRight
            className="size-4 text-[#7a7a7a] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
        <div className="mt-8">
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-[#777777] uppercase">
            Atendimento direto
          </p>
          <h3 className="mt-2 mb-0 text-lg font-semibold">WhatsApp</h3>
          <p className="mt-1 mb-0 text-sm text-[#656565]">{contato.telefone}</p>
        </div>
      </a>

      <a
        href={`tel:${contato.telefone.replace(/[^\d+]/g, "")}`}
        className={cardClassName}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex size-11 items-center justify-center border border-[#dedede] text-black">
            <Phone className="size-5" aria-hidden="true" />
          </span>
          <ArrowUpRight
            className="size-4 text-[#7a7a7a] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
        <div className="mt-8">
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-[#777777] uppercase">
            Prefere ligar?
          </p>
          <h3 className="mt-2 mb-0 text-lg font-semibold">Telefone</h3>
          <p className="mt-1 mb-0 text-sm text-[#656565]">{contato.telefone}</p>
        </div>
      </a>

      <section className="border border-[#dedede] bg-white p-5 sm:col-span-2 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-[#777777] uppercase">
              Siga a Essence
            </p>
            <h3 className="mt-2 mb-0 text-lg font-semibold">
              Inspiração e novidades da loja
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {instagram ? (
              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 border border-[#dedede] px-4 text-xs font-semibold text-[#111111] transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <FaInstagram className="size-4" aria-hidden="true" />
                Instagram
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {facebook ? (
              <a
                href={facebook.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 border border-[#dedede] px-4 text-xs font-semibold text-[#111111] transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <FaFacebookF className="size-4" aria-hidden="true" />
                Facebook
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <address className="border border-[#dedede] bg-white p-5 not-italic sm:col-span-2 sm:p-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center border border-[#dedede] text-black">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-[#777777] uppercase">
                Loja física · Passos, MG
              </p>
            </div>
            <p className="mt-5 mb-0 max-w-md text-base leading-7 text-[#202020]">
              {localizacaoLoja.enderecoCompleto}
            </p>
            <p className="mt-3 mb-0 flex items-center gap-2 text-xs text-[#656565]">
              <Clock3 className="size-4" aria-hidden="true" />
              {localizacaoLoja.horario}
            </p>
          </div>
          <a
            href={localizacaoLoja.comoChegarUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir rotas para a loja Essence no Google Maps em uma nova aba"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-black text-xs font-semibold tracking-[0.12em] text-black uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Como chegar
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </address>
    </div>
  );
}
