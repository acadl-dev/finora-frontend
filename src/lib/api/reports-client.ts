import type { ReportDTO } from "@/lib/api/types";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ReportPeriodInput = {
  start?: string; // yyyy-MM-dd
  end?: string;   // yyyy-MM-dd
};

const CONNECTION_ERROR = "Erro de conexão. Verifique sua internet e tente novamente.";

async function jsonResult<T>(response: Response, fallback: string): Promise<Result<T>> {
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    return { success: false, error: result?.error ?? fallback };
  }
  return { success: true, data: result as T };
}

function fileNameFrom(contentDisposition: string | null, fallback: string) {
  const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}

// 1) Solicita o relatório: o reports-service responde na hora (202) com status REQUESTED.
export async function requestTransactionsReport(period: ReportPeriodInput): Promise<Result<ReportDTO>> {
  try {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start: period.start || undefined, end: period.end || undefined }),
    });
    return jsonResult<ReportDTO>(response, "Não foi possível solicitar o relatório.");
  } catch {
    return { success: false, error: CONNECTION_ERROR };
  }
}

// 2) Consulta o status (REQUESTED -> READY | FAILED).
export async function getReport(id: string): Promise<Result<ReportDTO>> {
  try {
    const response = await fetch(`/api/reports/${encodeURIComponent(id)}`, { cache: "no-store" });
    return jsonResult<ReportDTO>(response, "Não foi possível consultar o relatório.");
  } catch {
    return { success: false, error: CONNECTION_ERROR };
  }
}

// Polling: consulta o status a cada `intervalMs` até ficar pronto, falhar ou estourar o tempo.
export async function waitForReport(
  id: string,
  { intervalMs = 1000, timeoutMs = 30000 }: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<Result<ReportDTO> | { success: false; error: string; timedOut: true }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const result = await getReport(id);
    if (!result.success) return result;
    if (result.data.status !== "REQUESTED") return result;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return {
    success: false,
    timedOut: true,
    error: "O relatório ainda está sendo gerado. Ele aparecerá no histórico quando ficar pronto.",
  };
}

// 3) Baixa o arquivo de um relatório READY e dispara o download no navegador.
export async function downloadReport(report: Pick<ReportDTO, "id" | "fileName">): Promise<Result<string>> {
  try {
    const response = await fetch(`/api/reports/${encodeURIComponent(report.id)}/file`, { cache: "no-store" });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      return { success: false, error: result?.error ?? "Não foi possível baixar o relatório." };
    }

    const fileName = fileNameFrom(response.headers.get("Content-Disposition"), report.fileName);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    return { success: true, data: fileName };
  } catch {
    return { success: false, error: CONNECTION_ERROR };
  }
}

export async function listReportHistory(): Promise<Result<ReportDTO[]>> {
  try {
    const response = await fetch("/api/reports/history", { cache: "no-store" });
    const result = await jsonResult<ReportDTO[]>(response, "Não foi possível carregar o histórico.");
    return result.success ? { success: true, data: result.data ?? [] } : result;
  } catch {
    return { success: false, error: CONNECTION_ERROR };
  }
}
