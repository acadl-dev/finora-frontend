'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bell, Menu, Search, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from '@/app/layout/sidebar-nav'
import { ThemeToggle } from '@/app/layout/theme-toggle'

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-6 py-5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">Fluxo</span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-svh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <BrandMark />
        <div className="flex-1 overflow-y-auto pb-6">
          <SidebarNav />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">MC</AvatarFallback>
            </Avatar>
             {/*TODO: Alguma extensão esta quebrando o componente Avatar, provavelmente o Google Tradutor*/}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Ailton Costa</p>
              <p className="truncate text-xs text-muted-foreground">Plano Premium</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
                className="group/button inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
                aria-label="Abrir menu"
                >
                <Menu className="size-5" />
                </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <BrandMark />
              <div className="flex-1 overflow-y-auto pb-6">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative hidden max-w-sm flex-1 md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar transações, contas, metas..."
              className="h-9 border-transparent bg-muted pl-9 shadow-none focus-visible:bg-background"
              aria-label="Buscar"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
              <Link href="/notificacoes" aria-label="Notificações — 3 não lidas">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-4" aria-hidden="true" />
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" aria-hidden="true" />
                </Button>
              </Link>
            <Avatar className="ml-1 size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">MC</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
