"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, MessageSquareText, Send } from "lucide-react";
import type { ReactNode } from "react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { contato, contatoAssuntos } from "@/data/contato";
import {
  contatoFormSchema,
  type ContatoFormValues,
} from "@/lib/contato-schema";
import { cn } from "@/lib/utils";

const defaultValues: ContatoFormValues = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "Dúvida sobre produtos",
  mensagem: "",
};

const inputClassName =
  "mt-2 h-12 w-full border border-[#d7d7d7] bg-white px-4 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-black focus-visible:ring-2 focus-visible:ring-black/15 aria-invalid:border-red-700";

export function ContatoForm() {
  const formId = useId();
  const [linkWhatsApp, setLinkWhatsApp] = useState("");
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ContatoFormValues>({
    defaultValues,
    resolver: zodResolver(contatoFormSchema),
  });

  function prepararMensagem(values: ContatoFormValues) {
    const mensagem = [
      `Olá! Meu nome é ${values.nome}.`,
      `E-mail: ${values.email}`,
      values.telefone ? `Telefone: ${values.telefone}` : "",
      `Assunto: ${values.assunto}`,
      "",
      "Mensagem:",
      values.mensagem,
      "",
      "Mensagem preparada pelo formulário do site Essence Passos.",
    ]
      .filter(Boolean)
      .join("\n");
    const telefoneWhatsApp = contato.whatsapp.replace(/\D/g, "");

    setLinkWhatsApp(
      `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`,
    );
  }

  return (
    <form
      aria-labelledby={`${formId}-title`}
      className="border border-[#dedede] bg-white p-5 sm:p-7 lg:p-9"
      noValidate
      onChange={() => setLinkWhatsApp("")}
      onSubmit={handleSubmit(prepararMensagem)}
    >
      <div className="mb-7 border-b border-[#e9e9e9] pb-6">
        <div className="flex items-center gap-3 text-[#656565]">
          <MessageSquareText className="size-4" aria-hidden="true" />
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
            Mensagem para a loja
          </p>
        </div>
        <h3
          id={`${formId}-title`}
          className="font-heading mt-3 mb-0 text-2xl leading-tight sm:text-3xl"
        >
          Deixe seu recado.
        </h3>
        <p className="mt-3 mb-0 text-sm leading-6 text-[#656565]">
          Preencha os campos e confira o texto no WhatsApp antes de enviá-lo.
        </p>
      </div>

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <FormField
          id={`${formId}-nome`}
          label="Seu nome"
          error={errors.nome?.message}
        >
          <input
            id={`${formId}-nome`}
            type="text"
            autoComplete="name"
            placeholder="Como podemos chamar você?"
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? `${formId}-nome-error` : undefined}
            className={inputClassName}
            {...register("nome")}
          />
        </FormField>

        <FormField
          id={`${formId}-email`}
          label="Seu e-mail"
          error={errors.email?.message}
        >
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? `${formId}-email-error` : undefined
            }
            className={inputClassName}
            {...register("email")}
          />
        </FormField>

        <FormField
          id={`${formId}-telefone`}
          label="Telefone (opcional)"
          error={errors.telefone?.message}
        >
          <input
            id={`${formId}-telefone`}
            type="tel"
            autoComplete="tel"
            placeholder="(35) 99999-9999"
            aria-invalid={Boolean(errors.telefone)}
            aria-describedby={
              errors.telefone ? `${formId}-telefone-error` : undefined
            }
            className={inputClassName}
            {...register("telefone")}
          />
        </FormField>

        <FormField
          id={`${formId}-assunto`}
          label="Sobre o que você quer falar?"
          error={errors.assunto?.message}
        >
          <select
            id={`${formId}-assunto`}
            aria-invalid={Boolean(errors.assunto)}
            aria-describedby={
              errors.assunto ? `${formId}-assunto-error` : undefined
            }
            className={cn(inputClassName, "cursor-pointer")}
            {...register("assunto")}
          >
            {contatoAssuntos.map((assunto) => (
              <option key={assunto} value={assunto}>
                {assunto}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id={`${formId}-mensagem`}
          label="Sua mensagem"
          error={errors.mensagem?.message}
          className="sm:col-span-2"
        >
          <textarea
            id={`${formId}-mensagem`}
            rows={5}
            placeholder="Escreva aqui como podemos ajudar..."
            aria-invalid={Boolean(errors.mensagem)}
            aria-describedby={
              errors.mensagem ? `${formId}-mensagem-error` : undefined
            }
            className={cn(inputClassName, "h-auto min-h-36 resize-y py-3")}
            {...register("mensagem")}
          />
        </FormField>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-black px-5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:w-auto"
      >
        Preparar mensagem
        <Send className="size-4" aria-hidden="true" />
      </button>

      {linkWhatsApp ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 border-l-2 border-black bg-[#f5f5f5] p-4"
        >
          <p className="m-0 text-sm font-medium text-[#111111]">
            Sua mensagem está pronta. Revise e confirme o envio no WhatsApp.
          </p>
          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#111111] uppercase underline underline-offset-4 hover:text-[#555555] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Abrir WhatsApp com a mensagem
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      ) : null}

      <p className="mt-5 mb-0 text-xs leading-5 text-[#777777]">
        O site não envia a mensagem automaticamente; você poderá revisar o texto
        e decidir se deseja enviá-lo pelo WhatsApp.
      </p>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

function FormField({ children, className, error, id, label }: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold tracking-[0.04em] text-[#252525]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 mb-0 text-xs leading-5 text-red-800"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
