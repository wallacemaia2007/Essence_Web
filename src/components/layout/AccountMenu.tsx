"use client";

import { ChevronDown, LogOut, Package, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { useDemoAuth } from "@/components/auth/DemoAuthProvider";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

type AccountMenuProps = {
  compact?: boolean;
};

const menuItemClassName =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#171717] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function AccountMenu({ compact = false }: AccountMenuProps) {
  const { user, ready, signOut } = useDemoAuth();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = `account-menu-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const triggerClassName = compact
    ? "inline-flex size-11 items-center justify-center rounded-full p-1 text-[#000000] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    : "inline-flex h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold tracking-wide text-[#000000] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
  const menuTriggerClassName =
    "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#000000] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  if (!ready) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex animate-pulse rounded-full bg-black/5",
          compact ? "size-11" : "h-10 w-[5.5rem]",
        )}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href={routes.login}
        aria-label={compact ? "Abrir minha conta" : "Entrar na sua conta"}
        className={triggerClassName}
      >
        <UserRound aria-hidden="true" className="size-4" />
        {!compact && <span>Entrar</span>}
      </Link>
    );
  }

  const firstName = user.name.trim().split(/\s+/)[0] || "Conta";

  function handleSignOut() {
    setIsOpen(false);
    signOut();
    router.replace(routes.home);
  }

  return (
    <div ref={rootRef} className="relative z-[110]">
      <div className="inline-flex items-center rounded-full transition-colors hover:bg-black/5">
        <Link
          href={routes.conta}
          aria-label={`Abrir minha conta de ${user.name}`}
          className={triggerClassName}
        >
          <Image
            src={user.avatarUrl}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full border border-black/10 object-cover"
          />
          {!compact && <span className="max-w-24 truncate">{firstName}</span>}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label="Abrir opções da conta"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((current) => !current)}
          className={menuTriggerClassName}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      {isOpen && (
        <nav
          id={menuId}
          aria-label="Opções da conta"
          className="absolute top-full right-0 z-[110] mt-2 w-60 overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 text-[#171717] shadow-[0_18px_44px_rgba(0,0,0,0.16)]"
        >
          <div className="border-b border-black/8 px-3 py-3">
            <p className="m-0 truncate text-sm font-semibold">{user.name}</p>
            <p className="m-0 mt-1 truncate text-xs text-black/55">
              {user.email}
            </p>
          </div>
          <div className="py-1.5">
            <Link
              href={routes.conta}
              onClick={() => setIsOpen(false)}
              className={menuItemClassName}
            >
              <UserRound aria-hidden="true" className="size-4" />
              Minha conta
            </Link>
            <Link
              href={routes.pedidos}
              onClick={() => setIsOpen(false)}
              className={menuItemClassName}
            >
              <Package aria-hidden="true" className="size-4" />
              Meus pedidos
            </Link>
          </div>
          <div className="border-t border-black/8 pt-1.5">
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(
                menuItemClassName,
                "text-[#8d2525] hover:bg-red-50",
              )}
            >
              <LogOut aria-hidden="true" className="size-4" />
              Sair da conta
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
