import { routes } from "@/constants/routes";

const INTERNAL_ORIGIN = "https://essence.invalid";

/**
 * Aceita somente destinos internos e evita loops para as telas de autenticação.
 * O destino vem de um query param, portanto não deve ser usado sem validação.
 */
export function getAuthReturnPath(value?: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  ) {
    return routes.home;
  }

  try {
    const destination = new URL(value, INTERNAL_ORIGIN);

    if (
      destination.origin !== INTERNAL_ORIGIN ||
      destination.pathname === routes.login ||
      destination.pathname.startsWith(`${routes.login}/`) ||
      destination.pathname === routes.verifyCode
    ) {
      return routes.home;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return routes.home;
  }
}

export function getSingleSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function withAuthReturnPath(path: string, returnPath?: string | null) {
  if (!returnPath) return path;

  const params = new URLSearchParams({
    redirectTo: getAuthReturnPath(returnPath),
  });

  return `${path}?${params.toString()}`;
}
