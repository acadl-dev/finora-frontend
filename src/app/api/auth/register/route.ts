import { NextRequest, NextResponse } from "next/server";
import { apiClient, ApiError } from "@/lib/api/client";
import { registerSchema } from "@/lib/validations/register-schema";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await apiClient.post("/auth/register", parsed.data);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      // e-mail já cadastrado, por exemplo
      if (error.status === 409) {
        return NextResponse.json(
          { error: "Este e-mail já está cadastrado" },
          { status: 409 }
        );
      }
      if (error.status === 400) {
        console.error("Erro: 400. error.status", error.status, "error.body", error.body);
        return NextResponse.json(
          { error: "Dados inválidos", details: error.body },
          { status: 400 }
        );
      }
    }
    console.error("Erro no cadastro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}