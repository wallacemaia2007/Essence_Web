"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Heart,
  Home,
  LoaderCircle,
  Mail,
  MapPin,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDemoAuth } from "@/components/auth/DemoAuthProvider";
import { routes } from "@/constants/routes";
import {
  DEMO_ACCOUNT_AVATAR,
  type DemoAddress,
  type DemoAddressLabel,
  getDemoAccount,
  normalizeDemoEmail,
} from "@/lib/demo-auth";

const inputClassName =
  "min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#171717] outline-none transition placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/10 aria-invalid:border-red-600";
const labelClassName = "mb-2 block text-xs font-medium text-black/70";
const buttonPrimaryClassName =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#171512] px-5 text-xs font-semibold tracking-wide text-white transition hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50";
const buttonSecondaryClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/20 px-4 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-45";

const supportedAvatarTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarFileSize = 8 * 1024 * 1024;
const maxAvatarDimension = 512;
const addressLabels: DemoAddressLabel[] = ["Casa", "Trabalho", "Outro"];
const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

const addressFieldClassName =
  "min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#171717] outline-none transition placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/10";

const emptyAddress = (): Omit<DemoAddress, "id" | "isDefault"> => ({
  label: "Casa",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  reference: "",
});

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
};

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function createAddressId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `endereco-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function prepareAvatar(file: File) {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(
      1,
      maxAvatarDimension / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponível.");

    context.drawImage(bitmap, 0, 0, width, height);
    const webp = canvas.toDataURL("image/webp", 0.82);

    return webp.startsWith("data:image/webp")
      ? webp
      : canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    bitmap.close();
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContaConteudo() {
  const { user, updateUser } = useDemoAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const addressFormRef = useRef<HTMLFormElement>(null);
  const cepRequestRef = useRef<AbortController | null>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarMessage, setAvatarMessage] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState("");
  const [addressMessage, setAddressMessage] = useState("");
  const [cepError, setCepError] = useState("");
  const [cepMessage, setCepMessage] = useState("");
  const [lookingUpCep, setLookingUpCep] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(
    () => () => {
      cepRequestRef.current?.abort();
    },
    [],
  );

  if (!user) return null;
  const activeUser = user;
  const addresses = user.addresses ?? [];

  function showProfileMessage(message: string) {
    setProfileMessage(message);
    setProfileError("");
  }

  function salvarPerfil(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileMessage("");

    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanEmail = normalizeDemoEmail(email);
    const phoneDigits = phone.replace(/\D/g, "");
    if (cleanName.length < 3) {
      setProfileError(
        "Informe seu nome completo, com pelo menos 3 caracteres.",
      );
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(cleanEmail)) {
      setProfileError("Informe um e-mail válido para sua conta.");
      return;
    }
    if (
      cleanEmail !== normalizeDemoEmail(activeUser.email) &&
      getDemoAccount(cleanEmail)
    ) {
      setProfileError(
        "Esse e-mail já está associado a outra conta neste navegador.",
      );
      return;
    }
    if (phoneDigits.length > 0 && phoneDigits.length < 10) {
      setProfileError("Confira o telefone com DDD ou deixe o campo em branco.");
      return;
    }
    if (birthDate && birthDate > new Date().toISOString().slice(0, 10)) {
      setProfileError("A data de nascimento não pode ser futura.");
      return;
    }

    setSavingProfile(true);
    const saved = updateUser({
      ...activeUser,
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim(),
      birthDate,
    });
    setSavingProfile(false);
    setProfileError("");
    showProfileMessage(
      saved
        ? "Seus dados foram salvos neste navegador."
        : "Dados atualizados nesta sessão, mas o navegador não permitiu salvá-los permanentemente.",
    );
  }

  async function atualizarFoto(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    input.value = "";

    setAvatarError("");
    setAvatarMessage("");

    if (!supportedAvatarTypes.has(file.type)) {
      setAvatarError("Escolha uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > maxAvatarFileSize) {
      setAvatarError("A imagem deve ter no máximo 8 MB.");
      return;
    }

    setSavingAvatar(true);
    try {
      const avatarUrl = await prepareAvatar(file);
      const saved = updateUser({ ...activeUser, avatarUrl });
      setAvatarMessage(
        saved
          ? "Foto atualizada e salva neste navegador."
          : "Foto atualizada nesta sessão, mas o navegador não permitiu salvá-la permanentemente.",
      );
    } catch {
      setAvatarError(
        "Não foi possível abrir essa imagem. Tente outro arquivo.",
      );
    } finally {
      setSavingAvatar(false);
    }
  }

  function alterarCep(value: string) {
    cepRequestRef.current?.abort();
    cepRequestRef.current = null;
    setLookingUpCep(false);
    setCepError("");
    setCepMessage("");
    setAddressError("");
    setAddressDraft((current) => ({
      ...current,
      cep: formatCep(value),
      street: "",
      neighborhood: "",
      city: "",
      state: "",
    }));
  }

  async function buscarCep() {
    const digits = addressDraft.cep.replace(/\D/g, "");
    setCepError("");
    setCepMessage("");

    if (digits.length !== 8) {
      setCepError("Digite um CEP válido com 8 números.");
      return;
    }

    cepRequestRef.current?.abort();
    const controller = new AbortController();
    cepRequestRef.current = controller;
    setLookingUpCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Falha na consulta do CEP.");

      const result = (await response.json()) as ViaCepResponse;
      if (result.erro === true || result.erro === "true") {
        setCepError("Não encontramos esse CEP.");
        return;
      }
      if (!result.localidade || !result.uf) {
        throw new Error("Resposta incompleta do ViaCEP.");
      }

      setAddressDraft((current) => ({
        ...current,
        cep: formatCep(result.cep ?? digits),
        street: result.logradouro ?? current.street,
        complement: current.complement || result.complemento || "",
        neighborhood: result.bairro ?? current.neighborhood,
        city: result.localidade ?? current.city,
        state: result.uf?.toUpperCase() ?? current.state,
      }));
      setCepMessage("Endereço encontrado.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setCepError(
        "Não foi possível consultar o ViaCEP agora. Você pode preencher o endereço manualmente.",
      );
    } finally {
      if (cepRequestRef.current === controller) {
        cepRequestRef.current = null;
        setLookingUpCep(false);
      }
    }
  }

  function atualizarCampoEndereco<
    K extends keyof ReturnType<typeof emptyAddress>,
  >(field: K, value: ReturnType<typeof emptyAddress>[K]) {
    setAddressDraft((current) => ({ ...current, [field]: value }));
    setAddressError("");
    setAddressMessage("");
  }

  function iniciarEdicao(address: DemoAddress) {
    cepRequestRef.current?.abort();
    setEditingAddressId(address.id);
    setAddressDraft({
      label: address.label,
      cep: address.cep,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      reference: address.reference,
    });
    setAddressError("");
    setAddressMessage("");
    setCepError("");
    setCepMessage("");
    addressFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function cancelarEdicao() {
    setEditingAddressId(null);
    setAddressDraft(emptyAddress());
    setAddressError("");
    setAddressMessage("");
    setCepError("");
    setCepMessage("");
  }

  function salvarEndereco(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddressError("");
    setAddressMessage("");

    const cepDigits = addressDraft.cep.replace(/\D/g, "");
    const street = addressDraft.street.trim();
    const number = addressDraft.number.trim();
    const neighborhood = addressDraft.neighborhood.trim();
    const city = addressDraft.city.trim();
    const state = addressDraft.state.trim().toUpperCase();

    if (cepDigits.length !== 8) {
      setAddressError("Informe um CEP válido com 8 números.");
      return;
    }
    if (
      !street ||
      !number ||
      !neighborhood ||
      !city ||
      !brazilianStates.includes(state as (typeof brazilianStates)[number])
    ) {
      setAddressError(
        "Preencha rua, número, bairro, cidade e UF antes de salvar.",
      );
      return;
    }

    setSavingAddress(true);
    const currentAddress = addresses.find(
      (address) => address.id === editingAddressId,
    );
    const nextAddress: DemoAddress = {
      id: editingAddressId ?? createAddressId(),
      label: addressDraft.label,
      cep: formatCep(addressDraft.cep),
      street,
      number,
      complement: addressDraft.complement.trim(),
      neighborhood,
      city,
      state,
      reference: addressDraft.reference.trim(),
      isDefault: currentAddress?.isDefault ?? addresses.length === 0,
    };
    const nextAddresses = editingAddressId
      ? addresses.map((address) =>
          address.id === editingAddressId ? nextAddress : address,
        )
      : [...addresses, nextAddress];
    const saved = updateUser({ ...activeUser, addresses: nextAddresses });
    setSavingAddress(false);
    setEditingAddressId(null);
    setAddressDraft(emptyAddress());
    setAddressError("");
    setAddressMessage(
      saved
        ? editingAddressId
          ? "Endereço atualizado e salvo."
          : "Endereço adicionado e salvo."
        : "Endereço atualizado nesta sessão, mas o navegador não permitiu salvá-lo permanentemente.",
    );
    setCepError("");
    setCepMessage("");
  }

  function definirEnderecoPrincipal(id: string) {
    const nextAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));
    const saved = updateUser({ ...activeUser, addresses: nextAddresses });
    setAddressMessage(
      saved
        ? "Endereço principal atualizado."
        : "Endereço principal atualizado nesta sessão, mas não foi possível salvá-lo permanentemente.",
    );
  }

  function removerEndereco(address: DemoAddress) {
    if (!window.confirm(`Remover o endereço ${address.label}?`)) return;

    const remaining = addresses.filter((item) => item.id !== address.id);
    if (address.isDefault && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    const saved = updateUser({ ...activeUser, addresses: remaining });
    if (editingAddressId === address.id) cancelarEdicao();
    setAddressMessage(
      saved
        ? "Endereço removido."
        : "Endereço removido desta sessão, mas o navegador não permitiu salvar a alteração.",
    );
  }

  return (
    <div className="space-y-7 pb-8">
      <section
        aria-label="Resumo da conta"
        className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#191714] p-6 text-white shadow-[0_18px_50px_rgba(23,21,18,0.12)] sm:p-8"
      >
        <div
          aria-hidden="true"
          className="absolute -top-28 -right-16 -z-10 size-72 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-4 -bottom-48 -z-10 size-80 rounded-full border border-white/10"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Image
              src={user.avatarUrl || DEMO_ACCOUNT_AVATAR}
              alt={`Foto de perfil de ${user.name}`}
              width={80}
              height={80}
              unoptimized
              className="size-16 shrink-0 rounded-full border-2 border-white/25 object-cover sm:size-20"
            />
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.2em] text-white/55 uppercase">
                Minha Essence
              </p>
              <h2 className="font-heading mt-1 mb-1 truncate text-2xl font-medium sm:text-3xl">
                Olá, {user.name.trim().split(/\s+/)[0] || "cliente"}
              </h2>
              <p className="m-0 flex items-center gap-2 truncate text-sm text-white/65">
                <Mail aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 border-t border-white/15 pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            <div className="min-w-20">
              <p className="m-0 text-2xl font-semibold">{addresses.length}</p>
              <p className="m-0 text-xs text-white/55">
                {addresses.length === 1 ? "endereço salvo" : "endereços salvos"}
              </p>
            </div>
            <span aria-hidden="true" className="h-10 w-px bg-white/15" />
            <div>
              <p className="m-0 text-sm font-semibold">Conta ativa</p>
              <p className="m-0 text-xs text-white/55">Perfil demonstrativo</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-7">
          <section
            aria-labelledby="dados-pessoais-titulo"
            className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_28px_rgba(23,21,18,0.035)] sm:p-7"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f4f1eb]">
                <UserRound aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-black/50 uppercase">
                  Seu perfil
                </p>
                <h2
                  id="dados-pessoais-titulo"
                  className="font-heading m-0 mt-1 text-2xl font-medium"
                >
                  Dados pessoais
                </h2>
                <p className="mt-1 mb-0 text-sm leading-6 text-black/55">
                  Mantenha suas informações atualizadas para facilitar suas
                  compras.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-[#f8f6f2] p-4 sm:flex-row sm:items-center sm:p-5">
              <Image
                src={user.avatarUrl || DEMO_ACCOUNT_AVATAR}
                alt={`Foto de perfil de ${user.name}`}
                width={88}
                height={88}
                unoptimized
                className="size-22 shrink-0 rounded-full border border-black/10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="m-0 text-sm font-semibold">Sua foto</h3>
                <p className="mt-1 mb-3 text-xs leading-5 text-black/55">
                  JPG, PNG ou WebP de até 8 MB.
                </p>
                <label
                  htmlFor="conta-foto-perfil"
                  className="mb-2 block text-xs font-medium text-black/70"
                >
                  Alterar foto de perfil
                </label>
                <input
                  ref={avatarInputRef}
                  id="conta-foto-perfil"
                  name="profilePhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={savingAvatar}
                  onChange={atualizarFoto}
                  aria-invalid={Boolean(avatarError)}
                  aria-describedby="conta-foto-ajuda"
                  className="block w-full max-w-md cursor-pointer text-xs text-black/60 file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#171717] file:px-4 file:text-xs file:font-semibold file:text-white file:transition hover:file:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60"
                />
                <p
                  id="conta-foto-ajuda"
                  className="mt-2 mb-0 text-xs leading-5 text-black/50"
                >
                  {savingAvatar
                    ? "Atualizando foto…"
                    : "A foto fica salva no perfil deste navegador."}
                </p>
                {avatarError ? (
                  <p role="alert" className="mt-2 mb-0 text-xs text-red-700">
                    {avatarError}
                  </p>
                ) : null}
                {avatarMessage ? (
                  <p role="status" className="mt-2 mb-0 text-xs text-green-800">
                    {avatarMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <form onSubmit={salvarPerfil} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nome completo" htmlFor="conta-nome">
                  <input
                    id="conta-nome"
                    name="name"
                    type="text"
                    autoComplete="name"
                    minLength={3}
                    maxLength={100}
                    required
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setProfileError("");
                      setProfileMessage("");
                    }}
                    className={inputClassName}
                  />
                </Field>
                <Field label="Telefone com DDD" htmlFor="conta-telefone">
                  <input
                    id="conta-telefone"
                    name="telephone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={16}
                    value={phone}
                    onChange={(event) => {
                      setPhone(formatPhone(event.target.value));
                      setProfileError("");
                      setProfileMessage("");
                    }}
                    placeholder="(35) 99999-9999"
                    className={inputClassName}
                  />
                </Field>
                <Field label="Data de nascimento" htmlFor="conta-nascimento">
                  <div className="relative">
                    <CalendarDays
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-black/45"
                    />
                    <input
                      id="conta-nascimento"
                      name="birthDate"
                      type="date"
                      autoComplete="bday"
                      max={new Date().toISOString().slice(0, 10)}
                      value={birthDate}
                      onChange={(event) => {
                        setBirthDate(event.target.value);
                        setProfileError("");
                        setProfileMessage("");
                      }}
                      className={`${inputClassName} pl-11`}
                    />
                  </div>
                </Field>
                <Field label="E-mail da conta" htmlFor="conta-email">
                  <input
                    id="conta-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setProfileError("");
                      setProfileMessage("");
                    }}
                    aria-describedby="conta-email-ajuda"
                    className={inputClassName}
                  />
                </Field>
              </div>

              {profileError ? (
                <p role="alert" className="m-0 text-sm text-red-700">
                  {profileError}
                </p>
              ) : null}
              {profileMessage ? (
                <p role="status" className="m-0 text-sm text-green-800">
                  {profileMessage}
                </p>
              ) : null}

              <div className="gap-3 border-t border-black/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className={buttonPrimaryClassName}
                >
                  {savingProfile ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <Check aria-hidden="true" className="size-4" />
                  )}
                  Salvar dados
                </button>
              </div>
            </form>
          </section>

          <section
            aria-labelledby="enderecos-titulo"
            className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_28px_rgba(23,21,18,0.035)] sm:p-7"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f4f1eb]">
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
                    Seus endereços
                  </h2>
                  <p className="mt-1 mb-0 text-sm leading-6 text-black/55">
                    Salve locais de entrega e escolha seu endereço principal.
                  </p>
                </div>
              </div>
              <span className="inline-flex min-h-8 shrink-0 items-center self-start rounded-full bg-[#f4f1eb] px-3 text-xs font-medium text-black/65">
                {addresses.length} {addresses.length === 1 ? "salvo" : "salvos"}
              </span>
            </div>

            {addresses.length > 0 ? (
              <ul className="mt-6 grid gap-3">
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className="rounded-2xl border border-black/10 p-4 transition hover:border-black/20 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f8f6f2]">
                          {address.label === "Casa" ? (
                            <Home aria-hidden="true" className="size-4" />
                          ) : (
                            <MapPin aria-hidden="true" className="size-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="m-0 text-sm font-semibold">
                              {address.label}
                            </h3>
                            {address.isDefault ? (
                              <span className="inline-flex min-h-6 items-center rounded-full bg-[#ede8df] px-2.5 text-[0.65rem] font-semibold text-[#51483d]">
                                Principal
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 mb-0 text-sm leading-6 text-black/65">
                            {address.street}, {address.number}
                            {address.complement
                              ? ` — ${address.complement}`
                              : ""}
                          </p>
                          <p className="m-0 text-sm leading-6 text-black/55">
                            {address.neighborhood} · {address.city}/
                            {address.state}
                          </p>
                          <p className="m-0 text-xs text-black/45">
                            CEP {address.cep}
                            {address.reference
                              ? ` · Ref.: ${address.reference}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerEndereco(address)}
                        aria-label={`Remover endereço ${address.label}`}
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-black/55 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-black/8 pt-3">
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(address)}
                        className={buttonSecondaryClassName}
                      >
                        <Pencil aria-hidden="true" className="size-3.5" />
                        Editar
                      </button>
                      {!address.isDefault ? (
                        <button
                          type="button"
                          onClick={() => definirEnderecoPrincipal(address.id)}
                          className={buttonSecondaryClassName}
                        >
                          Definir como principal
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-[#fcfbf9] px-5 py-7 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#f4f1eb]">
                  <MapPin aria-hidden="true" className="size-5 text-black/60" />
                </span>
                <h3 className="mt-3 mb-0 text-sm font-semibold">
                  Nenhum endereço salvo ainda
                </h3>
                <p className="mx-auto mt-1 mb-0 max-w-sm text-sm leading-6 text-black/55">
                  Cadastre seu primeiro endereço. Com o CEP, a rua e a cidade
                  podem ser preenchidas automaticamente.
                </p>
              </div>
            )}

            {addressMessage ? (
              <p role="status" className="mt-4 mb-0 text-sm text-green-800">
                {addressMessage}
              </p>
            ) : null}

            <form
              ref={addressFormRef}
              onSubmit={salvarEndereco}
              className="mt-7 rounded-2xl bg-[#f8f6f2] p-4 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="m-0 text-base font-semibold">
                    {editingAddressId
                      ? "Editar endereço"
                      : "Adicionar endereço"}
                  </h3>
                  <p className="mt-1 mb-0 text-xs leading-5 text-black/55">
                    Preencha o CEP e consulte o ViaCEP para agilizar o cadastro.
                  </p>
                </div>
                {editingAddressId ? (
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    aria-label="Cancelar edição do endereço"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-black/55 transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Identificação" htmlFor="endereco-identificacao">
                  <select
                    id="endereco-identificacao"
                    name="addressLabel"
                    value={addressDraft.label}
                    onChange={(event) =>
                      atualizarCampoEndereco(
                        "label",
                        event.target.value as DemoAddressLabel,
                      )
                    }
                    className={addressFieldClassName}
                  >
                    {addressLabels.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="CEP" htmlFor="endereco-cep">
                  <div className="flex gap-2">
                    <input
                      id="endereco-cep"
                      name="postalCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={9}
                      value={addressDraft.cep}
                      onChange={(event) => alterarCep(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void buscarCep();
                        }
                      }}
                      placeholder="00000-000"
                      aria-invalid={Boolean(cepError)}
                      aria-describedby="endereco-cep-ajuda"
                      className={`${addressFieldClassName} min-w-0 flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => void buscarCep()}
                      disabled={lookingUpCep}
                      className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-black/20 bg-white px-3 text-xs font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60 sm:px-4"
                    >
                      {lookingUpCep ? (
                        <LoaderCircle
                          aria-hidden="true"
                          className="size-4 animate-spin"
                        />
                      ) : (
                        <Search aria-hidden="true" className="size-4" />
                      )}
                      <span className="hidden sm:inline">
                        {lookingUpCep ? "Buscando" : "Buscar"}
                      </span>
                    </button>
                  </div>
                  <p
                    id="endereco-cep-ajuda"
                    className="mt-2 mb-0 text-xs leading-5 text-black/45"
                  >
                    Digite os 8 números e selecione Buscar.
                  </p>
                  {cepError ? (
                    <p role="alert" className="mt-2 mb-0 text-xs text-red-700">
                      {cepError}
                    </p>
                  ) : null}
                  {cepMessage ? (
                    <p
                      role="status"
                      className="mt-2 mb-0 text-xs text-green-800"
                    >
                      {cepMessage}
                    </p>
                  ) : null}
                </Field>

                <Field label="Rua / Logradouro" htmlFor="endereco-rua">
                  <input
                    id="endereco-rua"
                    name="streetAddress"
                    type="text"
                    autoComplete="address-line1"
                    maxLength={120}
                    value={addressDraft.street}
                    onChange={(event) =>
                      atualizarCampoEndereco("street", event.target.value)
                    }
                    placeholder="Rua, avenida, travessa…"
                    className={addressFieldClassName}
                  />
                </Field>
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-3">
                  <Field label="Número" htmlFor="endereco-numero">
                    <input
                      id="endereco-numero"
                      name="addressNumber"
                      type="text"
                      autoComplete="address-line2"
                      maxLength={20}
                      required
                      value={addressDraft.number}
                      onChange={(event) =>
                        atualizarCampoEndereco("number", event.target.value)
                      }
                      placeholder="Nº ou S/N"
                      className={addressFieldClassName}
                    />
                  </Field>
                  <Field label="Complemento" htmlFor="endereco-complemento">
                    <input
                      id="endereco-complemento"
                      name="addressComplement"
                      type="text"
                      maxLength={80}
                      value={addressDraft.complement}
                      onChange={(event) =>
                        atualizarCampoEndereco("complement", event.target.value)
                      }
                      placeholder="Apto, bloco, sala…"
                      className={addressFieldClassName}
                    />
                  </Field>
                </div>
                <Field label="Bairro" htmlFor="endereco-bairro">
                  <input
                    id="endereco-bairro"
                    name="addressNeighborhood"
                    type="text"
                    autoComplete="address-level3"
                    maxLength={80}
                    value={addressDraft.neighborhood}
                    onChange={(event) =>
                      atualizarCampoEndereco("neighborhood", event.target.value)
                    }
                    className={addressFieldClassName}
                  />
                </Field>
                <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-3">
                  <Field label="Cidade" htmlFor="endereco-cidade">
                    <input
                      id="endereco-cidade"
                      name="addressCity"
                      type="text"
                      autoComplete="address-level2"
                      maxLength={80}
                      value={addressDraft.city}
                      onChange={(event) =>
                        atualizarCampoEndereco("city", event.target.value)
                      }
                      className={addressFieldClassName}
                    />
                  </Field>
                  <Field label="UF" htmlFor="endereco-uf">
                    <select
                      id="endereco-uf"
                      name="addressRegion"
                      autoComplete="address-level1"
                      value={addressDraft.state}
                      onChange={(event) =>
                        atualizarCampoEndereco(
                          "state",
                          event.target.value.toUpperCase(),
                        )
                      }
                      className={addressFieldClassName}
                    >
                      <option value="">UF</option>
                      {brazilianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field
                  label="Referência (opcional)"
                  htmlFor="endereco-referencia"
                >
                  <input
                    id="endereco-referencia"
                    name="addressReference"
                    type="text"
                    maxLength={100}
                    value={addressDraft.reference}
                    onChange={(event) =>
                      atualizarCampoEndereco("reference", event.target.value)
                    }
                    placeholder="Próximo à praça, portão azul…"
                    className={addressFieldClassName}
                  />
                </Field>
              </div>

              {addressError ? (
                <p role="alert" className="mt-4 mb-0 text-sm text-red-700">
                  {addressError}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 max-w-sm text-xs leading-5 text-black/45">
                  Endereços salvos ficam associados a esta conta neste
                  navegador.
                </p>
                <div className="flex flex-wrap gap-2">
                  {editingAddressId ? (
                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      className={buttonSecondaryClassName}
                    >
                      Cancelar
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className={buttonPrimaryClassName}
                  >
                    {savingAddress ? (
                      <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                      />
                    ) : editingAddressId ? (
                      <Check aria-hidden="true" className="size-4" />
                    ) : (
                      <Plus aria-hidden="true" className="size-4" />
                    )}
                    {editingAddressId ? "Salvar alterações" : "Salvar endereço"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section
            aria-labelledby="atalhos-conta-titulo"
            className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_28px_rgba(23,21,18,0.035)]"
          >
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] text-black/50 uppercase">
              Para você
            </p>
            <h2
              id="atalhos-conta-titulo"
              className="font-heading mt-1 mb-4 text-xl font-medium"
            >
              Acesse rápido
            </h2>
            <div className="space-y-2">
              <Link
                href={routes.pedidos}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-black/8 px-3.5 transition hover:border-black/20 hover:bg-[#fcfbf9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#f4f1eb]">
                    <Package aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Meus pedidos
                    </span>
                    <span className="block text-xs text-black/50">
                      Acompanhe suas compras
                    </span>
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 text-black/40 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href={routes.favoritos}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-black/8 px-3.5 transition hover:border-black/20 hover:bg-[#fcfbf9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#f4f1eb]">
                    <Heart aria-hidden="true" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      Meus favoritos
                    </span>
                    <span className="block text-xs text-black/50">
                      Peças que você salvou
                    </span>
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 text-black/40 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e9e4da] bg-[#f8f6f2] p-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-white">
              <ShieldCheck
                aria-hidden="true"
                className="size-5 text-[#51483d]"
              />
            </span>
            <h2 className="mt-3 mb-0 text-sm font-semibold">
              Seus dados, com cuidado
            </h2>
            <p className="mt-1 mb-0 text-xs leading-5 text-black/55">
              Esta versão demonstra a conta no navegador. Perfil e endereços não
              são enviados para um servidor nem sincronizados entre
              dispositivos.
            </p>
            <Link
              href={routes.politicaPrivacidade}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#51483d] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Política de privacidade
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </section>

          <p className="px-1 text-xs leading-5 text-black/45">
            Precisa de ajuda com sua conta?{" "}
            <Link
              href={routes.contato}
              className="font-semibold text-black/70 underline underline-offset-2 hover:text-black"
            >
              Fale com a Essence
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
