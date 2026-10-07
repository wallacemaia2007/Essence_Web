/** Acrescenta a mensagem (`text`) a um link do WhatsApp (wa.me ou api.whatsapp.com). */
export function montarLinkWhatsapp(base: string, texto: string) {
  try {
    const url = new URL(base);

    url.searchParams.set("text", texto);

    return url.toString();
  } catch {
    // Link configurado de forma inválida: abre o WhatsApp sem mensagem.
    return base;
  }
}

type Peca = {
  nome: string;
  referencia: string;
};

/** Mensagem de interesse na compra; inclui o tamanho quando já foi escolhido. */
export function mensagemDeInteresse({
  nome,
  referencia,
  tamanho,
}: Peca & { tamanho?: string | null }) {
  const complemento = tamanho ? `, tamanho ${tamanho}` : "";

  return `Olá! Tenho interesse na peça "${nome}" (Ref. ${referencia})${complemento}. Ainda está disponível?`;
}

/** Mensagem para tirar dúvidas (tamanho, combinações) sobre a peça. */
export function mensagemDeAjuda({ nome, referencia }: Peca) {
  return `Olá! Preciso de ajuda com a peça "${nome}" (Ref. ${referencia}).`;
}
