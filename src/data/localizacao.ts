import { storeHours } from "./store-hours";

const enderecoRua = "Avenida Comendador Francisco Avelino Maia, 3014";
const cidade = "Passos";
const estado = "MG";
const enderecoCompleto = `${enderecoRua}, ${cidade}, ${estado}`;
const enderecoCodificado = encodeURIComponent(enderecoCompleto);

export const localizacaoLoja = {
  enderecoCompleto,
  endereco: [enderecoRua, `${cidade} — ${estado}`],
  cidade,
  estado,
  horario: storeHours.summary,
  openingHoursSchema: storeHours.openingHoursSchema,
  geo: {
    latitude: -20.7253955,
    longitude: -46.6122795,
  },
  mapaIncorporadoUrl: `https://maps.google.com/maps?hl=pt-BR&q=${enderecoCodificado}&z=16&output=embed`,
  comoChegarUrl: `https://www.google.com/maps/dir/?api=1&destination=${enderecoCodificado}`,
} as const;
