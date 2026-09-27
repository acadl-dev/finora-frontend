import { NextRequest, NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api/client";
import { setSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/login-schema";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { remember, ...credentials } = body;

  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const data = await apiClient.post<LoginResponse>("/auth/login", parsed.data);

    await setSession(data.accessToken, data.refreshToken, Boolean(remember));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return NextResponse.json({ error: "E-mail ou senha inválidos" }, { status: 401 });
    }
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}