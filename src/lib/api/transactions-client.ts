import type { TransactionInput } from "@/lib/validations/transaction-schema";
import type { TransactionDTO } from "@/lib/api/types";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createTransaction(input: TransactionInput): Promise<Result<TransactionDTO>> {
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: result?.error ?? "Não foi possível criar a transação.",
      };
    }

    return { success: true, data: result as TransactionDTO };
  } catch {
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}

export async function listTransactions(): Promise<Result<TransactionDTO[]>> {
  try {
    const response = await fetch("/api/transactions", { cache: "no-store" });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: result?.error ?? "Não foi possível carregar as transações.",
      };
    }

    return { success: true, data: (result ?? []) as TransactionDTO[] };
  } catch {
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}
