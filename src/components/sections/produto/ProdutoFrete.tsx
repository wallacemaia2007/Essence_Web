"use client";

import { MapPin, Truck } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { mockShippingProvider } from "@/lib/product-shipping";

function mascararCep(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  return digitos.length > 5
    ? `${digitos.slice(0, 5)}-${digitos.slice(5)}`
    : digitos;
}

export function ProdutoFrete() {
  const idCep = useId();
  const [cep, setCep] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [consultando, setConsultando] = useState(false);

  async function consultarFrete(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const digitos = cep.replace(/\D/g, "");

    if (digitos.length !== 8) {
      setMensagem("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setConsultando(true);
    setMensagem("");
    try {
      const resultado = await mockShippingProvider.quote(digitos);
      setMensagem(resultado.message);
    } catch {
      setMensagem("Não foi possível consultar agora. Fale com a loja.");
    } finally {
      setConsultando(false);
    }
  }

  return (
    <section
      aria-labelledby="produto-frete-title"
      className="mt-6 border-y border-[#e5e1dd] py-5"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[#231f1b]">
        <Truck className="size-4" aria-hidden="true" />
        <h2 id="produto-frete-title" className="m-0 text-sm font-medium">
          Calcule o frete
        </h2>
      </div>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={consultarFrete}
        noValidate
      >
        <label className="sr-only" htmlFor={idCep}>
          CEP de destino
        </label>
        <input
          id={idCep}
          name="cep"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={9}
          placeholder="00000-000"
          value={cep}
          onChange={(evento) => {
            setCep(mascararCep(evento.currentTarget.value));
            setMensagem("");
          }}
          aria-describedby={`${idCep}-help`}
          className="h-11 min-w-0 flex-1 border border-[#d8d1ca] bg-white px-3 text-sm text-[#231f1b] placeholder:text-[#9b9188] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b]"
        />
        <button
          type="submit"
          disabled={consultando}
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#231f1b] px-4 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#231f1b] disabled:cursor-wait disabled:opacity-70"
        >
          <MapPin className="size-4" aria-hidden="true" />
          {consultando ? "Consultando…" : "Consultar"}
        </button>
      </form>
      <p id={`${idCep}-help`} className="mt-2 text-xs leading-5 text-[#74685f]">
        Informe os 8 dígitos do CEP. Valores e prazos serão confirmados pela
        loja.
      </p>
      {mensagem && (
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-[#51483f]">
          {mensagem}
        </p>
      )}
    </section>
  );
}
