import { NextRequest, NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";

// DELETE /api/transactions/:id -> exclui a transação no finora.
// O finora publica TransactionRemoved e o reports-service atualiza sua projeção.
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await apiClient.delete<null>(`/transactions/${encodeURIComponent(id)}`, { token });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
      }
      if (error.status === 404) {
        return NextResponse.json({ error: "Transação não encontrada" }, { status: 404 });
      }
    }
    console.error("Erro ao excluir transação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
