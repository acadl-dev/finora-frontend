"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { TransactionDTO } from "@/lib/api/types"
import { listTransactions } from "@/lib/api/transactions-client"

type TransactionsContextValue = {
  transactions: TransactionDTO[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

// Compartilha a lista de transações entre a tabela e o modal de "Nova transação",
// para que a tabela seja recarregada assim que uma transação for criada.
export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    const result = await listTransactions()
    if (result.success) {
      setTransactions(result.data)
      setError(null)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload()
  }, [reload])

  return (
    <TransactionsContext.Provider value={{ transactions, loading, error, reload }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error("useTransactions deve ser usado dentro de <TransactionsProvider>")
  }
  return context
}
