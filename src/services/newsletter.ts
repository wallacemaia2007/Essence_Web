/**
 * Inscrição na newsletter.
 *
 * TODO: conectar a um serviço real (rota `/api/newsletter` com Resend,
 * Mailchimp, Brevo etc.). Enquanto isso, a função só simula uma chamada de
 * rede para validar os estados de loading e sucesso do formulário.
 * Para testar o estado de erro, faça esta função lançar uma exceção.
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  void email;

  await new Promise((resolve) => setTimeout(resolve, 600));
}
