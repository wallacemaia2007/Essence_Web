/** Calcula o scroll absoluto para deixar o centro do elemento no centro da viewport. */
export function getCenteredScrollTarget(
  element: HTMLElement,
  currentScroll: number,
): number {
  const rect = element.getBoundingClientRect();

  return Math.max(
    0,
    currentScroll + rect.top + rect.height / 2 - window.innerHeight / 2,
  );
}
