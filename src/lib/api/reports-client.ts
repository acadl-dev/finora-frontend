import type { ReportHistoryDTO } from "@/lib/api/types";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ReportPeriodInput = {
  start?: string; // yyyy-MM-dd
  end?: string;   // yyyy-MM-dd
};

function fileNameFrom(contentDisposition: string | null) {
  const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : "relatorio-financeiro.xlsx";
}

// Baixa o relatório Excel gerado pelo reports-service e dispara o download no navegador.
export async function downloadTransactionsReport(period: ReportPeriodInput): Promise<Result<string>> {
  const params = new URLSearchParams();
  if (period.start) params.set("start", period.start);
  if (period.end) params.set("end", period.end);
  const query = params.toString() ? `?${params}` : "";

  try {
    const response = await fetch(`/api/reports/transactions${query}`, { cache: "no-store" });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      return { success: false, error: result?.error ?? "Não foi possível extrair o relatório." };
    }

    const fileName = fileNameFrom(response.headers.get("Content-Disposition"));
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
    return { success: false, error: "Erro de conexão. Verifique sua internet e tente novamente." };
  }
}

export async function listReportHistory(): Promise<Result<ReportHistoryDTO[]>> {
  try {
    const response = await fetch("/api/reports/history", { cache: "no-store" });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: result?.error ?? "Não foi possível carregar o histórico." };
    }
    return { success: true, data: (result ?? []) as ReportHistoryDTO[] };
  } catch {
    return { success: false, error: "Erro de conexão. Verifique sua internet e tente novamente." };
  }
}
