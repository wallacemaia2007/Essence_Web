"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { footerData } from "@/data/footer";
import {
  newsletterFormSchema,
  type NewsletterFormValues,
} from "@/lib/newsletter-schema";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter } from "@/services/newsletter";

type SubmitStatus = "idle" | "success" | "error";

export function FooterNewsletter() {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<NewsletterFormValues>({
    defaultValues: { email: "" },
    resolver: zodResolver(newsletterFormSchema),
  });

  async function onSubmit({ email }: NewsletterFormValues) {
    setStatus("idle");

    try {
      await subscribeToNewsletter(email);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  const message =
    errors.email?.message ??
    (status === "success"
      ? footerData.newsletter.sucesso
      : status === "error"
        ? "Não foi possível concluir sua inscrição agora. Tente novamente em instantes."
        : "");

  const isError = Boolean(errors.email) || status === "error";

  return (
    <div>
      <h2 className="font-heading text-center text-2xl leading-tight tracking-wide uppercase md:text-3xl lg:text-left">
        {footerData.newsletter.titulo}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-md text-center text-sm leading-6 lg:text-left">
        {footerData.newsletter.descricao}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="flex-1">
          <label htmlFor={fieldId} className="sr-only">
            E-mail para receber novidades
          </label>
          <input
            id={fieldId}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={footerData.newsletter.placeholder}
            aria-invalid={isError}
            aria-describedby={messageId}
            className="placeholder:text-muted-foreground aria-invalid:border-destructive h-8 w-full rounded-sm border-b bg-transparent px-1 text-sm transition outline-none"
            {...register("email", { onChange: () => setStatus("idle") })}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 gap-2 px-6 text-xs tracking-[0.18em] uppercase"
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : status === "success" ? (
            <Check aria-hidden="true" />
          ) : null}
          {isSubmitting ? "Enviando" : footerData.newsletter.botao}
        </Button>
      </form>

      <p
        id={messageId}
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-sm",
          isError ? "text-destructive" : "text-primary font-medium",
        )}
      >
        {message}
      </p>
    </div>
  );
}
