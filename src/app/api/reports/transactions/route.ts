import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { handleReportsError } from "../_errors";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/reports/transactions?start=yyyy-MM-dd&end=yyyy-MM-dd
// Encaminha para o reports-service (pelo gateway) e devolve o arquivo Excel.
export async function GET(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const params = new URLSearchParams();
  for (const key of ["start", "end"] as const) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) {
      if (!DATE.test(value)) {
        return NextResponse.json({ error: "Datas devem estar no formato yyyy-MM-dd" }, { status: 400 });
      }
      params.set(key, value);
    }
  }
  const query = params.toString() ? `?${params}` : "";

  try {
    const response = await apiClient.download(`/reports/transactions/excel${query}`, {
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
    return handleReportsError(error, "Erro ao extrair relatório:");
  }
}
