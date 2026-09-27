"use client"

import { useState } from "react"
import { AlertCircle, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTransaction } from "@/lib/api/transactions-client"

// Exclusão em dois passos (Excluir -> Confirmar). No backend, o finora publica o evento
// TransactionRemoved e o reports-service retira o lançamento dos próximos relatórios.
export function DeleteTransactionButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setError(null)
    setLoading(true)
    const result = await deleteTransaction(id)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    onDeleted()
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      {confirming ? (
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setConfirming(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
            Confirmar exclusão
          </Button>
        </div>
      ) : (
        <Button variant="destructive" onClick={() => setConfirming(true)}>
          <Trash2 className="size-4" aria-hidden="true" />
          Excluir transação
        </Button>
      )}
    </div>
  )
}
