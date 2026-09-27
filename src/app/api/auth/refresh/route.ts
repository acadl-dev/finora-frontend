import { NextResponse } from "next/server";

// POST /api/auth/refresh -> renovação de sessão ainda não suportada pelo backend
// (não há endpoint /auth/refresh no finora). Responde 501 de forma explícita em vez
// de um arquivo vazio, que quebrava o "next build" de produção.
export async function POST() {
  return NextResponse.json(
    { error: "Renovação de sessão ainda não implementada. Faça login novamente." },
    { status: 501 }
  );
}
