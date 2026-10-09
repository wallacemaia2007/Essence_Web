export type SizeGuideLabel = "PP" | "P" | "M" | "G" | "GG";
export type SizeGuideMeasurement = number | "PLACEHOLDER";

export type SizeGuideRow = {
  tamanho: SizeGuideLabel;
  busto: SizeGuideMeasurement;
  cintura: SizeGuideMeasurement;
  quadril: SizeGuideMeasurement;
};

// TODO: confirmar medidas com a loja
export const sizeGuideRows = [
  {
    tamanho: "PP",
    busto: "PLACEHOLDER",
    cintura: "PLACEHOLDER",
    quadril: "PLACEHOLDER",
  },
  {
    tamanho: "P",
    busto: "PLACEHOLDER",
    cintura: "PLACEHOLDER",
    quadril: "PLACEHOLDER",
  },
  {
    tamanho: "M",
    busto: "PLACEHOLDER",
    cintura: "PLACEHOLDER",
    quadril: "PLACEHOLDER",
  },
  {
    tamanho: "G",
    busto: "PLACEHOLDER",
    cintura: "PLACEHOLDER",
    quadril: "PLACEHOLDER",
  },
  {
    tamanho: "GG",
    busto: "PLACEHOLDER",
    cintura: "PLACEHOLDER",
    quadril: "PLACEHOLDER",
  },
] as const satisfies readonly SizeGuideRow[];
