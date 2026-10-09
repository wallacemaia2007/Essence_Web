"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { shippingInfo } from "@/data/shipping";
import { calcularFrete, type FreightCalculationResult } from "@/lib/shipping";

export function FreteCalculator() {
  const [cep, setCep] = useState("");
  const [resultado, setResultado] = useState<FreightCalculationResult | null>(
    null,
  );

  function alterarCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setCep(
      digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits,
    );
    setResultado(null);
  }

  function consultarFrete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResultado(calcularFrete(cep));
  }

  return (
    <div>
      <form onSubmit={consultarFrete} className="mt-6">
        <label
          htmlFor="entrega-cep"
          className="text-sm font-medium text-[#171717]"
        >
          {shippingInfo.calculator.inputLabel}
        </label>
        <p
          id="entrega-cep-ajuda"
          className="mt-1 text-xs leading-5 text-[#666]"
        >
          Digite os oito números do CEP, com ou sem hífen.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="entrega-cep"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={9}
            value={cep}
            onChange={(event) => alterarCep(event.target.value)}
            placeholder={shippingInfo.calculator.inputPlaceholder}
            aria-describedby="entrega-cep-ajuda entrega-cep-resultado"
            className="h-11 min-w-0 flex-1 border border-black/15 bg-white px-3 text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-black/10"
          />
          <Button
            type="submit"
            className="h-11 rounded-none bg-[#171717] px-6 text-xs font-semibold tracking-[0.14em] text-white uppercase hover:bg-[#333]"
          >
            {shippingInfo.calculator.submitLabel}
          </Button>
        </div>
        <div
          id="entrega-cep-resultado"
          className="mt-4 min-h-5"
          aria-live="polite"
        >
          {resultado?.status === "invalid" ? (
            <p role="alert" className="text-sm text-[#b42318]">
              {resultado.message}
            </p>
          ) : null}
          {resultado?.status === "mock" ? (
            <section
              aria-labelledby="entrega-resultado-titulo"
              className="border border-black/10 bg-white p-4 sm:p-5"
            >
              <h3
                id="entrega-resultado-titulo"
                className="text-sm font-semibold text-[#171717]"
              >
                {shippingInfo.calculator.resultTitle} · {resultado.cep}
              </h3>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#666]">
                    {shippingInfo.calculator.priceLabel}
                  </dt>
                  <dd className="mt-1 font-semibold">{resultado.price}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#666]">
                    {shippingInfo.calculator.deadlineLabel}
                  </dt>
                  <dd className="mt-1 font-semibold">{resultado.deadline}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-5 text-[#666]">
                {resultado.message}
              </p>
            </section>
          ) : null}
        </div>
      </form>
    </div>
  );
}
