import { NextRequest, NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api/client";
import type { TransactionDTO } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/session";
import { transactionSchema } from "@/lib/validations/transaction-schema";

// Converte os erros do backend Spring em respostas para o browser.
function handleBackendError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    // 401/403: token ausente, expirado ou inválido (Spring Security responde 403 por padrão)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }
    if (error.status === 400) {
      const body = error.body as { error?: string } | null;
      return NextResponse.json({ error: body?.error ?? "Dados inválidos" }, { status: 400 });
    }
  }
  console.error(fallback, error);
  return NextResponse.json({ error: "Erro interno" }, { status: 500 });
}

export async function GET() {
  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const data = await apiClient.get<TransactionDTO[]>("/transactions", { token, cache: "no-store" });
    return NextResponse.json(data);
  } catch (error) {
    return handleBackendError(error, "Erro ao listar transações:");
  }
}

export async function POST(request: NextRequest) {
  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = transactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const data = await apiClient.post<TransactionDTO>("/transactions", parsed.data, { token });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleBackendError(error, "Erro ao criar transação:");
  }
}
