type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
  remember?: boolean;
};

type AuthResult =
  | { success: true }
  | { success: false; error: string };

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: result?.error ?? "Não foi possível criar sua conta. Tente novamente.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}

export async function signIn(input: SignInInput): Promise<AuthResult> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: result?.error ?? "E-mail ou senha inválidos.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}