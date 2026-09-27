import { afterEach, describe, expect, it, vi } from "vitest";
import { requestTransactionsReport, waitForReport } from "./reports-client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const report = (status: string) => ({
  id: "r1",
  status,
  fileName: "relatorio.xlsx",
  format: "XLSX",
  periodStart: null,
  periodEnd: null,
  periodDescription: "Todo o período",
  totalIncome: status === "READY" ? 1000 : null,
  totalExpense: status === "READY" ? 400 : null,
  balance: status === "READY" ? 600 : null,
  entryCount: status === "READY" ? 2 : null,
  failureReason: null,
  requestedAt: "2026-09-27T12:00:00Z",
  completedAt: null,
});

afterEach(() => vi.unstubAllGlobals());

describe("requestTransactionsReport", () => {
  it("envia o período e devolve o relatório REQUESTED (202)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(report("REQUESTED"), 202));
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestTransactionsReport({ start: "2026-09-01", end: "2026-09-30" });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/reports", expect.objectContaining({ method: "POST" }));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({ start: "2026-09-01", end: "2026-09-30" });
  });

  it("repassa a mensagem de erro do backend", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ error: "Período inválido" }, 400)));
    const result = await requestTransactionsReport({});
    expect(result).toEqual({ success: false, error: "Período inválido" });
  });

  it("trata falha de rede", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const result = await requestTransactionsReport({});
    expect(result.success).toBe(false);
  });
});

describe("waitForReport (polling do Request-Reply assíncrono)", () => {
  it("consulta até o relatório ficar READY", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(report("REQUESTED")))
      .mockResolvedValueOnce(jsonResponse(report("REQUESTED")))
      .mockResolvedValueOnce(jsonResponse(report("READY")));
    vi.stubGlobal("fetch", fetchMock);

    const result = await waitForReport("r1", { intervalMs: 1, timeoutMs: 1000 });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.success && result.data.status).toBe("READY");
  });

  it("desiste quando o tempo limite estoura", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async () => jsonResponse(report("REQUESTED"))));
    const result = await waitForReport("r1", { intervalMs: 5, timeoutMs: 20 });
    expect(result.success).toBe(false);
    expect("timedOut" in result && result.timedOut).toBe(true);
  });
});
