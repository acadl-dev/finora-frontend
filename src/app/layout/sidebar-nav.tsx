'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  //LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  //PieChart,
  //Target,
  //TrendingUp,
  //Building2,
  //CalendarClock,
  //HandCoins,
  //BarChart3,
  //Sparkles,
  //Bell,
  //Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const navItems = [
  //{ label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Transações', href: '/transacoes', icon: ArrowLeftRight },
  { label: 'Contas', href: '/contas', icon: Landmark },
  { label: 'Cartões', href: '/cartoes', icon: CreditCard },
  //{ label: 'Orçamentos', href: '/orcamentos', icon: PieChart },
 //{ label: 'Metas Financeiras', href: '/metas', icon: Target },
  //{ label: 'Investimentos', href: '/investimentos', icon: TrendingUp },
  //{ label: 'Patrimônio', href: '/patrimonio', icon: Building2 },
  //{ label: 'Contas a Pagar', href: '/contas-a-pagar', icon: CalendarClock },
  //{ label: 'Contas a Receber', href: '/contas-a-receber', icon: HandCoins },
  //{ label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  //{ label: 'Insights', href: '/insights', icon: Sparkles },
 // { label: 'Notificações', href: '/notificacoes', icon: Bell },
  //{ label: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-0.5 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
          >
            <item.icon
              className={cn('size-4 shrink-0', isActive ? 'text-sidebar-primary' : 'text-muted-foreground')}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
