
"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { signUp } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"

//Regras para escolher a senha do usuário. Alinhar com a API:
const passwordRules = [
  { label: "Ao menos 8 caracteres", test: (v: string) => v.length >= 8 },
  { label: "Uma letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Um número", test: (v: string) => /[0-9]/.test(v) },
]

export function SignupForm(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [terms, setTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!name || !email || !password) {
            setError("Preencha todos os campos para continuar.")
            return
        }
        if (!passwordRules.every((r) => r.test(password))) {
            setError("Sua senha não atende aos requisitos mínimos.")
            return
        }
        if (!terms) {
            setError("Você precisa aceitar os termos de uso.")
            return
        }

        setLoading(true)
        const result = await signUp({ name, email, password })
        setLoading(false)

        if (!result.success) {
            setError(result.error)
            return
        }
        router.push("/login") 
        // ou "/dashboard" se optar por auto-login futuramente
    }

    

    return(
        <div>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Criar conta
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Comece a organizar suas finanças gratuitamente.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {password.length > 0 && (
            <ul className="mt-1 flex flex-col gap-1">
              {passwordRules.map((rule) => {
                const ok = rule.test(password)
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs ${
                      ok ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Check
                      className={`size-3.5 ${ok ? "opacity-100" : "opacity-40"}`}
                      aria-hidden="true"
                    />
                    {rule.label}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(v) => setTerms(v === true)}
            disabled={loading}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-relaxed text-muted-foreground">
            Aceito os{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              termos de uso
            </Link>{" "}
            e a{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              política de privacidade
            </Link>
            .
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
    )
}