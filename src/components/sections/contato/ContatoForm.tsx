"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronDown,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  Tag,
  User,
} from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { contato, contatoAssuntos } from "@/data/contato";
import {
  contatoFormSchema,
  type ContatoFormValues,
} from "@/lib/contato-schema";
import { buildGmailComposeUrl } from "@/lib/gmail";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "success" | "error";

const defaultValues: ContatoFormValues = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "Dúvida Geral",
  mensagem: "",
  _gotcha: "",
};

export function ContatoForm() {
  const formId = useId();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(defaultValues.assunto);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ContatoFormValues>({
    defaultValues,
    resolver: zodResolver(contatoFormSchema),
  });

  function onSubmit(values: ContatoFormValues) {
    setStatus("idle");
    setServerMessage("");

    const subject = `[Site] ${values.assunto} - ${values.nome}`;
    const body = [
      `Olá, meu nome é ${values.nome}.`,
      `Meu e-mail: ${values.email}`,
      values.telefone ? `Meu telefone: ${values.telefone}` : "",
      "",
      values.mensagem,
      "",
      "Mensagem enviada pelo formulário de contato do site.",
    ]
      .filter(Boolean)
      .join("\n");

    const url = buildGmailComposeUrl({ to: contato.email, subject, body });
    window.open(url, "_blank", "noopener,noreferrer");

    setStatus("success");
    setServerMessage("Abrindo o Gmail com sua mensagem preenchida...");
    reset(defaultValues);
    setSelectedSubject(defaultValues.assunto);
  }

  return (
    <form
      className="bg-card rounded-lg border p-5 shadow-sm md:p-6 lg:max-w-[35rem]"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="mb-6">
        <h2 className="text-2xl leading-tight font-semibold">
          Enviar mensagem
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
          Conte um pouco sobre o convite ou projeto. Responderei o mais breve
          possível.
        </p>
      </div>

      <div className="space-y-3">
        <FormField
          id={`${formId}-nome`}
          label="Nome completo"
          error={errors.nome?.message}
          icon={<User />}
        >
          <input
            id={`${formId}-nome`}
            type="text"
            autoComplete="name"
            placeholder="Nome completo*"
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? `${formId}-nome-error` : undefined}
            className={fieldClassName}
            {...register("nome")}
          />
        </FormField>

        <FormField
          id={`${formId}-email`}
          label="E-mail"
          error={errors.email?.message}
          icon={<Mail />}
        >
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            placeholder="E-mail*"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? `${formId}-email-error` : undefined
            }
            className={fieldClassName}
            {...register("email")}
          />
        </FormField>

        <FormField
          id={`${formId}-telefone`}
          label="Telefone opcional"
          error={errors.telefone?.message}
          icon={<Phone />}
        >
          <input
            id={`${formId}-telefone`}
            type="tel"
            autoComplete="tel"
            placeholder="Telefone (opcional)"
            aria-invalid={Boolean(errors.telefone)}
            aria-describedby={
              errors.telefone ? `${formId}-telefone-error` : undefined
            }
            className={fieldClassName}
            {...register("telefone")}
          />
        </FormField>

        <FormField
          id={`${formId}-assunto`}
          label="Assunto"
          error={errors.assunto?.message}
          icon={<Tag />}
        >
          <button
            id={`${formId}-assunto`}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isSubjectOpen}
            aria-controls={`${formId}-assunto-options`}
            aria-describedby={
              errors.assunto ? `${formId}-assunto-error` : undefined
            }
            className={cn(
              fieldClassName,
              "flex items-center justify-between pr-4 text-left",
              errors.assunto && "border-destructive ring-destructive/20 ring-3",
            )}
            onClick={() => setIsSubjectOpen((isOpen) => !isOpen)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsSubjectOpen(false);
              }
            }}
          >
            <span>{selectedSubject}</span>
            <ChevronDown
              className={cn(
                "text-muted-foreground size-4 transition",
                isSubjectOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          {isSubjectOpen ? (
            <ul
              id={`${formId}-assunto-options`}
              role="listbox"
              aria-label="Assunto"
              className="border-border bg-card absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-md border py-1 shadow-lg"
            >
              {contatoAssuntos.map((assunto) => {
                const isSelected = assunto === selectedSubject;

                return (
                  <li
                    key={assunto}
                    role="option"
                    aria-selected={isSelected}
                    className="pl-0 before:hidden"
                  >
                    <button
                      type="button"
                      className={cn(
                        "hover:bg-muted focus-visible:bg-muted flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition focus-visible:outline-none",
                        isSelected && "text-primary font-medium",
                      )}
                      onClick={() => {
                        setSelectedSubject(assunto);
                        setValue("assunto", assunto, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setIsSubjectOpen(false);
                      }}
                    >
                      <span>{assunto}</span>
                      {isSelected ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </FormField>

        <FormField
          id={`${formId}-mensagem`}
          label="Mensagem"
          error={errors.mensagem?.message}
          icon={<MessageSquareText />}
        >
          <textarea
            id={`${formId}-mensagem`}
            rows={7}
            placeholder="Mensagem*"
            aria-invalid={Boolean(errors.mensagem)}
            aria-describedby={
              errors.mensagem ? `${formId}-mensagem-error` : undefined
            }
            className={cn(fieldClassName, "min-h-36 resize-y py-3")}
            {...register("mensagem")}
          />
        </FormField>

        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${formId}-gotcha`}>Não preencha este campo</label>
          <input
            id={`${formId}-gotcha`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("_gotcha")}
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <p
          aria-live="polite"
          className={cn(
            "min-h-5 text-sm",
            status === "success" && "text-primary font-medium",
            status === "error" && "text-destructive font-medium",
          )}
        >
          {serverMessage}
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 w-full gap-2 px-5"
        >
          {isSubmitting ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-5" aria-hidden="true" />
          )}
          {isSubmitting ? "Enviando" : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  icon: ReactNode;
  children: ReactNode;
};

const fieldClassName =
  "border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30 h-11 w-full rounded-md border px-12 text-sm outline-none transition focus-visible:ring-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

function FormField({ children, error, icon, id, label }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <span className="text-primary pointer-events-none absolute top-3 left-4 [&_svg]:size-4">
          {icon}
        </span>
        {children}
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className="text-destructive pt-1 text-sm"
          aria-live="polite"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}