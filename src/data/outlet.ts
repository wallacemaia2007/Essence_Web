export type OutletConditions = {
  prazo: string;
  trocas: string;
};

/** Condições provisórias: não publicar como regras definitivas sem validação. */
export const outletConditions: OutletConditions = {
  prazo: "A confirmar com a loja", // TODO: confirmar com a loja o prazo de validade das ofertas.
  trocas: "A confirmar com a loja", // TODO: confirmar com a loja se peças do Outlet aceitam troca e em quais condições.
};
