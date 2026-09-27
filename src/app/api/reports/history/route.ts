import { NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import type { ReportHistoryDTO } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/session";
import { handleReportsError } from "../_errors";

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const data = await apiClient.get<ReportHistoryDTO[]>("/reports/history", { token, cache: "no-store" });
    return NextResponse.json(data);
  } catch (error) {
    return handleReportsError(error, "Erro ao listar histórico de relatórios:");
  }
}
