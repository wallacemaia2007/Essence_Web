import { storeSettings } from "@/data/store-settings";
import { formatarPreco } from "@/lib/produto";

type ProdutoPagamentoProps = {
  preco: number | null | undefined;
};

export function ProdutoPagamento({ preco }: ProdutoPagamentoProps) {
  const { maxInstallments, pixDiscountPercent } = storeSettings.payments;
  const installmentAmount =
    preco != null && maxInstallments != null && maxInstallments > 0
      ? formatarPreco(preco / maxInstallments)
      : null;
  const pixAmount =
    preco != null && pixDiscountPercent != null && pixDiscountPercent > 0
      ? formatarPreco(preco * (1 - pixDiscountPercent / 100))
      : null;

  return (
    <div
      aria-label="Condições de pagamento"
      className="mt-3 space-y-1 text-sm text-[#74685f]"
    >
      <p>
        {installmentAmount
          ? `Em até ${maxInstallments}x de ${installmentAmount} no cartão.`
          : "Parcelamento a confirmar com a loja."}
      </p>
      <p>
        {pixAmount
          ? `Pix com ${pixDiscountPercent}% off: ${pixAmount}.`
          : "Desconto no Pix a confirmar com a loja."}
      </p>
    </div>
  );
}
