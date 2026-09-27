'use client'

import { useMemo, useState } from 'react'
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Loader2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { categories, formatBRL } from '@/lib/data'
import type { TransactionDTO, TransactionType } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { NewTransactionModal } from '@/components/transaction/new-transaction-modal'
import { useTransactions } from '@/components/transaction/transactions-context'
import { ExportReportDialog } from '@/components/report/export-report-dialog'

const typeConfig: Record<TransactionType, { label: string; icon: typeof ArrowUpRight; className: string }> = {
  INCOME: { label: 'Receita', icon: ArrowUpRight, className: 'bg-success/15 text-success' },
  EXPENSE: { label: 'Despesa', icon: ArrowDownLeft, className: 'bg-destructive/10 text-destructive' },
}

const EMPTY = '—'

function fullDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function monthLabel(yearMonth: string) {
  const label = new Date(yearMonth + '-15T12:00:00').toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function TransactionsView() {
  const { transactions, loading, error } = useTransactions()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('todos')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [periodFilter, setPeriodFilter] = useState('todos')
  const [selected, setSelected] = useState<TransactionDTO | null>(null)

  // Períodos (yyyy-MM) presentes nas transações do usuário, do mais recente ao mais antigo
  const periods = useMemo(
    () => [...new Set(transactions.map((tx) => tx.date.slice(0, 7)))].sort().reverse(),
    [transactions],
  )

  // Categorias padrão + categorias livres que o usuário já usou
  const categoryOptions = useMemo(
    () => [...new Set([...categories, ...transactions.map((tx) => tx.category).filter((c): c is string => !!c)])],
    [transactions],
  )

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'todos' && tx.type !== typeFilter) return false
      if (categoryFilter !== 'todas' && tx.category !== categoryFilter) return false
      if (periodFilter !== 'todos' && !tx.date.startsWith(periodFilter)) return false
      return true
    })
  }, [transactions, search, typeFilter, categoryFilter, periodFilter])

  return (
    <>
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

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Buscar transações"
            />
          </div>
          <Select value={periodFilter} onValueChange={(value) => {setPeriodFilter(value ?? "todos");}}>
            <SelectTrigger className="w-40" aria-label="Filtrar por período">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo período</SelectItem>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {monthLabel(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(value) => {setTypeFilter(value ?? "todos");}}>
            <SelectTrigger className="w-36" aria-label="Filtrar por tipo">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="INCOME">Receitas</SelectItem>
              <SelectItem value="EXPENSE">Despesas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(value) => {setCategoryFilter(value ?? "todas");}}>
            <SelectTrigger className="w-40" aria-label="Filtrar por categoria">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas categorias</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden lg:table-cell">Conta</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Carregando transações...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {transactions.length === 0
                        ? 'Você ainda não tem transações. Clique em "Nova Transação" para começar.'
                        : 'Nenhuma transação encontrada com os filtros selecionados.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((tx) => {
                    const type = typeConfig[tx.type]
                    return (
                      <TableRow
                        key={tx.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(tx)}
                      >
                        <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">
                          {fullDate(tx.date)}
                        </TableCell>
                        <TableCell className="max-w-52 truncate font-medium">{tx.description}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{tx.category ?? EMPTY}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">{EMPTY}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary" className={cn('gap-1', type.className)}>
                            <type.icon className="size-3" aria-hidden="true" />
                            {type.label}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-semibold tabular-nums',
                            tx.signedAmount > 0 ? 'text-success' : 'text-foreground',
                          )}
                        >
                          {tx.signedAmount > 0 ? '+' : ''}
                          {formatBRL(tx.signedAmount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{EMPTY}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-pretty">{selected.description}</SheetTitle>
                <SheetDescription>Detalhes da transação</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-6">
                <p
                  className={cn(
                    'text-3xl font-semibold tabular-nums',
                    selected.signedAmount > 0 ? 'text-success' : 'text-foreground',
                  )}
                >
                  {selected.signedAmount > 0 ? '+' : ''}
                  {formatBRL(selected.signedAmount)}
                </p>
                <Separator />
                <dl className="flex flex-col gap-3 text-sm">
                  {[
                    ['Data', fullDate(selected.date)],
                    ['Categoria', selected.category ?? EMPTY],
                    ['Tipo', typeConfig[selected.type].label],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export function TransactionActions() {
  const { reload } = useTransactions()
  return (
    <>
      <ExportReportDialog />
      <NewTransactionModal onCreated={() => void reload()} />
    </>
  )
}
