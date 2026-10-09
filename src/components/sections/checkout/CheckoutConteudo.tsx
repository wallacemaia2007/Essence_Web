"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { type FieldPath, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Container, ThemedSection } from "@/components/common";
import {
  CheckoutResumo,
  type CheckoutSummaryItem,
} from "@/components/sections/checkout/CheckoutResumo";
import { routes } from "@/constants/routes";
import { CHECKOUT_CEP_STORAGE_KEY } from "@/constants/storage";
import { localizacaoLoja } from "@/data/localizacao";
import { produtosVitrine } from "@/data/vitrine";
import { useCarrinho } from "@/hooks/useCarrinho";
import {
  type CheckoutPaymentMethod,
  createOrder,
  setCheckoutWhatsappMessage,
} from "@/lib/checkout";
import { montarMensagemPedidoWhatsapp } from "@/lib/checkout-whatsapp";
import { formatarPreco } from "@/lib/produto";
import { cn } from "@/lib/utils";

const produtosPorId = new Map(
  produtosVitrine.map((produto) => [produto.id, produto]),
);

function somenteDigitos(value: string) {
  return value.replace(/\D/g, "");
}

function mascararTelefone(value: string) {
  const digits = somenteDigitos(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function mascararCep(value: string) {
  const digits = somenteDigitos(value).slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

function mascararCpf(value: string) {
  const digits = somenteDigitos(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function cpfValido(value: string) {
  const cpf = somenteDigitos(value);
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;

  const calcularDigito = (baseLength: number) => {
    let soma = 0;
    for (let index = 0; index < baseLength; index += 1) {
      soma += Number(cpf[index]) * (baseLength + 1 - index);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    calcularDigito(9) === Number(cpf[9]) &&
    calcularDigito(10) === Number(cpf[10])
  );
}

const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo."),
    email: z.string().trim().email("Informe um e-mail válido."),
    phone: z
      .string()
      .refine(
        (value) => [10, 11].includes(somenteDigitos(value).length),
        "Informe um telefone com DDD.",
      ),
    cpf: z.string().refine((value) => !value || cpfValido(value), {
      message: "Confira o CPF informado.",
    }),
    fulfillmentMethod: z.enum(["delivery", "pickup"]),
    cep: z.string(),
    street: z.string(),
    addressNumber: z.string(),
    complement: z.string(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
    paymentMethod: z.enum(["pix", "card", "boleto"]),
  })
  .superRefine((value, context) => {
    if (value.fulfillmentMethod !== "delivery") return;

    if (somenteDigitos(value.cep).length !== 8) {
      context.addIssue({
        code: "custom",
        path: ["cep"],
        message: "Informe um CEP válido com 8 dígitos.",
      });
    }
    const requiredAddressFields: [keyof typeof value, string][] = [
      ["street", "Informe o nome da rua ou avenida."],
      ["addressNumber", "Informe o número do endereço."],
      ["district", "Informe o bairro."],
      ["city", "Informe a cidade."],
      ["state", "Informe a sigla do estado."],
    ];
    for (const [field, message] of requiredAddressFields) {
      if (!value[field].trim()) {
        context.addIssue({ code: "custom", path: [field], message });
      }
    }
    if (value.state.trim() && value.state.trim().length !== 2) {
      context.addIssue({
        code: "custom",
        path: ["state"],
        message: "Use a sigla do estado com 2 letras.",
      });
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const defaultValues: CheckoutFormValues = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  fulfillmentMethod: "delivery",
  cep: "",
  street: "",
  addressNumber: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  paymentMethod: "pix",
};

const steps = [
  { id: 1, title: "Identificação" },
  { id: 2, title: "Entrega" },
  { id: 3, title: "Pagamento" },
  { id: 4, title: "Revisão" },
] as const;

const paymentMethods: {
  id: CheckoutPaymentMethod;
  title: string;
  description: string;
}[] = [
  {
    id: "pix",
    title: "Pix",
    description: "Pagamento será combinado após a confirmação da loja.",
  },
  {
    id: "card",
    title: "Cartão",
    description:
      "Dados serão solicitados somente pelo gateway seguro, quando integrado.",
  },
  {
    id: "boleto",
    title: "Boleto",
    description: "Disponibilidade e instruções serão confirmadas pela loja.",
  },
];

const fieldClassName =
  "min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#171717] outline-none transition placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/10 aria-invalid:border-red-600";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-2 mb-0 text-xs text-red-700">
      {message}
    </p>
  ) : null;
}

function CheckoutSteps({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progresso da finalização" className="mb-8">
      <ol className="grid grid-cols-4 gap-2">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <li key={step.id} className="min-w-0">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex min-h-12 items-center gap-2 border-b-2 px-1 pb-2 text-xs transition-colors sm:gap-3 sm:px-2",
                  isCurrent || isComplete
                    ? "border-black text-black"
                    : "border-black/10 text-black/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-semibold",
                    isCurrent || isComplete
                      ? "border-black bg-black text-white"
                      : "border-black/20 bg-white",
                  )}
                >
                  {isComplete ? (
                    <Check aria-hidden="true" className="size-3.5" />
                  ) : (
                    step.id
                  )}
                </span>
                <span className="hidden truncate font-medium sm:inline">
                  {step.title}
                </span>
                <span className="sr-only sm:hidden">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 mb-0 text-xs text-black/55 sm:hidden">
        Etapa {currentStep} de 4 · {steps[currentStep - 1].title}
      </p>
    </nav>
  );
}

export function CheckoutConteudo() {
  const { itens, hidratado, limpar } = useCarrinho();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState("");
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");
  const isRedirectingToConfirmation = useRef(false);
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    shouldFocusError: true,
    mode: "onSubmit",
  });

  const linhas: CheckoutSummaryItem[] = useMemo(
    () =>
      itens.flatMap((item) => {
        const product = produtosPorId.get(item.produtoId);
        return product
          ? [
              {
                id: `${item.produtoId}-${item.tamanho}`,
                name: product.nome,
                size: item.tamanho,
                quantity: item.quantidade,
                unitPrice: product.preco ?? null,
              },
            ]
          : [];
      }),
    [itens],
  );
  const subtotal = linhas.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0,
  );
  const hasMissingPrice = linhas.some((item) => item.unitPrice === null);
  const watchedValues = useWatch({ control });
  const fulfillmentMethod = watchedValues.fulfillmentMethod;
  const paymentMethod = watchedValues.paymentMethod;
  const cepValue = watchedValues.cep;
  const freightLabel =
    fulfillmentMethod === "pickup"
      ? "A confirmar com a loja"
      : cepValue
        ? `A confirmar · CEP ${cepValue}`
        : "A confirmar";

  useEffect(() => {
    try {
      const savedCep = window.sessionStorage.getItem(CHECKOUT_CEP_STORAGE_KEY);
      if (savedCep) setValue("cep", mascararCep(savedCep));
    } catch {
      // O CEP é opcional até a etapa de entrega e pode ser digitado novamente.
    }
  }, [setValue]);

  useEffect(() => {
    if (!hidratado || isRedirectingToConfirmation.current) return;

    if (linhas.length === 0) {
      router.replace(`${routes.carrinho}?aviso=checkout-vazio`);
    }
  }, [hidratado, linhas.length, router]);

  const identificationFields: FieldPath<CheckoutFormValues>[] = [
    "name",
    "email",
    "phone",
    "cpf",
  ];
  const deliveryFields: FieldPath<CheckoutFormValues>[] =
    fulfillmentMethod === "delivery"
      ? [
          "fulfillmentMethod",
          "cep",
          "street",
          "addressNumber",
          "district",
          "city",
          "state",
        ]
      : ["fulfillmentMethod"];

  async function goToNextStep() {
    setSubmitError("");
    const fields =
      currentStep === 1
        ? identificationFields
        : currentStep === 2
          ? deliveryFields
          : currentStep === 3
            ? (["paymentMethod"] as FieldPath<CheckoutFormValues>[])
            : [];

    const valid = await trigger(fields, { shouldFocus: true });
    if (valid) setCurrentStep((step) => Math.min(step + 1, 4));
  }

  function goToPreviousStep() {
    setSubmitError("");
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  async function submitOrder(values: CheckoutFormValues) {
    setSubmitError("");
    if (hasMissingPrice) {
      setSubmitError(
        "Há uma peça sem preço cadastrado. Fale com a loja para confirmar antes de finalizar.",
      );
      return;
    }

    try {
      const order = await createOrder({
        customer: {
          name: values.name,
          email: values.email,
          phone: values.phone,
        },
        items: linhas.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? 0,
        })),
        fulfillment:
          values.fulfillmentMethod === "pickup"
            ? { method: "pickup", address: localizacaoLoja.enderecoCompleto }
            : {
                method: "delivery",
                cep: somenteDigitos(values.cep),
                street: values.street.trim(),
                number: values.addressNumber.trim(),
                complement: values.complement.trim(),
                district: values.district.trim(),
                city: values.city.trim(),
                state: values.state.trim().toUpperCase(),
              },
        paymentMethod: values.paymentMethod,
      });

      setCheckoutWhatsappMessage(
        order.id,
        montarMensagemPedidoWhatsapp(order, values.cpf),
      );
      setCreatedOrderNumber(order.number);
      isRedirectingToConfirmation.current = true;
      limpar();
      router.replace(routes.pedidoConfirmacao(order.id));
    } catch {
      setSubmitError(
        "Não foi possível preparar o pedido demonstrativo. Confira os dados e tente novamente.",
      );
    }
  }

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    if (currentStep < 4) {
      await goToNextStep();
      return;
    }

    await handleSubmit(submitOrder)();
  }

  function onCepChange(value: string) {
    const formatted = mascararCep(value);
    setValue("cep", formatted, {
      shouldDirty: true,
      shouldValidate: Boolean(errors.cep),
    });
    try {
      window.sessionStorage.setItem(CHECKOUT_CEP_STORAGE_KEY, formatted);
    } catch {
      // A navegação não depende da persistência temporária do CEP.
    }
  }

  const summaryProps = {
    items: linhas,
    subtotal,
    freightLabel,
    totalLabel: "A confirmar",
    isTotalPending: true,
    isSubtotalPending: hasMissingPrice,
  } as const;

  if (!hidratado || linhas.length === 0) {
    return (
      <ThemedSection className="bg-white py-14 text-[#171717] sm:py-20">
        <Container className="max-w-7xl">
          <div aria-busy="true" className="animate-pulse space-y-5">
            <p role="status" className="sr-only">
              Preparando sua finalização…
            </p>
            <div className="h-8 w-48 rounded-lg bg-black/5" />
            <div className="h-64 rounded-2xl bg-black/5" />
          </div>
        </Container>
      </ThemedSection>
    );
  }

  return (
    <ThemedSection className="bg-white py-10 text-[#171717] sm:py-14 md:py-16">
      <Container className="max-w-7xl">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.68fr)] lg:gap-12">
          <section aria-label="Etapas do pedido" className="min-w-0">
            <CheckoutSteps currentStep={currentStep} />

            <form onSubmit={onFormSubmit} noValidate>
              {currentStep === 1 ? (
                <fieldset
                  className="min-w-0 border-0 p-0"
                  disabled={isSubmitting}
                >
                  <legend className="font-heading text-2xl font-medium">
                    Identificação
                  </legend>
                  <p className="mt-2 mb-6 text-sm leading-6 text-black/55">
                    Precisamos destes dados para organizar o atendimento do seu
                    pedido.
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="checkout-name"
                        className="mb-2 block text-xs font-medium"
                      >
                        Nome completo
                      </label>
                      <input
                        id="checkout-name"
                        autoComplete="name"
                        {...register("name")}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? "checkout-name-error" : undefined
                        }
                        className={fieldClassName}
                        placeholder="Seu nome"
                      />
                      <FieldError
                        id="checkout-name-error"
                        message={errors.name?.message}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="checkout-email"
                        className="mb-2 block text-xs font-medium"
                      >
                        E-mail
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        {...register("email")}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "checkout-email-error" : undefined
                        }
                        className={fieldClassName}
                        placeholder="voce@exemplo.com"
                      />
                      <FieldError
                        id="checkout-email-error"
                        message={errors.email?.message}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="checkout-phone"
                        className="mb-2 block text-xs font-medium"
                      >
                        Telefone com DDD
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        {...register("phone", {
                          onChange: (event) =>
                            setValue(
                              "phone",
                              mascararTelefone(event.target.value),
                              {
                                shouldDirty: true,
                                shouldValidate: Boolean(errors.phone),
                              },
                            ),
                        })}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={
                          errors.phone ? "checkout-phone-error" : undefined
                        }
                        className={fieldClassName}
                        placeholder="(35) 99999-9999"
                      />
                      <FieldError
                        id="checkout-phone-error"
                        message={errors.phone?.message}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="checkout-cpf"
                        className="mb-2 block text-xs font-medium"
                      >
                        CPF{" "}
                        <span className="font-normal text-black/50">
                          (opcional)
                        </span>
                      </label>
                      <input
                        id="checkout-cpf"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={14}
                        {...register("cpf", {
                          onChange: (event) =>
                            setValue("cpf", mascararCpf(event.target.value), {
                              shouldDirty: true,
                              shouldValidate: Boolean(errors.cpf),
                            }),
                        })}
                        aria-invalid={Boolean(errors.cpf)}
                        aria-describedby={
                          errors.cpf
                            ? "checkout-cpf-error"
                            : "checkout-cpf-note"
                        }
                        className={fieldClassName}
                        placeholder="000.000.000-00"
                      />
                      <FieldError
                        id="checkout-cpf-error"
                        message={errors.cpf?.message}
                      />
                      {!errors.cpf ? (
                        <p
                          id="checkout-cpf-note"
                          className="mt-2 mb-0 text-xs text-black/50"
                        >
                          Opcional; não será guardado no pedido demo.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </fieldset>
              ) : null}

              {currentStep === 2 ? (
                <fieldset
                  className="min-w-0 border-0 p-0"
                  disabled={isSubmitting}
                >
                  <legend className="font-heading text-2xl font-medium">
                    Como deseja receber?
                  </legend>
                  <p className="mt-2 mb-6 text-sm leading-6 text-black/55">
                    Valores, frete e prazos serão confirmados pela equipe antes
                    do pagamento.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        [
                          "delivery",
                          "Receber no endereço",
                          "Informe o endereço de destino.",
                        ],
                        [
                          "pickup",
                          "Retirar na loja",
                          "Avenida Comendador Francisco Avelino Maia, 3014, Passos, MG.",
                        ],
                      ] as const
                    ).map(([value, title, description]) => (
                      <label
                        key={value}
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                          fulfillmentMethod === value
                            ? "border-black bg-black/[0.025]"
                            : "border-black/15 hover:border-black/35",
                        )}
                      >
                        <input
                          type="radio"
                          value={value}
                          {...register("fulfillmentMethod")}
                          className="mt-1 size-4 accent-black"
                        />
                        <span>
                          <span className="block text-sm font-semibold">
                            {title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-black/55">
                            {description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.fulfillmentMethod ? (
                    <FieldError
                      id="checkout-fulfillment-error"
                      message={errors.fulfillmentMethod.message}
                    />
                  ) : null}

                  {fulfillmentMethod === "delivery" ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="checkout-cep"
                          className="mb-2 block text-xs font-medium"
                        >
                          CEP
                        </label>
                        <input
                          id="checkout-cep"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          {...register("cep")}
                          maxLength={9}
                          value={cepValue}
                          onChange={(event) => onCepChange(event.target.value)}
                          aria-invalid={Boolean(errors.cep)}
                          aria-describedby={
                            errors.cep
                              ? "checkout-cep-error"
                              : "checkout-cep-note"
                          }
                          className={fieldClassName}
                          placeholder="00000-000"
                        />
                        <FieldError
                          id="checkout-cep-error"
                          message={errors.cep?.message}
                        />
                        {!errors.cep ? (
                          <p
                            id="checkout-cep-note"
                            className="mt-2 mb-0 text-xs text-black/50"
                          >
                            O CEP será enviado para a equipe confirmar a
                            entrega.
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-city"
                          className="mb-2 block text-xs font-medium"
                        >
                          Cidade
                        </label>
                        <input
                          id="checkout-city"
                          autoComplete="address-level2"
                          {...register("city")}
                          aria-invalid={Boolean(errors.city)}
                          aria-describedby={
                            errors.city ? "checkout-city-error" : undefined
                          }
                          className={fieldClassName}
                        />
                        <FieldError
                          id="checkout-city-error"
                          message={errors.city?.message}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="checkout-street"
                          className="mb-2 block text-xs font-medium"
                        >
                          Rua ou avenida
                        </label>
                        <input
                          id="checkout-street"
                          autoComplete="address-line1"
                          {...register("street")}
                          aria-invalid={Boolean(errors.street)}
                          aria-describedby={
                            errors.street ? "checkout-street-error" : undefined
                          }
                          className={fieldClassName}
                          placeholder="Nome da rua ou avenida"
                        />
                        <FieldError
                          id="checkout-street-error"
                          message={errors.street?.message}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-number"
                          className="mb-2 block text-xs font-medium"
                        >
                          Número
                        </label>
                        <input
                          id="checkout-number"
                          autoComplete="off"
                          {...register("addressNumber")}
                          aria-invalid={Boolean(errors.addressNumber)}
                          aria-describedby={
                            errors.addressNumber
                              ? "checkout-number-error"
                              : undefined
                          }
                          className={fieldClassName}
                        />
                        <FieldError
                          id="checkout-number-error"
                          message={errors.addressNumber?.message}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-complement"
                          className="mb-2 block text-xs font-medium"
                        >
                          Complemento{" "}
                          <span className="font-normal text-black/50">
                            (opcional)
                          </span>
                        </label>
                        <input
                          id="checkout-complement"
                          autoComplete="address-line2"
                          {...register("complement")}
                          className={fieldClassName}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-district"
                          className="mb-2 block text-xs font-medium"
                        >
                          Bairro
                        </label>
                        <input
                          id="checkout-district"
                          autoComplete="address-level3"
                          {...register("district")}
                          aria-invalid={Boolean(errors.district)}
                          aria-describedby={
                            errors.district
                              ? "checkout-district-error"
                              : undefined
                          }
                          className={fieldClassName}
                        />
                        <FieldError
                          id="checkout-district-error"
                          message={errors.district?.message}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-state"
                          className="mb-2 block text-xs font-medium"
                        >
                          Estado (UF)
                        </label>
                        <input
                          id="checkout-state"
                          autoComplete="address-level1"
                          maxLength={2}
                          {...register("state")}
                          onChange={(event) =>
                            setValue(
                              "state",
                              event.target.value.toUpperCase(),
                              {
                                shouldDirty: true,
                                shouldValidate: Boolean(errors.state),
                              },
                            )
                          }
                          aria-invalid={Boolean(errors.state)}
                          aria-describedby={
                            errors.state ? "checkout-state-error" : undefined
                          }
                          className={fieldClassName}
                          placeholder="MG"
                        />
                        <FieldError
                          id="checkout-state-error"
                          message={errors.state?.message}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.025] p-5">
                      <div className="flex items-start gap-3">
                        <MapPin
                          aria-hidden="true"
                          className="mt-0.5 size-5 shrink-0"
                        />
                        <div>
                          <p className="m-0 text-sm font-semibold">
                            Retirada na loja Essence
                          </p>
                          <p className="mt-2 mb-0 text-sm leading-6 text-black/65">
                            {localizacaoLoja.enderecoCompleto}
                          </p>
                          <a
                            href={localizacaoLoja.comoChegarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex min-h-9 items-center text-xs font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                          >
                            Como chegar{" "}
                            <span className="sr-only"> (abre em nova aba)</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </fieldset>
              ) : null}

              {currentStep === 3 ? (
                <fieldset
                  className="min-w-0 border-0 p-0"
                  disabled={isSubmitting}
                >
                  <legend className="font-heading text-2xl font-medium">
                    Forma de pagamento
                  </legend>
                  <p className="mt-2 mb-6 text-sm leading-6 text-black/55">
                    Selecione uma preferência. Nenhum pagamento será processado
                    nesta demonstração.
                  </p>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                          paymentMethod === method.id
                            ? "border-black bg-black/[0.025]"
                            : "border-black/15 hover:border-black/35",
                        )}
                      >
                        <input
                          type="radio"
                          value={method.id}
                          {...register("paymentMethod")}
                          className="mt-1 size-4 accent-black"
                        />
                        <span>
                          <span className="block text-sm font-semibold">
                            {method.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-black/55">
                            {method.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">
                    <ShieldCheck
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    <span>
                      Não informe nem digite número de cartão neste site. Quando
                      o gateway for integrado, os dados serão tratados
                      diretamente pelo provedor seguro.
                    </span>
                  </p>
                </fieldset>
              ) : null}

              {currentStep === 4 ? (
                <section aria-labelledby="checkout-review-title">
                  <h2
                    id="checkout-review-title"
                    className="font-heading m-0 text-2xl font-medium"
                  >
                    Revise seu pedido
                  </h2>
                  <p className="mt-2 mb-6 text-sm leading-6 text-black/55">
                    Confira os dados antes de criar o pedido demonstrativo.
                  </p>
                  <div className="space-y-4">
                    <ReviewCard
                      title="Identificação"
                      onEdit={() => setCurrentStep(1)}
                    >
                      <p>{watchedValues.name}</p>
                      <p>{watchedValues.email}</p>
                      <p>{watchedValues.phone}</p>
                    </ReviewCard>
                    <ReviewCard
                      title="Recebimento"
                      onEdit={() => setCurrentStep(2)}
                    >
                      {fulfillmentMethod === "pickup" ? (
                        <p>
                          Retirada na loja: {localizacaoLoja.enderecoCompleto}
                        </p>
                      ) : (
                        <p>
                          {watchedValues.street}, {watchedValues.addressNumber}
                          {watchedValues.complement
                            ? ` · ${watchedValues.complement}`
                            : ""}
                          <br />
                          {watchedValues.district} · {watchedValues.city}/
                          {watchedValues.state} · CEP {watchedValues.cep}
                        </p>
                      )}
                    </ReviewCard>
                    <ReviewCard
                      title="Pagamento"
                      onEdit={() => setCurrentStep(3)}
                    >
                      <p>
                        {
                          paymentMethods.find(
                            (method) => method.id === paymentMethod,
                          )?.title
                        }
                      </p>
                      <p className="text-black/55">
                        Apenas preferência; nenhum pagamento será processado.
                      </p>
                    </ReviewCard>
                  </div>
                  {hasMissingPrice ? (
                    <p
                      role="alert"
                      className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                    >
                      Uma ou mais peças ainda não têm preço cadastrado. O pedido
                      não poderá ser criado até a loja confirmar esses valores.
                    </p>
                  ) : null}
                </section>
              ) : null}

              {submitError ? (
                <p
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                >
                  {submitError}
                  {createdOrderNumber
                    ? ` Referência: ${createdOrderNumber}.`
                    : ""}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/20 px-5 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:opacity-50"
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" /> Voltar
                  </button>
                ) : (
                  <Link
                    href={routes.carrinho}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/20 px-5 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" /> Voltar à
                    sacola
                  </Link>
                )}
                {currentStep < 4 ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-50"
                  >
                    Continuar{" "}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || hasMissingPrice}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-50"
                  >
                    {isSubmitting ? "Preparando pedido…" : "Finalizar pedido"}
                    {!isSubmitting ? (
                      <Check aria-hidden="true" className="size-4" />
                    ) : null}
                  </button>
                )}
              </div>
            </form>
          </section>

          <div className="lg:sticky lg:top-24">
            <details
              className="rounded-2xl border border-black/10 bg-white p-5 lg:hidden"
              open
            >
              <summary className="cursor-pointer list-none font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                <span className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <Package aria-hidden="true" className="size-4" /> Resumo do
                    pedido
                  </span>
                  <span className="text-xs text-black/55">
                    {formatarPreco(subtotal)} + frete a confirmar
                  </span>
                </span>
              </summary>
              <div className="mt-5 border-t border-black/10 pt-5">
                <CheckoutResumo {...summaryProps} />
              </div>
            </details>
            <aside className="hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)] lg:block">
              <CheckoutResumo {...summaryProps} />
            </aside>
          </div>
        </div>
      </Container>
    </ThemedSection>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="m-0 text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-9 items-center text-xs font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Editar
        </button>
      </div>
      <div className="mt-3 space-y-1 text-sm leading-6 text-black/65">
        {children}
      </div>
    </div>
  );
}
