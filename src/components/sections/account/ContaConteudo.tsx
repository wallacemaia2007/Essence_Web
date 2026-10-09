"use client";

import { ArrowRight, Heart, MapPin, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

import { useDemoAuth } from "@/components/auth/DemoAuthProvider";
import { routes } from "@/constants/routes";

type MockAddress = {
  id: string;
  value: string;
};

const inputClassName =
  "min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#171717] outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 aria-invalid:border-red-600";

export function ContaConteudo() {
  const { user } = useDemoAuth();
  const [telefone, setTelefone] = useState("");
  const [telefoneErro, setTelefoneErro] = useState("");
  const [telefoneSalvo, setTelefoneSalvo] = useState(false);
  const [enderecos, setEnderecos] = useState<MockAddress[]>([]);
  const [novoEndereco, setNovoEndereco] = useState("");
  const [enderecoErro, setEnderecoErro] = useState("");

  if (!user) return null;

  function salvarTelefone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digitos = telefone.replace(/\D/g, "");

    if (digitos.length < 10) {
      setTelefoneErro("Informe um telefone com DDD.");
      setTelefoneSalvo(false);
      return;
    }

    setTelefoneErro("");
    setTelefoneSalvo(true);
  }

  function adicionarEndereco(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = novoEndereco.trim();

    if (value.length < 8) {
      setEnderecoErro("Digite um endereço completo para salvar.");
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `endereco-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setEnderecos((current) => [...current, { id, value }]);
    setNovoEndereco("");
    setEnderecoErro("");
  }

  function removerEndereco(id: string) {
    setEnderecos((current) => current.filter((address) => address.id !== id));
  }

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="dados-pessoais-titulo"
        className="rounded-2xl border border-black/10 bg-white p-5 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-black/5">
            <UserRound aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-black/50 uppercase">
              Sua conta
            </p>
            <h2
              id="dados-pessoais-titulo"
              className="font-heading m-0 mt-1 text-2xl font-medium"
            >
              Dados pessoais
            </h2>
          </div>
        </div>

        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-black/55">Nome</dt>
            <dd className="mt-1 text-sm font-medium break-words">
              {user.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-black/55">E-mail</dt>
            <dd className="mt-1 text-sm font-medium break-all">{user.email}</dd>
          </div>
        </dl>

        <form onSubmit={salvarTelefone} className="mt-7 max-w-xl">
          <label
            htmlFor="conta-telefone"
            className="mb-2 block text-xs font-medium text-black/70"
          >
            Telefone
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="conta-telefone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={telefone}
              onChange={(event) => {
                setTelefone(event.target.value);
                setTelefoneErro("");
                setTelefoneSalvo(false);
              }}
              placeholder="(35) 99999-9999"
              aria-invalid={Boolean(telefoneErro)}
              aria-describedby={
                telefoneErro ? "conta-telefone-erro" : "conta-telefone-ajuda"
              }
              className={inputClassName}
            />
            <button
              type="submit"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
            >
              Salvar telefone
            </button>
          </div>
          {telefoneErro ? (
            <p
              id="conta-telefone-erro"
              role="alert"
              className="mt-2 text-xs text-red-700"
            >
              {telefoneErro}
            </p>
          ) : (
            <p
              id="conta-telefone-ajuda"
              className="mt-2 text-xs leading-5 text-black/50"
            >
              {telefoneSalvo
                ? "Telefone atualizado nesta demonstração."
                : "O telefone é opcional e fica apenas em memória nesta demonstração."}
            </p>
          )}
        </form>
      </section>

      <section
        aria-labelledby="enderecos-titulo"
        className="rounded-2xl border border-black/10 bg-white p-5 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-black/5">
            <MapPin aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-black/50 uppercase">
              Entrega
            </p>
            <h2
              id="enderecos-titulo"
              className="font-heading m-0 mt-1 text-2xl font-medium"
            >
              Endereços salvos
            </h2>
          </div>
        </div>

        {enderecos.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {enderecos.map((address) => (
              <li
                key={address.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-black/10 p-4"
              >
                <p className="m-0 text-sm leading-6">{address.value}</p>
                <button
                  type="button"
                  onClick={() => removerEndereco(address.id)}
                  aria-label={`Remover endereço: ${address.value}`}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-black/65 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-black/15 px-4 py-5">
            <p className="m-0 text-sm font-medium">Nenhum endereço salvo</p>
            <p className="mt-1 mb-0 text-sm leading-6 text-black/55">
              Adicione um endereço para vê-lo nesta lista demonstrativa.
            </p>
          </div>
        )}

        <form onSubmit={adicionarEndereco} className="mt-6 max-w-2xl">
          <label
            htmlFor="novo-endereco"
            className="mb-2 block text-xs font-medium text-black/70"
          >
            Endereço completo
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="novo-endereco"
              name="address"
              type="text"
              autoComplete="street-address"
              maxLength={180}
              value={novoEndereco}
              onChange={(event) => {
                setNovoEndereco(event.target.value);
                setEnderecoErro("");
              }}
              placeholder="Rua, número, bairro, cidade e CEP"
              aria-invalid={Boolean(enderecoErro)}
              aria-describedby={enderecoErro ? "endereco-erro" : undefined}
              className={inputClassName}
            />
            <button
              type="submit"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-black/20 px-5 text-xs font-semibold tracking-wide transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
            >
              Adicionar endereço
            </button>
          </div>
          {enderecoErro ? (
            <p
              id="endereco-erro"
              role="alert"
              className="mt-2 text-xs text-red-700"
            >
              {enderecoErro}
            </p>
          ) : null}
          <p className="mt-2 text-xs leading-5 text-black/50">
            Endereços e telefone não são salvos no navegador nem enviados a um
            servidor.
          </p>
        </form>
      </section>

      <Link
        href={routes.favoritos}
        className="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:p-7"
      >
        <span className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-black/5">
            <Heart aria-hidden="true" className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Meus favoritos</span>
            <span className="mt-1 block text-xs text-black/55">
              Relembre as peças que você salvou.
            </span>
          </span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
