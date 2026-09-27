"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatBRL } from "@/lib/data"
import { cn } from "@/lib/utils"
import type { ReportDTO, ReportStatus } from "@/lib/api/types"
import {
  downloadReport,
  listReportHistory,
  requestTransactionsReport,
  waitForReport,
} from "@/lib/api/reports-client"

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
  REQUESTED: { label: "Gerando", className: "bg-muted text-muted-foreground" },
  READY: { label: "Pronto", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  FAILED: { label: "Falhou", className: "bg-destructive/10 text-destructive" },
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Botão "Extrair relatório". Fluxo assíncrono (orientado a eventos):
// 1) POST pede o relatório (202 Accepted) -> 2) o reports-service gera numa fila do
// RabbitMQ -> 3) o front consulta o status até ficar READY -> 4) baixa o Excel.
export function ExportReportDialog() {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [step, setStep] = useState<"idle" | "requesting" | "generating" | "downloading">("idle")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [history, setHistory] = useState<ReportDTO[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const busy = step !== "idle"

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    const result = await listReportHistory()
    if (result.success) {
      setHistory(result.data)
      setHistoryError(null)
    } else {
      setHistoryError(result.error)
    }
    setHistoryLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void loadHistory()
  }, [open, loadHistory])

  function resetMessages() {
    setError(null)
    setInfo(null)
    setSuccess(null)
  }

  async function handleExport() {
    resetMessages()

    if (start && end && start > end) {
      setError("A data inicial deve ser anterior ou igual à data final.")
      return
    }

    setStep("requesting")
    const requested = await requestTransactionsReport({ start: start || undefined, end: end || undefined })
    if (!requested.success) {
      setStep("idle")
      setError(requested.error)
      return
    }

    setStep("generating")
    void loadHistory() // mostra o pedido no histórico como "Gerando"
    const finished = await waitForReport(requested.data.id)

    if (!finished.success) {
      setStep("idle")
      if ("timedOut" in finished) setInfo(finished.error)
      else setError(finished.error)
      void loadHistory()
      return
    }

    if (finished.data.status === "FAILED") {
      setStep("idle")
      setError(finished.data.failureReason ?? "Não foi possível gerar o relatório.")
      void loadHistory()
      return
    }

    setStep("downloading")
    const downloaded = await downloadReport(finished.data)
    setStep("idle")
    if (!downloaded.success) {
      setError(downloaded.error)
    } else {
      setSuccess(`Relatório "${downloaded.data}" baixado com sucesso.`)
    }
    void loadHistory()
  }

  async function handleDownload(report: ReportDTO) {
    resetMessages()
    setDownloadingId(report.id)
    const result = await downloadReport(report)
    setDownloadingId(null)
    if (!result.success) setError(result.error)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) resetMessages()
  }

  const buttonLabel = {
    idle: "Gerar e baixar Excel",
    requesting: "Enviando pedido...",
    generating: "Gerando relatório...",
    downloading: "Baixando...",
  }[step]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <FileSpreadsheet className="size-4 text-emerald-600" aria-hidden="true" />
        Extrair relatório
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Extrair relatório</DialogTitle>
          <DialogDescription>
            Planilha Excel com suas receitas e despesas e o saldo (receitas − despesas).
            Deixe as datas em branco para incluir todo o período.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
          {info && (
            <div role="status" className="flex items-start gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm">
              <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" aria-hidden="true" />
              <span>{info}</span>
            </div>
          )}
          {success && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="report-start">De</Label>
              <Input
                id="report-start"
                type="date"
                value={start}
                max={end || undefined}
                onChange={(e) => setStart(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="report-end">Até</Label>
              <Input
                id="report-end"
                type="date"
                value={end}
                min={start || undefined}
                onChange={(e) => setEnd(e.target.value)}
                disabled={busy}
              />
            </div>
          </div>

          <Button onClick={handleExport} disabled={busy} className="w-full">
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileSpreadsheet className="size-4" aria-hidden="true" />
            )}
            {buttonLabel}
          </Button>

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Relatórios gerados</p>

            {historyLoading && history.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Carregando histórico...
              </p>
            ) : historyError ? (
              <p className="text-sm text-destructive">{historyError}</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum relatório gerado ainda.</p>
            ) : (
              <ul className="flex max-h-64 flex-col divide-y divide-border overflow-y-auto rounded-md border border-border">
                {history.map((report) => {
                  const status = statusConfig[report.status]
                  return (
                    <li key={report.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 truncate font-medium">
                          {report.periodDescription}
                          <Badge variant="secondary" className={cn("shrink-0", status.className)}>
                            {report.status === "REQUESTED" && (
                              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                            )}
                            {status.label}
                          </Badge>
                        </p>
                        <p className="truncate text-xs text-muted-foreground" title={report.failureReason ?? undefined}>
                          {formatDateTime(report.requestedAt)}
                          {report.status === "READY" && report.entryCount !== null &&
                            ` · ${report.entryCount} lançamento${report.entryCount === 1 ? "" : "s"}`}
                          {report.status === "FAILED" && report.failureReason && ` · ${report.failureReason}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {report.balance !== null && (
                          <span
                            className={cn(
                              "font-semibold tabular-nums",
                              report.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
                            )}
                            title="Saldo (receitas − despesas)"
                          >
                            {formatBRL(report.balance)}
                          </span>
                        )}
                        {report.status === "READY" && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDownload(report)}
                            disabled={downloadingId === report.id}
                            aria-label={`Baixar ${report.fileName}`}
                            title="Baixar"
                          >
                            {downloadingId === report.id ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Download className="size-3.5" aria-hidden="true" />
                            )}
                          </Button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
