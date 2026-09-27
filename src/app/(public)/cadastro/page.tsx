import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/auth-shell';
import { SignupForm } from '@/components/auth/signup-form'


export const metadata: Metadata = {
  title: 'Criar conta - Finora',
  description: 'Crie sua conta no Finora.',
};

export default function CadastroPage() {
  return (
    <AuthShell>
        <SignupForm />
    </AuthShell>
  )
}