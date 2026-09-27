import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";

// Converte erros do reports-service (via gateway) em respostas para o browser.
export function handleReportsError(error: unknown, context: string) {
  if (error instanceof ApiError) {
    const body = error.body as { error?: string } | null;
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }
    if (error.status === 400) {
      return NextResponse.json({ error: body?.error ?? "Parâmetros inválidos" }, { status: 400 });
    }
    if (error.status === 503 || error.status === 502 || error.status === 504) {
      return NextResponse.json(
        { error: body?.error ?? "Serviço de relatórios indisponível no momento." },
        { status: 503 }
      );
    }
  }
  console.error(context, error);
  return NextResponse.json({ error: "Não foi possível gerar o relatório." }, { status: 500 });
}
