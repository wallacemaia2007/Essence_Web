"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { ConsentContext } from "@/components/consent/consent-context";
import { routes } from "@/constants/routes";
import {
  CONSENT_STORAGE_KEY,
  type ConsentCategories,
  type ConsentGateCategory,
  type ConsentRecord,
  createConsentRecord,
  initialConsentCategories,
  normalizeConsentCategory,
  type OptionalConsentCategory,
  readStoredConsent,
} from "@/lib/consent";

type ConsentProviderProps = {
  children: ReactNode;
};

function subscribeToHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  const [consent, setConsent] = useState<ConsentRecord | null>(() =>
    readStoredConsent(),
  );
  const showBanner = hasHydrated && !consent;
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const persistChoices = useCallback((categories: ConsentCategories) => {
    const record = createConsentRecord(categories);
    setConsent(record);
    setPreferencesOpen(false);

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // A escolha continua válida nesta sessão se o navegador bloquear storage.
    }
  }, []);

  const acceptAll = useCallback(() => {
    persistChoices({
      necessary: true,
      preferences: true,
      statistics: true,
      marketing: true,
    });
  }, [persistChoices]);

  const rejectNonEssential = useCallback(() => {
    persistChoices(initialConsentCategories());
  }, [persistChoices]);

  const saveChoices = useCallback(
    (categories: ConsentCategories) => persistChoices(categories),
    [persistChoices],
  );

  const allowCategory = useCallback(
    (category: ConsentGateCategory) => {
      const normalized = normalizeConsentCategory(category);
      if (normalized === "necessary") return;

      const current = consent?.categories ?? initialConsentCategories();
      persistChoices({ ...current, [normalized]: true, necessary: true });
    },
    [consent, persistChoices],
  );

  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const value = useMemo(
    () => ({
      hasHydrated,
      consent,
      showBanner,
      preferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectNonEssential,
      saveChoices,
      allowCategory,
    }),
    [
      hasHydrated,
      consent,
      showBanner,
      preferencesOpen,
      openPreferences,
      closePreferences,
      acceptAll,
      rejectNonEssential,
      saveChoices,
      allowCategory,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {hasHydrated && showBanner ? (
        <ConsentBanner
          disabled={preferencesOpen}
          onAccept={acceptAll}
          onReject={rejectNonEssential}
          onCustomize={openPreferences}
        />
      ) : null}
      {preferencesOpen ? (
        <ConsentPreferencesDialog
          consent={consent?.categories ?? initialConsentCategories()}
          onClose={closePreferences}
          onSave={saveChoices}
        />
      ) : null}
    </ConsentContext.Provider>
  );
}

function ConsentBanner({
  disabled,
  onAccept,
  onReject,
  onCustomize,
}: {
  disabled: boolean;
  onAccept: () => void;
  onReject: () => void;
  onCustomize: () => void;
}) {
  const buttonClassName =
    "flex min-h-11 w-full items-center justify-center border border-[#171717]/35 bg-white px-3 py-2 text-center text-xs font-semibold tracking-[0.08em] text-[#171717] uppercase transition-colors hover:border-[#171717] hover:bg-[#171717] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] motion-reduce:transition-none";

  return (
    <aside
      aria-label="Consentimento de cookies"
      aria-hidden={disabled}
      inert={disabled}
      className="fixed inset-x-3 bottom-3 z-[110] mx-auto max-w-5xl border border-[#171717]/15 bg-white p-4 text-[#171717] shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:inset-x-6 sm:bottom-6 sm:p-5"
    >
      <div className="flex flex-col gap-5">
        <div className="max-w-3xl">
          <h2 className="font-heading text-lg font-medium">
            Sua privacidade importa
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#655e57]">
            Usamos tecnologias necessárias para o funcionamento do site. Com sua
            autorização, também podemos carregar recursos de preferências,
            estatísticas e marketing. Você pode ajustar sua escolha quando
            quiser.
          </p>
          <Link
            href={routes.politicaCookies}
            className="mt-1 inline-flex min-h-9 items-center text-sm font-medium text-[#171717] underline underline-offset-4 hover:text-[#8a6746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            Política de Cookies
          </Link>
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-3">
          <button type="button" onClick={onAccept} className={buttonClassName}>
            Aceitar todos
          </button>
          <button type="button" onClick={onReject} className={buttonClassName}>
            Rejeitar não essenciais
          </button>
          <button
            type="button"
            onClick={onCustomize}
            className={buttonClassName}
          >
            Personalizar
          </button>
        </div>
      </div>
    </aside>
  );
}

function ConsentPreferencesDialog({
  consent,
  onClose,
  onSave,
}: {
  consent: ConsentCategories;
  onClose: () => void;
  onSave: (categories: ConsentCategories) => void;
}) {
  const [draft, setDraft] = useState(consent);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    const selector =
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(selector) ?? []);

    focusableElements()[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusableElements();
      if (elements.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const toggle = (category: OptionalConsentCategory) => {
    setDraft((current) => ({
      ...current,
      [category]: !current[category],
      necessary: true,
    }));
  };

  const categories = [
    {
      key: "necessary" as const,
      title: "Necessários",
      description:
        "Essenciais para funções solicitadas, segurança e armazenamento da própria escolha de consentimento. Sempre ativos.",
    },
    {
      key: "preferences" as const,
      title: "Preferências",
      description:
        "Permitem carregar recursos externos opcionais, como o mapa incorporado da loja.",
    },
    {
      key: "statistics" as const,
      title: "Estatísticas",
      description:
        "Autorizam ferramentas de medição de uso, caso estejam configuradas no site ou na hospedagem.",
    },
    {
      key: "marketing" as const,
      title: "Marketing",
      description:
        "Permitem carregar conteúdo e mídia de redes sociais, como os Reels do Instagram.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        aria-describedby="cookie-preferences-description"
        tabIndex={-1}
        className="my-auto w-full max-w-2xl border border-black/10 bg-white p-5 text-[#171717] shadow-2xl outline-none sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6746] uppercase">
              Privacidade
            </p>
            <h2
              id="cookie-preferences-title"
              className="font-heading mt-2 text-2xl font-medium sm:text-3xl"
            >
              Preferências de cookies
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar preferências de cookies"
            className="inline-flex size-11 shrink-0 items-center justify-center border border-black/20 text-2xl leading-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p
          id="cookie-preferences-description"
          className="mt-4 text-sm leading-6 text-[#655e57]"
        >
          Escolha quais categorias opcionais podem ser ativadas. As categorias
          necessárias permanecem sempre ligadas. Sua escolha pode ser alterada
          depois pelo rodapé.
        </p>

        <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {categories.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 max-w-lg text-sm leading-6 text-[#655e57]">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label={item.title}
                aria-checked={item.key === "necessary" || draft[item.key]}
                disabled={item.key === "necessary"}
                onClick={() => {
                  if (item.key !== "necessary") toggle(item.key);
                }}
                className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-[#d5d1cd] transition-colors aria-checked:bg-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6746] disabled:cursor-not-allowed motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="inline-block size-5 translate-x-1 rounded-full bg-white shadow transition-transform data-[checked=true]:translate-x-6 motion-reduce:transition-none"
                  data-checked={item.key === "necessary" || draft[item.key]}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center border border-black/25 px-5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave({ ...draft, necessary: true })}
            className="inline-flex min-h-11 items-center justify-center bg-[#171717] px-5 text-xs font-semibold tracking-[0.1em] text-white uppercase hover:bg-[#39332d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
          >
            Salvar escolhas
          </button>
        </div>
      </div>
    </div>
  );
}
