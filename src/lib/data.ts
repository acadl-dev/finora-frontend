export function formatBRL(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    ...options,
  }).format(value)
}

export function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export type Transaction = {
  id: string
  date: string
  description: string
  category: string
  account: string
  type: 'receita' | 'despesa' | 'transferencia'
  amount: number
  status: 'confirmada' | 'pendente' | 'agendada'
  paymentMethod: string
  tags: string[]
  notes?: string
}

export const transactions: Transaction[] = [
  { id: 't1', date: '2026-07-01', description: 'Salário — Empresa XYZ', category: 'Salário', account: 'Nubank', type: 'receita', amount: 12500, status: 'confirmada', paymentMethod: 'Transferência', tags: ['renda-fixa'] },
  { id: 't2', date: '2026-07-01', description: 'Aluguel apartamento', category: 'Moradia', account: 'Itaú', type: 'despesa', amount: -2800, status: 'confirmada', paymentMethod: 'PIX', tags: ['fixo'] },
  { id: 't3', date: '2026-06-30', description: 'Supermercado Pão de Açúcar', category: 'Mercado', account: 'Nubank', type: 'despesa', amount: -486.32, status: 'confirmada', paymentMethod: 'Cartão de crédito', tags: ['alimentação'] },
  { id: 't4', date: '2026-06-29', description: 'Transferência para Reserva', category: 'Transferência', account: 'Nubank', type: 'transferencia', amount: -1500, status: 'confirmada', paymentMethod: 'PIX', tags: ['reserva'] },
  { id: 't5', date: '2026-06-28', description: 'Netflix', category: 'Assinaturas', account: 'Cartão Nubank', type: 'despesa', amount: -55.9, status: 'confirmada', paymentMethod: 'Cartão de crédito', tags: ['assinatura', 'lazer'] },
  { id: 't6', date: '2026-06-28', description: 'Uber — corridas semana', category: 'Transporte', account: 'Cartão Nubank', type: 'despesa', amount: -87.4, status: 'confirmada', paymentMethod: 'Cartão de crédito', tags: [] },
  { id: 't7', date: '2026-06-27', description: 'Freelance — projeto site', category: 'Renda extra', account: 'Inter', type: 'receita', amount: 3200, status: 'confirmada', paymentMethod: 'PIX', tags: ['freelance'] },
  { id: 't8', date: '2026-06-26', description: 'Farmácia Droga Raia', category: 'Saúde', account: 'Nubank', type: 'despesa', amount: -134.5, status: 'confirmada', paymentMethod: 'Débito', tags: [] },
  { id: 't9', date: '2026-06-25', description: 'Restaurante Coco Bambu', category: 'Lazer', account: 'Cartão Itaú', type: 'despesa', amount: -312.8, status: 'confirmada', paymentMethod: 'Cartão de crédito', tags: ['lazer'] },
  { id: 't10', date: '2026-06-24', description: 'Conta de luz — Enel', category: 'Moradia', account: 'Itaú', type: 'despesa', amount: -218.65, status: 'confirmada', paymentMethod: 'Débito automático', tags: ['fixo'] },
  { id: 't11', date: '2026-06-23', description: 'Academia SmartFit', category: 'Saúde', account: 'Cartão Nubank', type: 'despesa', amount: -119.9, status: 'confirmada', paymentMethod: 'Cartão de crédito', tags: ['assinatura'] },
  { id: 't12', date: '2026-06-22', description: 'Dividendos — ITSA4', category: 'Investimentos', account: 'XP Investimentos', type: 'receita', amount: 186.4, status: 'confirmada', paymentMethod: 'Crédito em conta', tags: ['dividendos'] },
  { id: 't13', date: '2026-06-20', description: 'Internet — Vivo Fibra', category: 'Moradia', account: 'Itaú', type: 'despesa', amount: -129.99, status: 'confirmada', paymentMethod: 'Débito automático', tags: ['fixo'] },
  { id: 't14', date: '2026-06-18', description: 'Posto Shell — gasolina', category: 'Transporte', account: 'Cartão Itaú', type: 'despesa', amount: -280, status: 'confirmada', paymentMethod: 'Cartão de crédito', tags: [] },
  { id: 't15', date: '2026-07-05', description: 'Fatura Cartão Nubank', category: 'Cartão', account: 'Nubank', type: 'despesa', amount: -3245.18, status: 'agendada', paymentMethod: 'Débito automático', tags: ['fatura'] },
]

export type Account = {
  id: string
  name: string
  bank: string
  type: string
  balance: number
  lastMovement: string
  color: string
}

export const accounts: Account[] = [
  { id: 'a1', name: 'Conta Principal', bank: 'Nubank', type: 'Conta corrente', balance: 18432.75, lastMovement: '2026-07-01', color: 'chart-1' },
  { id: 'a2', name: 'Conta Salário', bank: 'Itaú', type: 'Conta corrente', balance: 6218.4, lastMovement: '2026-06-30', color: 'chart-3' },
  { id: 'a3', name: 'Conta Digital', bank: 'Inter', type: 'Conta corrente', balance: 4890.12, lastMovement: '2026-06-27', color: 'chart-4' },
  { id: 'a4', name: 'Reserva de Emergência', bank: 'Nubank', type: 'Poupança', balance: 15000, lastMovement: '2026-06-29', color: 'chart-2' },
]

export type CreditCard = {
  id: string
  name: string
  brand: string
  limit: number
  used: number
  nextInvoice: number
  dueDay: number
  closingDay: number
  lastDigits: string
}

export const creditCards: CreditCard[] = [
  { id: 'c1', name: 'Nubank Ultravioleta', brand: 'Mastercard', limit: 15000, used: 3245.18, nextInvoice: 3245.18, dueDay: 5, closingDay: 28, lastDigits: '4821' },
  { id: 'c2', name: 'Itaú Personnalité', brand: 'Visa', limit: 22000, used: 5920.4, nextInvoice: 5920.4, dueDay: 10, closingDay: 3, lastDigits: '7736' },
  { id: 'c3', name: 'Inter Gold', brand: 'Mastercard', limit: 8000, used: 1120.9, nextInvoice: 1120.9, dueDay: 15, closingDay: 8, lastDigits: '2104' },
]

export type Budget = {
  id: string
  category: string
  spent: number
  limit: number
}

export const budgets: Budget[] = [
  { id: 'b1', category: 'Mercado', spent: 820, limit: 1000 },
  { id: 'b2', category: 'Transporte', spent: 367.4, limit: 600 },
  { id: 'b3', category: 'Lazer', spent: 650, limit: 650 },
  { id: 'b4', category: 'Moradia', spent: 3148.64, limit: 3500 },
  { id: 'b5', category: 'Saúde', spent: 254.4, limit: 500 },
  { id: 'b6', category: 'Assinaturas', spent: 175.8, limit: 250 },
  { id: 'b7', category: 'Educação', spent: 189, limit: 400 },
  { id: 'b8', category: 'Vestuário', spent: 0, limit: 300 },
]

export type Goal = {
  id: string
  name: string
  saved: number
  target: number
  deadline: string
  monthlyContribution: number
}

export const goals: Goal[] = [
  { id: 'g1', name: 'Reserva de Emergência', saved: 15000, target: 20000, deadline: '2026-12-31', monthlyContribution: 1500 },
  { id: 'g2', name: 'Viagem para Europa', saved: 8200, target: 18000, deadline: '2027-06-30', monthlyContribution: 900 },
  { id: 'g3', name: 'Entrada do Apartamento', saved: 42000, target: 120000, deadline: '2029-01-31', monthlyContribution: 2500 },
  { id: 'g4', name: 'Trocar de Carro', saved: 27500, target: 45000, deadline: '2027-10-31', monthlyContribution: 1200 },
]

export type Investment = {
  id: string
  type: string
  asset: string
  quantity: number
  invested: number
  current: number
}

export const investments: Investment[] = [
  { id: 'i1', type: 'Ações', asset: 'ITSA4', quantity: 800, invested: 7200, current: 8640 },
  { id: 'i2', type: 'Ações', asset: 'PETR4', quantity: 300, invested: 9600, current: 11250 },
  { id: 'i3', type: 'FIIs', asset: 'MXRF11', quantity: 500, invested: 5150, current: 5400 },
  { id: 'i4', type: 'FIIs', asset: 'HGLG11', quantity: 40, invested: 6480, current: 6912 },
  { id: 'i5', type: 'Renda Fixa', asset: 'Tesouro IPCA+ 2035', quantity: 4, invested: 12800, current: 14336 },
  { id: 'i6', type: 'Renda Fixa', asset: 'CDB Inter 110% CDI', quantity: 1, invested: 10000, current: 11240 },
  { id: 'i7', type: 'ETFs', asset: 'IVVB11', quantity: 60, invested: 15600, current: 18720 },
  { id: 'i8', type: 'Cripto', asset: 'Bitcoin', quantity: 0.05, invested: 14000, current: 17150 },
]

export type Asset = {
  id: string
  name: string
  category: 'Imóvel' | 'Veículo' | 'Equipamentos' | 'Outros'
  purchaseValue: number
  currentValue: number
  purchaseDate: string
}

export const patrimonyAssets: Asset[] = [
  { id: 'p1', name: 'Apartamento — Pinheiros', category: 'Imóvel', purchaseValue: 480000, currentValue: 545000, purchaseDate: '2022-03-15' },
  { id: 'p2', name: 'Honda Civic 2023', category: 'Veículo', purchaseValue: 145000, currentValue: 118000, purchaseDate: '2023-01-20' },
  { id: 'p3', name: 'MacBook Pro M3', category: 'Equipamentos', purchaseValue: 18500, currentValue: 13800, purchaseDate: '2024-06-10' },
  { id: 'p4', name: 'Coleção de relógios', category: 'Outros', purchaseValue: 22000, currentValue: 26500, purchaseDate: '2021-08-05' },
]

export type Bill = {
  id: string
  description: string
  amount: number
  dueDate: string
  status: 'pago' | 'pendente' | 'atrasado' | 'recebido'
  category: string
}

export const billsToPay: Bill[] = [
  { id: 'bp1', description: 'Fatura Cartão Nubank', amount: 3245.18, dueDate: '2026-07-05', status: 'pendente', category: 'Cartão' },
  { id: 'bp2', description: 'Aluguel', amount: 2800, dueDate: '2026-07-05', status: 'pendente', category: 'Moradia' },
  { id: 'bp3', description: 'Condomínio', amount: 850, dueDate: '2026-07-08', status: 'pendente', category: 'Moradia' },
  { id: 'bp4', description: 'Fatura Cartão Itaú', amount: 5920.4, dueDate: '2026-07-10', status: 'pendente', category: 'Cartão' },
  { id: 'bp5', description: 'Plano de saúde', amount: 689.9, dueDate: '2026-07-12', status: 'pendente', category: 'Saúde' },
  { id: 'bp6', description: 'IPVA parcela 4/5', amount: 720, dueDate: '2026-06-28', status: 'atrasado', category: 'Impostos' },
  { id: 'bp7', description: 'Conta de luz', amount: 218.65, dueDate: '2026-06-24', status: 'pago', category: 'Moradia' },
  { id: 'bp8', description: 'Internet Vivo Fibra', amount: 129.99, dueDate: '2026-06-20', status: 'pago', category: 'Moradia' },
]

export const billsToReceive: Bill[] = [
  { id: 'br1', description: 'Freelance — projeto app', amount: 4500, dueDate: '2026-07-15', status: 'pendente', category: 'Renda extra' },
  { id: 'br2', description: 'Reembolso plano de saúde', amount: 380, dueDate: '2026-07-08', status: 'pendente', category: 'Saúde' },
  { id: 'br3', description: 'Aluguel sala comercial', amount: 1900, dueDate: '2026-07-10', status: 'pendente', category: 'Renda extra' },
  { id: 'br4', description: 'Dividendos — carteira FIIs', amount: 214.3, dueDate: '2026-06-25', status: 'recebido', category: 'Investimentos' },
  { id: 'br5', description: 'Empréstimo — João', amount: 800, dueDate: '2026-06-15', status: 'atrasado', category: 'Outros' },
  { id: 'br6', description: 'Freelance — consultoria', amount: 3200, dueDate: '2026-06-27', status: 'recebido', category: 'Renda extra' },
]

export type Insight = {
  id: string
  title: string
  description: string
  priority: 'alta' | 'média' | 'baixa'
  impact: string
  recommendation: string
  type: 'alerta' | 'oportunidade' | 'conquista'
}

export const insights: Insight[] = [
  {
    id: 'in1',
    title: 'Gastos com alimentação subiram 18%',
    description: 'Você gastou 18% mais com alimentação este mês em comparação com a média dos últimos 3 meses.',
    priority: 'alta',
    impact: 'R$ 312 acima da média mensal',
    recommendation: 'Revise os gastos com delivery, que representam 42% do aumento.',
    type: 'alerta',
  },
  {
    id: 'in2',
    title: 'Seu patrimônio cresceu 6%',
    description: 'A valorização dos investimentos e do imóvel elevou seu patrimônio líquido em 6% no trimestre.',
    priority: 'baixa',
    impact: '+ R$ 48.300 no trimestre',
    recommendation: 'Continue com os aportes mensais para manter o ritmo de crescimento.',
    type: 'conquista',
  },
  {
    id: 'in3',
    title: 'Economia potencial em assinaturas',
    description: 'É possível economizar R$ 420 por ano reduzindo gastos com assinaturas pouco utilizadas.',
    priority: 'média',
    impact: 'R$ 420/ano de economia potencial',
    recommendation: 'Cancele 2 assinaturas de streaming sem uso nos últimos 60 dias.',
    type: 'oportunidade',
  },
  {
    id: 'in4',
    title: 'Orçamento de lazer ultrapassado',
    description: 'Seu orçamento de lazer atingiu 100% do limite com 5 dias ainda restantes no mês.',
    priority: 'alta',
    impact: 'R$ 650 de R$ 650 utilizados',
    recommendation: 'Evite novos gastos na categoria até o fechamento do mês.',
    type: 'alerta',
  },
  {
    id: 'in5',
    title: 'Reserva de emergência quase completa',
    description: 'Faltam apenas R$ 5.000 para atingir sua meta de reserva de emergência.',
    priority: 'baixa',
    impact: '75% da meta concluída',
    recommendation: 'Mantendo o aporte atual, você conclui a meta em 4 meses.',
    type: 'conquista',
  },
  {
    id: 'in6',
    title: 'Fatura do Itaú acima do padrão',
    description: 'A fatura do cartão Itaú está 34% acima da sua média histórica.',
    priority: 'média',
    impact: 'R$ 1.505 acima da média',
    recommendation: 'Verifique a compra parcelada no valor de R$ 1.680 realizada em 14/06.',
    type: 'alerta',
  },
]

export type Notification = {
  id: string
  title: string
  description: string
  date: string
  type: 'vencimento' | 'meta' | 'orcamento' | 'receita' | 'despesa' | 'lembrete'
  read: boolean
}

export const notifications: Notification[] = [
  { id: 'n1', title: 'Fatura Nubank vence em 3 dias', description: 'Fatura de R$ 3.245,18 com vencimento em 05/07.', date: '2026-07-02', type: 'vencimento', read: false },
  { id: 'n2', title: 'Orçamento de Lazer excedido', description: 'Você atingiu 100% do limite de R$ 650 da categoria Lazer.', date: '2026-07-01', type: 'orcamento', read: false },
  { id: 'n3', title: 'Nova receita registrada', description: 'Salário de R$ 12.500,00 creditado na conta Nubank.', date: '2026-07-01', type: 'receita', read: false },
  { id: 'n4', title: 'IPVA em atraso', description: 'A parcela 4/5 do IPVA de R$ 720,00 venceu em 28/06.', date: '2026-06-29', type: 'vencimento', read: true },
  { id: 'n5', title: 'Meta 75% concluída', description: 'Sua Reserva de Emergência atingiu 75% da meta de R$ 20.000.', date: '2026-06-29', type: 'meta', read: true },
  { id: 'n6', title: 'Nova despesa alta detectada', description: 'Despesa de R$ 486,32 no Supermercado Pão de Açúcar.', date: '2026-06-30', type: 'despesa', read: true },
  { id: 'n7', title: 'Lembrete: aporte mensal', description: 'Não esqueça do aporte de R$ 1.500 para a Reserva de Emergência.', date: '2026-06-28', type: 'lembrete', read: true },
  { id: 'n8', title: 'Dividendos recebidos', description: 'Você recebeu R$ 186,40 em dividendos de ITSA4.', date: '2026-06-22', type: 'receita', read: true },
]

export const monthlyFlow = [
  { month: 'Jan', receitas: 13800, despesas: 9450 },
  { month: 'Fev', receitas: 12900, despesas: 10120 },
  { month: 'Mar', receitas: 15400, despesas: 9870 },
  { month: 'Abr', receitas: 13200, despesas: 11340 },
  { month: 'Mai', receitas: 14600, despesas: 10025 },
  { month: 'Jun', receitas: 15886, despesas: 10683 },
]

export const netWorthHistory = [
  { month: 'Jan', valor: 748000 },
  { month: 'Fev', valor: 762500 },
  { month: 'Mar', valor: 771200 },
  { month: 'Abr', valor: 780400 },
  { month: 'Mai', valor: 796800 },
  { month: 'Jun', valor: 812340 },
]

export const expensesByCategory = [
  { category: 'Moradia', value: 3148.64 },
  { category: 'Cartão', value: 2105.3 },
  { category: 'Mercado', value: 820 },
  { category: 'Lazer', value: 650 },
  { category: 'Transporte', value: 367.4 },
  { category: 'Saúde', value: 254.4 },
  { category: 'Assinaturas', value: 175.8 },
]

export const categories = [
  'Moradia', 'Mercado', 'Transporte', 'Lazer', 'Saúde', 'Assinaturas',
  'Educação', 'Vestuário', 'Salário', 'Renda extra', 'Investimentos',
  'Impostos', 'Cartão', 'Transferência', 'Outros',
]

export const summary = {
  totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
  monthIncome: 15886.4,
  monthExpenses: 10683.44,
  monthSavings: 5202.96,
  netWorth: 812340,
  totalInvested: investments.reduce((sum, i) => sum + i.current, 0),
  healthScore: 82,
}
