const enderecoCompleto =
  "Avenida Comendador Francisco Avelino Maia, 3014, Passos, MG";
const enderecoCodificado = encodeURIComponent(enderecoCompleto);

export const localizacaoLoja = {
  enderecoCompleto,
  endereco: ["Avenida Comendador Francisco Avelino Maia, 3014", "Passos — MG"],
  mapaIncorporadoUrl: `https://maps.google.com/maps?hl=pt-BR&q=${enderecoCodificado}&z=16&output=embed`,
  comoChegarUrl: `https://www.google.com/maps/dir/?api=1&destination=${enderecoCodificado}`,
} as const;
