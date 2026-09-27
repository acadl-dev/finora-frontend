"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Loader2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { transactionSchema, type TransactionInput } from "@/lib/validations/transaction-schema"
import { createTransaction } from "@/lib/api/transactions-client"

export function NewTransactionModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

 const {
  register,
  handleSubmit,
  watch,
  setValue,
  reset,
  formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = useForm<z.input<typeof transactionSchema>, any, z.output<typeof transactionSchema>>({
  resolver: zodResolver(transactionSchema),
  defaultValues: {
    type: "EXPENSE",
    date: new Date().toISOString().split("T")[0],
  },
})

  const type = watch("type")

  async function onSubmit(data: TransactionInput) {
    setError(null)
    setLoading(true)

    const result = await createTransaction(data)

    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    reset({ type, date: new Date().toISOString().split("T")[0] })
    setOpen(false)
    onCreated?.() // avisa a tela pai para recarregar a lista
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* render: o próprio Button vira o gatilho (evita <button> dentro de <button>) */}
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" aria-hidden="true" />
        Nova Transação
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setValue("type", v as "INCOME" | "EXPENSE")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="EXPENSE">Despesa</TabsTrigger>
            <TabsTrigger value="INCOME">Receita</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado"
              disabled={loading}
              {...register("description")}
            />
            {errors.description && (
              <span className="text-xs text-destructive">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                disabled={loading}
                {...register("amount")}
              />
              {errors.amount && (
                <span className="text-xs text-destructive">{errors.amount.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                disabled={loading}
                {...register("date")}
              />
              {errors.date && (
                <span className="text-xs text-destructive">{errors.date.message}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              placeholder="Ex: Alimentação (opcional)"
              disabled={loading}
              {...register("category")}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {loading ? "Salvando..." : "Salvar transação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}