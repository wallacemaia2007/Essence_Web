"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import { routes } from "@/constants/routes";
import { contato } from "@/data/contato";
import {
  personalServiceOptions,
  type PersonalServiceType,
} from "@/data/personal-service";
import { isStoreOpenOnWeekday } from "@/data/store-hours";

type RequestValues = {
  nome: string;
  whatsapp: string;
  tipo: PersonalServiceType | "";
  data: string;
  periodo: "Manhã" | "Tarde" | "";
  ocasiao: string;
  observacoes: string;
};

type RequiredField = "nome" | "whatsapp" | "tipo" | "data" | "periodo";
type RequestErrors = Partial<Record<keyof RequestValues, string>>;
type FocusableField = HTMLInputElement | HTMLSelectElement;

const initialValues: RequestValues = {
  nome: "",
  whatsapp: "",
  tipo: "",
  data: "",
  periodo: "",
  ocasiao: "",
  observacoes: "",
};

const requiredFields: readonly RequiredField[] = [
  "nome",
  "whatsapp",
  "tipo",
  "data",
  "periodo",
];

function localIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function tomorrowLocalIsoDate() {
  const tomorrow = new Date();
  tomorrow.setHours(12, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return localIsoDate(tomorrow);
}

function weekdayFromIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12).getDay();
}

function formatWhatsapp(value: string) {
  const pastedDigits = value.replace(/\D/g, "");
  const localDigits =
    pastedDigits.length > 11 && pastedDigits.startsWith("55")
      ? pastedDigits.slice(2)
      : pastedDigits;
  const digits = localDigits.slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : "";

  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);
  const splitAt = digits.length > 10 ? 5 : 4;
  const firstPart = number.slice(0, splitAt);
  const secondPart = number.slice(splitAt);

  return `(${ddd}) ${firstPart}${secondPart ? `-${secondPart}` : ""}`;
}

function validateDate(value: string, minimumDate: string) {
  if (!value) return "Escolha a data preferida para o atendimento.";
  if (value < minimumDate) return "Escolha uma data a partir de amanhã.";

  const weekday = weekdayFromIsoDate(value);
  if (!isStoreOpenOnWeekday(weekday)) {
    return "A loja atende de segunda a sexta. Escolha um dia útil, por favor.";
  }

  return "";
}

function validate(values: RequestValues, minimumDate: string): RequestErrors {
  const errors: RequestErrors = {};
  const phoneDigits = values.whatsapp.replace(/\D/g, "");

  if (values.nome.trim().length < 2) {
    errors.nome = "Informe seu nome (pelo menos 2 caracteres).";
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.whatsapp =
      "Informe um WhatsApp válido com DDD. Ex.: (35) 99999-9999.";
  }

  if (!values.tipo) errors.tipo = "Escolha o tipo de atendimento.";

  const dateError = validateDate(values.data, minimumDate);
  if (dateError) errors.data = dateError;

  if (!values.periodo) errors.periodo = "Selecione manhã ou tarde.";

  return errors;
}

function formatDateForMessage(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date(year, month - 1, day, 12));
}

export function PersonalServiceRequestForm() {
  const id = useId();
  const [values, setValues] = useState<RequestValues>(initialValues);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [minimumDate, setMinimumDate] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [popupBlocked, setPopupBlocked] = useState(false);
  const fieldRefs = useRef<
    Partial<Record<RequiredField, FocusableField | null>>
  >({});

  useEffect(() => {
    const timer = window.setTimeout(
      () => setMinimumDate(tomorrowLocalIsoDate()),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  function updateField<K extends keyof RequestValues>(
    field: K,
    value: RequestValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleDateChange(value: string) {
    if (value && !isStoreOpenOnWeekday(weekdayFromIsoDate(value))) {
      setValues((current) => ({ ...current, data: "" }));
      setErrors((current) => ({
        ...current,
        data: "A loja atende de segunda a sexta. Escolha um dia útil, por favor.",
      }));
      return;
    }

    updateField("data", value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errorsFound = validate(values, minimumDate || tomorrowLocalIsoDate());
    setErrors(errorsFound);

    const firstInvalid = requiredFields.find((field) => errorsFound[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    const serviceTitle =
      personalServiceOptions.find((option) => option.value === values.tipo)
        ?.title ?? values.tipo;
    const message = [
      "Olá! Gostaria de solicitar um atendimento personalizado na Essence.",
      `Nome: ${values.nome.trim()}`,
      `WhatsApp: ${values.whatsapp}`,
      `Tipo de atendimento: ${serviceTitle}`,
      `Data preferida: ${formatDateForMessage(values.data)}`,
      `Período preferido: ${values.periodo}`,
      `Ocasião: ${values.ocasiao.trim() || "Não informada"}`,
      `Observações: ${values.observacoes.trim() || "Nenhuma"}`,
    ].join("\n");
    const url = `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(message)}`;
    let openedWindow: Window | null = null;

    try {
      openedWindow = window.open(url, "_blank");
      if (openedWindow) openedWindow.opener = null;
    } catch {
      // O link de contingência permanece disponível se o browser bloquear popups.
    }
    setWhatsappUrl(url);
    setPopupBlocked(!openedWindow);
    setValues(initialValues);
    setErrors({});
  }

  function startAnotherRequest() {
    setWhatsappUrl("");
    setPopupBlocked(false);
    setValues(initialValues);
    setErrors({});
  }

  const phoneHelpId = `${id}-whatsapp-help`;

  if (whatsappUrl) {
    return (
      <section
        aria-labelledby={`${id}-success-title`}
        className="rounded-xl border border-[#231f1b]/15 bg-white p-5 shadow-sm sm:p-8"
        role="status"
        aria-live="polite"
      >
        <p className="m-0 text-xs font-semibold tracking-[0.18em] text-[#756d65] uppercase">
          Solicitação preparada
        </p>
        <h3
          id={`${id}-success-title`}
          className="font-heading mt-3 mb-0 text-3xl leading-tight tracking-wide uppercase"
        >
          Quase lá
        </h3>
        <p className="mt-4 mb-0 text-sm leading-7 text-[#655e57]">
          {popupBlocked
            ? "Seu navegador bloqueou a abertura automática. Use o botão abaixo para continuar a conversa no WhatsApp."
            : "Abrimos o WhatsApp em outra aba. Confira a mensagem e toque em enviar para falar com a equipe."}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#231f1b] px-5 text-center text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] motion-reduce:transition-none sm:w-auto"
        >
          Continuar para o WhatsApp
        </a>
        <button
          type="button"
          onClick={startAnotherRequest}
          className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center text-xs font-semibold tracking-[0.1em] text-[#655e57] underline underline-offset-4 hover:text-[#231f1b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] sm:ml-4 sm:w-auto"
        >
          Fazer outra solicitação
        </button>
      </section>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#231f1b]/15 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-nome`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            Nome completo <span aria-hidden="true">*</span>
          </label>
          <input
            ref={(node) => {
              fieldRefs.current.nome = node;
            }}
            id={`${id}-nome`}
            name="nome"
            required
            maxLength={100}
            autoComplete="name"
            value={values.nome}
            onChange={(event) => updateField("nome", event.currentTarget.value)}
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? `${id}-nome-error` : undefined}
            className={fieldClassName}
          />
          <FieldError id={`${id}-nome-error`} message={errors.nome} />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-whatsapp`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            WhatsApp com DDD <span aria-hidden="true">*</span>
          </label>
          <input
            ref={(node) => {
              fieldRefs.current.whatsapp = node;
            }}
            id={`${id}-whatsapp`}
            name="whatsapp"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(35) 99999-9999"
            value={values.whatsapp}
            onChange={(event) =>
              updateField("whatsapp", formatWhatsapp(event.currentTarget.value))
            }
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={`${phoneHelpId}${errors.whatsapp ? ` ${id}-whatsapp-error` : ""}`}
            className={fieldClassName}
          />
          <p id={phoneHelpId} className="mt-1.5 mb-0 text-xs text-[#756d65]">
            Digite o DDD e o número que a equipe pode chamar.
          </p>
          <FieldError id={`${id}-whatsapp-error`} message={errors.whatsapp} />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-tipo`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            Tipo de atendimento <span aria-hidden="true">*</span>
          </label>
          <select
            ref={(node) => {
              fieldRefs.current.tipo = node;
            }}
            id={`${id}-tipo`}
            name="tipo"
            required
            value={values.tipo}
            onChange={(event) =>
              updateField(
                "tipo",
                event.currentTarget.value as PersonalServiceType | "",
              )
            }
            aria-invalid={Boolean(errors.tipo)}
            aria-describedby={errors.tipo ? `${id}-tipo-error` : undefined}
            className={fieldClassName}
          >
            <option value="">Selecione uma opção</option>
            {personalServiceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
            ))}
          </select>
          <FieldError id={`${id}-tipo-error`} message={errors.tipo} />
        </div>

        <div>
          <label
            htmlFor={`${id}-data`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            Data preferida <span aria-hidden="true">*</span>
          </label>
          <input
            ref={(node) => {
              fieldRefs.current.data = node;
            }}
            id={`${id}-data`}
            name="data"
            required
            type="date"
            min={minimumDate || undefined}
            value={values.data}
            onChange={(event) => handleDateChange(event.currentTarget.value)}
            aria-invalid={Boolean(errors.data)}
            aria-describedby={errors.data ? `${id}-data-error` : undefined}
            className={fieldClassName}
          />
          <p className="mt-1.5 mb-0 text-xs text-[#756d65]">
            A partir de amanhã; sem atendimento aos sábados e domingos.
          </p>
          <FieldError id={`${id}-data-error`} message={errors.data} />
        </div>

        <div>
          <label
            htmlFor={`${id}-periodo`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            Período preferido <span aria-hidden="true">*</span>
          </label>
          <select
            ref={(node) => {
              fieldRefs.current.periodo = node;
            }}
            id={`${id}-periodo`}
            name="periodo"
            required
            value={values.periodo}
            onChange={(event) =>
              updateField(
                "periodo",
                event.currentTarget.value as RequestValues["periodo"],
              )
            }
            aria-invalid={Boolean(errors.periodo)}
            aria-describedby={
              errors.periodo ? `${id}-periodo-error` : undefined
            }
            className={fieldClassName}
          >
            <option value="">Selecione</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
          </select>
          <FieldError id={`${id}-periodo-error`} message={errors.periodo} />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-ocasiao`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            Ocasião{" "}
            <span className="text-xs font-normal text-[#756d65]">
              (opcional)
            </span>
          </label>
          <input
            id={`${id}-ocasiao`}
            name="ocasiao"
            type="text"
            maxLength={100}
            value={values.ocasiao}
            onChange={(event) =>
              updateField("ocasiao", event.currentTarget.value)
            }
            placeholder="Ex.: trabalho, festa, viagem"
            className={fieldClassName}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${id}-observacoes`}
            className="mb-1.5 block text-sm font-medium text-[#231f1b]"
          >
            Observações{" "}
            <span className="text-xs font-normal text-[#756d65]">
              (opcional)
            </span>
          </label>
          <textarea
            id={`${id}-observacoes`}
            name="observacoes"
            rows={4}
            maxLength={500}
            value={values.observacoes}
            onChange={(event) =>
              updateField("observacoes", event.currentTarget.value)
            }
            placeholder="Conte, se quiser, sobre cores, estilos ou peças que procura."
            className={`${fieldClassName} h-auto min-h-28 resize-y py-3`}
          />
          <p className="mt-1 mb-0 text-right text-xs text-[#756d65]">
            {values.observacoes.length}/500
          </p>
        </div>
      </div>

      <p className="mt-5 mb-0 text-xs leading-5 text-[#756d65]">
        Este formulário não salva seus dados no site. Ao continuar, você abre o
        WhatsApp com a mensagem preparada e escolhe se deseja enviá-la. Consulte
        nossa{" "}
        <Link
          href={routes.politicaPrivacidade}
          className="font-medium text-[#231f1b] underline underline-offset-4 hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6746]"
        >
          Política de Privacidade
        </Link>
        .
      </p>

      <button
        type="submit"
        className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#231f1b] px-5 text-center text-xs font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#231f1b] motion-reduce:transition-none"
      >
        Enviar solicitação e abrir WhatsApp
      </button>
    </form>
  );
}

const fieldClassName =
  "min-h-11 w-full rounded-md border border-[#231f1b]/25 bg-white px-3 text-sm text-[#231f1b] outline-none transition-colors placeholder:text-[#756d65] focus-visible:border-[#231f1b] focus-visible:ring-2 focus-visible:ring-[#231f1b]/15 aria-invalid:border-[#b42318] aria-invalid:ring-2 aria-invalid:ring-[#b42318]/15 motion-reduce:transition-none";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1.5 mb-0 text-sm text-[#b42318]">
      {message}
    </p>
  );
}
