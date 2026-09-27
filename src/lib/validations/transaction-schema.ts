import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().optional(),
  date: z.string().min(1, "Data é obrigatória"), // formato yyyy-MM-dd
});

export type TransactionInput = z.infer<typeof transactionSchema>;