import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import type { ReportDTO } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/session";
import { handleReportsError } from "./_errors";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// POST /api/reports  { start?, end? }
// Solicita o relatório ao reports-service (via gateway). A resposta é 202 Accepted:
// a geração acontece de forma assíncrona numa fila do RabbitMQ.
export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { start?: string; end?: string };
  for (const value of [body.start, body.end]) {
    if (value && !DATE.test(value)) {
      return NextResponse.json({ error: "Datas devem estar no formato yyyy-MM-dd" }, { status: 400 });
    }
  }

  try {
    const data = await apiClient.post<ReportDTO>(
      "/reports",
      { start: body.start || null, end: body.end || null },
      { token }
    );
    return NextResponse.json(data, { status: 202 });
  } catch (error) {
    return handleReportsError(error, "Erro ao solicitar relatório:");
  }
}
