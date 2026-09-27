import { PageHeader } from '@/components/page-header'
import { TransactionActions, TransactionsView } from '@/components/transaction/transactions-view'
import { TransactionsProvider } from '@/components/transaction/transactions-context'

export default function TransacoesPage() {
  return (
    <TransactionsProvider>
      <div className="mx-auto flex max-w-7xl flex-col">
        <PageHeader
          title="Transações"
          description="Extrato completo de todas as suas movimentações"
        >
          <TransactionActions />
        </PageHeader>
        <TransactionsView />
      </div>
    </TransactionsProvider>
  )
}
