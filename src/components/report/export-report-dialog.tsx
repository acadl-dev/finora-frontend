"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, FileSpreadsheet, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatBRL } from "@/lib/data"
import { cn } from "@/lib/utils"
import type { ReportHistoryDTO } from "@/lib/api/types"
import { downloadTransactionsReport, listReportHistory } from "@/lib/api/reports-client"

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Botão "Extrair relatório": gera o Excel de receitas e despesas no reports-service
// (via gateway) e mostra o histórico de relatórios já gerados.
export function ExportReportDialog() {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [history, setHistory] = useState<ReportHistoryDTO[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

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

  async function handleExport() {
    setError(null)
    setSuccess(null)

    if (start && end && start > end) {
      setError("A data inicial deve ser anterior ou igual à data final.")
      return
    }

    setLoading(true)
    const result = await downloadTransactionsReport({
      start: start || undefined,
      end: end || undefined,
    })
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setSuccess(`Relatório "${result.data}" baixado com sucesso.`)
    void loadHistory()
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setError(null)
      setSuccess(null)
    }
  }

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <Button onClick={handleExport} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <FileSpreadsheet className="size-4" aria-hidden="true" />
            )}
            {loading ? "Gerando relatório..." : "Baixar Excel"}
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
              <ul className="flex max-h-56 flex-col divide-y divide-border overflow-y-auto rounded-md border border-border">
                {history.map((report) => (
                  <li key={report.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{report.periodDescription}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(report.generatedAt)} · {report.entryCount} lançamento
                        {report.entryCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 font-semibold tabular-nums",
                        report.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
                      )}
                      title="Saldo (receitas − despesas)"
                    >
                      {formatBRL(report.balance)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
