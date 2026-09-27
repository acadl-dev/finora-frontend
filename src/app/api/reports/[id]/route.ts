import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import type { ReportDTO } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/session";
import { handleReportsError } from "../_errors";

// GET /api/reports/:id -> status do relatório (REQUESTED | READY | FAILED)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await apiClient.get<ReportDTO>(`/reports/${encodeURIComponent(id)}`, { token, cache: "no-store" });
    return NextResponse.json(data);
  } catch (error) {
    return handleReportsError(error, "Erro ao consultar relatório:");
  }
}
