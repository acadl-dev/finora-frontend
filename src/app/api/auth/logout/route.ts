import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

// POST /api/auth/logout -> remove os cookies de sessão (access e refresh token).
// Antes o arquivo estava vazio, o que quebrava o "next build" de produção
// (o Next exige que todo route.ts seja um módulo que exporte um método HTTP).
export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
