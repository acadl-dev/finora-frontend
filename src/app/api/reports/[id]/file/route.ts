import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { handleReportsError } from "../../_errors";

// GET /api/reports/:id/file -> baixa o Excel de um relatório READY
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const response = await apiClient.download(`/reports/${encodeURIComponent(id)}/file`, {
      token,
      cache: "no-store",
    });

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ??
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          response.headers.get("Content-Disposition") ?? 'attachment; filename="relatorio-financeiro.xlsx"',
      },
    });
  } catch (error) {
    return handleReportsError(error, "Erro ao baixar relatório:");
  }
}
