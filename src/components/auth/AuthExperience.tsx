"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { routes } from "@/constants/routes";

export type AuthMode = "login" | "register" | "forgot" | "verify" | "reset";
export type DemoFlow = "login" | "register" | "google" | "recovery";

type AuthExperienceProps = {
  mode: AuthMode;
  initialEmail?: string;
  initialFlow?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const codePattern = /^\d{6}$/;
const verifiedDemoEmailsKey = "essence-demo-verified-emails";
const demoGoogleEmail = "google@exemplo.com";

function readVerifiedDemoEmails(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(verifiedDemoEmailsKey);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function isDemoEmailVerified(email: string) {
  return readVerifiedDemoEmails().includes(email);
}

function markDemoEmailVerified(email: string) {
  if (!email || typeof window === "undefined") return;

  const verifiedEmails = new Set(readVerifiedDemoEmails());
  verifiedEmails.add(email);

  try {
    window.localStorage.setItem(
      verifiedDemoEmailsKey,
      JSON.stringify([...verifiedEmails]),
    );
  } catch {
    // O fluxo continua demonstrativo mesmo quando o navegador bloqueia storage.
  }
}

const passwordRules = [
  {
    id: "length",
    label: "Pelo menos 8 caracteres",
    test: (value: string) => value.length >= 8,
  },
  {
    id: "upper",
    label: "Uma letra maiúscula",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lower",
    label: "Uma letra minúscula",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "Um número",
    test: (value: string) => /\d/.test(value),
  },
  {
    id: "special",
    label: "Um caractere especial",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

const copyByMode: Record<AuthMode, { title: string; description: string }> = {
  login: {
    title: "Entre na sua conta",
    description:
      "Acesse sua área Essence com seu e-mail ou continue com o Google.",
  },
  register: {
    title: "Crie sua conta",
    description:
      "Preencha seus dados para acompanhar suas escolhas e novidades.",
  },
  forgot: {
    title: "Esqueceu sua senha?",
    description:
      "Informe seu e-mail para avançar para a etapa de código demonstrativo.",
  },
  verify: {
    title: "Confirme seu e-mail",
    description:
      "Digite os seis números do código para continuar neste fluxo de demonstração.",
  },
  reset: {
    title: "Crie uma nova senha",
    description:
      "Escolha uma senha forte e confirme para concluir a demonstração.",
  },
};

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.6a5.85 5.85 0 0 1 0-3.2V7.87H3.3a9.75 9.75 0 0 0 0 8.26l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.37c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.37l3.24 2.53C7.31 8.09 9.46 6.37 12 6.37Z"
      />
    </svg>
  );
}

function isDemoFlow(value: string | undefined): value is DemoFlow {
  return (
    value === "login" ||
    value === "register" ||
    value === "google" ||
    value === "recovery"
  );
}

function verificationHref(email: string, flow: DemoFlow) {
  const params = new URLSearchParams({ email, flow });
  return `${routes.verifyCode}?${params.toString()}`;
}

export function AuthExperience({
  mode,
  initialEmail = "",
  initialFlow,
}: AuthExperienceProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendNotice, setResendNotice] = useState("");
  const [complete, setComplete] = useState(false);
  const flow = isDemoFlow(initialFlow) ? initialFlow : "login";
  const pageCopy = copyByMode[mode];
  const normalizedEmail = email.trim().toLowerCase();
  const passwordValidity = passwordRules.map((rule) => ({
    ...rule,
    valid: rule.test(password),
  }));

  function setFieldError(field: string, message?: string) {
    setErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function validateEmail() {
    return emailPattern.test(normalizedEmail);
  }

  function validatePassword(value: string) {
    return passwordRules.every((rule) => rule.test(value));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (
      (mode === "login" || mode === "register" || mode === "forgot") &&
      !validateEmail()
    ) {
      nextErrors.email = "Digite um e-mail válido, como voce@gmail.com.";
    }

    if (mode === "login" && password.trim().length < 6) {
      nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (mode === "register") {
      if (fullName.trim().length < 3) {
        nextErrors.fullName =
          "Informe seu nome completo (mínimo de 3 caracteres).";
      }
      if (!validatePassword(password)) {
        nextErrors.password =
          "Sua senha ainda não atende a todos os requisitos.";
      }
      if (confirmPassword !== password) {
        nextErrors.confirmPassword = "As senhas precisam ser iguais.";
      }
      if (!acceptedTerms) {
        nextErrors.terms = "Você precisa aceitar os termos para continuar.";
      }
    }

    if (mode === "verify" && !codePattern.test(code)) {
      nextErrors.code = "Digite os 6 números do código.";
    }

    if (mode === "reset") {
      if (!validatePassword(password)) {
        nextErrors.password =
          "Sua senha ainda não atende a todos os requisitos.";
      }
      if (confirmPassword !== password) {
        nextErrors.confirmPassword = "As senhas precisam ser iguais.";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (mode === "login") {
      if (isDemoEmailVerified(normalizedEmail)) {
        setComplete(true);
        return;
      }
      router.push(verificationHref(normalizedEmail, "login"));
      return;
    }

    if (mode === "register") {
      router.push(verificationHref(normalizedEmail, "register"));
      return;
    }

    if (mode === "forgot") {
      router.push(verificationHref(normalizedEmail, "recovery"));
      return;
    }

    if (mode === "verify") {
      if (flow === "recovery") {
        router.push(
          `${routes.resetPassword}?email=${encodeURIComponent(normalizedEmail)}`,
        );
        return;
      }
      markDemoEmailVerified(normalizedEmail);
      setComplete(true);
      return;
    }

    if (mode === "reset") {
      markDemoEmailVerified(normalizedEmail);
    }
    setComplete(true);
  }

  function startGoogleDemo() {
    if (mode === "login" && isDemoEmailVerified(demoGoogleEmail)) {
      setComplete(true);
      return;
    }
    router.push(verificationHref(demoGoogleEmail, "google"));
  }

  if (complete) {
    const isPasswordReset = mode === "reset";
    const isExistingLogin = mode === "login";
    return (
      <div className="py-5 text-center sm:py-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f2efe9] text-[#7a5d3d]">
          <Check aria-hidden="true" className="size-6" />
        </div>
        <p className="mt-6 mb-2 text-[0.65rem] font-semibold tracking-[0.2em] text-[#8a6746] uppercase">
          {isPasswordReset
            ? "SENHA ATUALIZADA"
            : isExistingLogin
              ? "ACESSO DEMONSTRATIVO"
              : "CÓDIGO ACEITO"}
        </p>
        <h2 className="font-heading m-0 text-3xl font-medium tracking-tight text-[#171512]">
          {isPasswordReset
            ? "Tudo pronto para recomeçar."
            : isExistingLogin
              ? "Seu e-mail já está confirmado."
              : "Confirmação concluída."}
        </h2>
        <p className="mx-auto mt-3 mb-0 max-w-sm text-sm leading-6 text-[#686158]">
          {isPasswordReset
            ? "Sua senha foi atualizada apenas nesta demonstração visual. Nenhuma alteração foi salva."
            : isExistingLogin
              ? "A etapa de código foi pulada porque este navegador já marcou o e-mail como confirmado. O login continua sendo apenas uma simulação."
              : "Este passo foi simulado no frontend. Nenhum código foi enviado e nenhuma conta foi criada."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={isPasswordReset ? routes.login : routes.home}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#171512] px-6 text-xs font-semibold tracking-[0.12em] text-white uppercase transition hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
          >
            {isPasswordReset ? "Ir para o login" : "Voltar para a loja"}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {mode !== "login" && (
        <Link
          href={
            mode === "register"
              ? routes.login
              : mode === "reset"
                ? routes.verifyCode
                : routes.login
          }
          className="mb-7 inline-flex min-h-9 items-center gap-2 text-xs font-medium tracking-wide text-[#686158] transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar
        </Link>
      )}

      <h2 className="font-heading m-0 text-[clamp(1.9rem,4vw,2.55rem)] leading-tight font-medium tracking-[-0.02em] text-[#171512]">
        {pageCopy.title}
      </h2>
      <p className="mt-2 mb-7 text-left text-sm leading-6 text-[#686158]">
        {pageCopy.description}
      </p>
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        {(mode === "login" || mode === "register" || mode === "forgot") && (
          <div>
            <label
              htmlFor="auth-email"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#39332d]"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8a8176]"
              />
              <input
                id="auth-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldError("email");
                }}
                onBlur={() => {
                  if (email && !validateEmail())
                    setFieldError("email", "Digite um e-mail válido.");
                }}
                placeholder="voce@gmail.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "auth-email-error" : undefined}
                className="min-h-12 w-full rounded-xl border border-[#171512]/15 bg-white pr-4 pl-11 text-sm text-[#171512] transition outline-none placeholder:text-[#a49d94] focus:border-[#8a6746] focus:ring-2 focus:ring-[#8a6746]/15 aria-invalid:border-red-500"
              />
            </div>
            {errors.email && (
              <p
                id="auth-email-error"
                role="alert"
                className="mt-2 text-xs text-red-700"
              >
                {errors.email}
              </p>
            )}
          </div>
        )}

        {mode === "register" && (
          <div>
            <label
              htmlFor="auth-name"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#39332d]"
            >
              Nome completo
            </label>
            <input
              id="auth-name"
              name="name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setFieldError("fullName");
              }}
              placeholder="Como podemos chamar você?"
              aria-invalid={Boolean(errors.fullName)}
              className="min-h-12 w-full rounded-xl border border-[#171512]/15 bg-white px-4 text-sm text-[#171512] transition outline-none placeholder:text-[#a49d94] focus:border-[#8a6746] focus:ring-2 focus:ring-[#8a6746]/15 aria-invalid:border-red-500"
            />
            {errors.fullName && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.fullName}
              </p>
            )}
          </div>
        )}

        {(mode === "login" || mode === "register" || mode === "reset") && (
          <div>
            <label
              htmlFor="auth-password"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#39332d]"
            >
              {mode === "reset" ? "Nova senha" : "Senha"}
            </label>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8a8176]"
              />
              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldError("password");
                }}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                className="min-h-12 w-full rounded-xl border border-[#171512]/15 bg-white pr-12 pl-11 text-sm text-[#171512] transition outline-none placeholder:text-[#a49d94] focus:border-[#8a6746] focus:ring-2 focus:ring-[#8a6746]/15 aria-invalid:border-red-500"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#686158] transition hover:bg-[#f5f3ef] hover:text-black focus-visible:outline-2 focus-visible:outline-black"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
            {mode === "login" && errors.password && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.password}
              </p>
            )}
            {(mode === "register" || mode === "reset") && (
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {passwordValidity.map((rule) => (
                  <li
                    key={rule.id}
                    className={`flex items-center gap-2 text-[0.68rem] ${rule.valid ? "text-[#506c4b]" : "text-[#817a71]"}`}
                  >
                    <Check
                      aria-hidden="true"
                      className={`size-3.5 ${rule.valid ? "opacity-100" : "opacity-35"}`}
                    />
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
            {(mode === "register" || mode === "reset") && errors.password && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.password}
              </p>
            )}
          </div>
        )}

        {(mode === "register" || mode === "reset") && (
          <div>
            <label
              htmlFor="auth-confirm-password"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#39332d]"
            >
              Confirmar senha
            </label>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8a8176]"
              />
              <input
                id="auth-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setFieldError("confirmPassword");
                }}
                placeholder="Repita a senha"
                aria-invalid={Boolean(errors.confirmPassword)}
                className="min-h-12 w-full rounded-xl border border-[#171512]/15 bg-white pr-12 pl-11 text-sm text-[#171512] transition outline-none placeholder:text-[#a49d94] focus:border-[#8a6746] focus:ring-2 focus:ring-[#8a6746]/15 aria-invalid:border-red-500"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmação de senha"
                    : "Mostrar confirmação de senha"
                }
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#686158] transition hover:bg-[#f5f3ef] hover:text-black focus-visible:outline-2 focus-visible:outline-black"
              >
                {showConfirmPassword ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {mode === "login" && (
          <div className="flex items-center justify-between gap-4">
            <label className="flex min-h-8 cursor-pointer items-center gap-2 text-xs text-[#686158]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="size-4 accent-[#171512]"
              />
              Lembrar de mim
            </label>
            <Link
              href={routes.forgotPassword}
              className="text-xs font-medium text-[#39332d] underline-offset-4 transition hover:text-[#8a6746] hover:underline focus-visible:outline-2 focus-visible:outline-black"
            >
              Esqueci a senha
            </Link>
          </div>
        )}

        {mode === "register" && (
          <div>
            <label className="flex items-start gap-3 text-xs leading-5 text-[#686158]">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked);
                  setFieldError("terms");
                }}
                className="mt-1 size-4 shrink-0 accent-[#171512]"
              />
              <span>
                Li e aceito os{" "}
                <Link
                  className="font-medium text-[#171512] underline underline-offset-4"
                  href={routes.termosUso}
                >
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link
                  className="font-medium text-[#171512] underline underline-offset-4"
                  href={routes.politicaPrivacidade}
                >
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.terms}
              </p>
            )}
          </div>
        )}

        {mode === "verify" && (
          <div>
            <div className="mb-5 rounded-xl border border-[#171512]/10 px-4 py-3">
              <p className="mb-1 text-xs text-[#686158]">
                Código de confirmação enviado para{" "}
                {normalizedEmail || "seu e-mail cadastrado"}
              </p>
            </div>
            <label
              htmlFor="auth-code"
              className="mb-2 block text-xs font-semibold tracking-wide text-[#39332d]"
            >
              Código de 6 dígitos
            </label>
            <input
              id="auth-code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                setFieldError("code");
              }}
              placeholder="000000"
              aria-invalid={Boolean(errors.code)}
              className="min-h-14 w-full rounded-xl border border-[#171512]/15 bg-white px-4 text-center font-mono text-xl tracking-[0.55em] text-[#171512] transition outline-none placeholder:text-[#c3bdb4] focus:border-[#8a6746] focus:ring-2 focus:ring-[#8a6746]/15 aria-invalid:border-red-500"
            />
            {errors.code && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {errors.code}
              </p>
            )}
            <p className="mt-3 text-xs leading-5 text-[#817a71]">
              Digite os seis números para confirmar e continuar.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171512] px-5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition hover:-translate-y-0.5 hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black active:translate-y-0"
        >
          {mode === "login" && "Entrar"}
          {mode === "register" && "Criar minha conta"}
          {mode === "forgot" && "Continuar"}
          {mode === "verify" &&
            (flow === "recovery" ? "Validar código" : "Confirmar e-mail")}
          {mode === "reset" && "Salvar nova senha"}
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </form>

      {(mode === "login" || mode === "register") && (
        <>
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#171512]/10" />
            <span className="text-[0.62rem] font-medium tracking-[0.18em] text-[#938b81] uppercase">
              ou continue com
            </span>
            <span className="h-px flex-1 bg-[#171512]/10" />
          </div>
          <button
            type="button"
            onClick={startGoogleDemo}
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#171512]/15 bg-white px-4 text-sm font-medium text-[#39332d] transition hover:border-[#171512]/30 hover:bg-[#faf9f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <GoogleMark />
            Continuar com Google
          </button>
        </>
      )}

      {mode === "login" && (
        <p className="mt-7 mb-0 text-center text-xs text-[#686158]">
          Ainda não tem conta?{" "}
          <Link
            href={routes.register}
            className="font-semibold text-[#171512] underline underline-offset-4"
          >
            Cadastre-se
          </Link>
        </p>
      )}
      {mode === "register" && (
        <p className="mt-7 mb-0 justify-center text-center text-xs text-[#686158]">
          Já tem uma conta?{" "}
          <Link
            href={routes.login}
            className="font-semibold text-[#171512] underline underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      )}
      {mode === "forgot" && (
        <p className="mt-7 mb-0 text-center text-xs text-[#686158]">
          Lembrou sua senha?{" "}
          <Link
            href={routes.login}
            className="font-semibold text-[#171512] underline underline-offset-4"
          >
            Voltar ao login
          </Link>
        </p>
      )}
      {mode === "verify" && (
        <div className="mt-5 flex items-center justify-center text-xs text-[#686158]">
          <span>Não recebeu?</span>
          <button
            type="button"
            onClick={() =>
              setResendNotice(
                `Um novo código foi enviado para ${normalizedEmail || "seu e-mail cadastrado"}.`,
              )
            }
            className="ml-1 inline-flex items-center justify-center font-medium underline-offset-4 hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-black"
          >
            Reenviar código
          </button>
        </div>
      )}
      {resendNotice && (
        <p role="status" className="mt-1 text-center text-xs text-[#686158]">
          {resendNotice}
        </p>
      )}

      <div className="mt-7 border-t border-[#171512]/10 pt-4 text-center text-[0.65rem] leading-5 text-[#938b81]">
        <span>Consulte nossa </span>
        <Link
          href={routes.politicaPrivacidade}
          className="font-medium text-[#39332d] underline underline-offset-4 transition hover:text-[#8a6746]"
        >
          Política de Privacidade
        </Link>
        <span> e os </span>
        <Link
          href={routes.termosUso}
          className="font-medium text-[#39332d] underline underline-offset-4 transition hover:text-[#8a6746]"
        >
          Termos de Uso
        </Link>
        .
      </div>
    </>
  );
}
