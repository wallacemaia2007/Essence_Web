import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .pipe(z.email("Informe um e-mail válido.")),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
