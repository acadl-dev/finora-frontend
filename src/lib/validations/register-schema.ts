// esse arquivo faz a "tradução" dos nomes para a API, que espera os campos em português. 
// A validação é feita com o Zod, que é uma biblioteca de validação de esquemas para TypeScript e JavaScript.
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter ao menos um número"),
});

export type RegisterInput = z.infer<typeof registerSchema>;