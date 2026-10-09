import { shippingInfo } from "@/data/shipping";

export type FreightCalculationResult =
  | {
      status: "invalid";
      message: string;
    }
  | {
      status: "mock";
      cep: string;
      price: string;
      deadline: string;
      message: string;
    };

/**
 * Simulação isolada de cotação. A implementação não chama Correios,
 * transportadoras ou gateways e pode ser substituída por uma API depois.
 */
export function calcularFrete(cep: string): FreightCalculationResult {
  const digits = cep.replace(/\D/g, "");

  if (digits.length !== 8) {
    return {
      status: "invalid",
      message: shippingInfo.calculator.invalidCepMessage,
    };
  }

  return {
    status: "mock",
    cep: `${digits.slice(0, 5)}-${digits.slice(5)}`,
    price: shippingInfo.calculator.mockPrice,
    deadline: shippingInfo.calculator.mockDeadline,
    message: shippingInfo.calculator.mockNotice,
  };
}
