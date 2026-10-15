export type StorePaymentSettings = {
  maxInstallments: number | null;
  pixDiscountPercent: number | null;
};

export type StoreSettings = {
  payments: StorePaymentSettings;
};

export const storeSettings: StoreSettings = {
  payments: {
    // TODO: confirmar com a loja o número máximo de parcelas antes de publicar.
    maxInstallments: null,
    // TODO: confirmar com a loja o percentual de desconto no Pix antes de publicar.
    pixDiscountPercent: null,
  },
};
