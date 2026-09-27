import type { ReactNode } from "react"
import { Wallet, TrendingUp, ShieldCheck, PiggyBank } from "lucide-react"

const highlights = [
  {
    icon: TrendingUp,
    title: "Acompanhe tudo",
    description: "Visualize receitas e despesas em tempo real.",
  },
  {
    icon: PiggyBank,
    title: "Economize mais",
    description: "Defina metas e alcance seus objetivos.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro",
    description: "Seus dados protegidos de ponta a ponta.",
  },
]

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full">
      {/* Painel de marca — visível em telas grandes */}
      <aside className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Wallet className="size-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Finora</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-balance text-3xl font-semibold leading-tight lg:text-4xl">
            Tenha controle total das suas finanças.
          </h1>
          <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
            Organize seu dinheiro, entenda seus gastos e planeje o futuro em um
            único lugar.
          </p>

          <ul className="mt-10 flex flex-col gap-6">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm leading-relaxed text-primary-foreground/75">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/70">
          {"\u00A9"} {new Date().getFullYear()} Finora. Todos os direitos
          reservados.
        </p>
      </aside>

      {/* Área do formulário */}
      <section className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Marca no topo para mobile */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="size-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Finora</span>
          </div>
          {children}
        </div>
      </section>
    </main>
  )
}
