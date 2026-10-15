export type ShippingQuote = {
  message: string;
};

export interface ShippingProvider {
  quote(cep: string): Promise<ShippingQuote>;
}

/** Simulação local; não consulta Correios, transportadoras ou qualquer API. */
export const mockShippingProvider: ShippingProvider = {
  async quote(cep) {
    const valido = /^\d{8}$/.test(cep);
    return {
      message: valido
        ? "A confirmar com a loja."
        : "Digite um CEP válido com 8 dígitos.",
    };
  },
};
