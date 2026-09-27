import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";

const PROTECTED_ROUTES = ["/transacoes", "/dashboard"];
const AUTH_ROUTES = ["/login", "/cadastro"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/transacoes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/transacoes/:path*", "/dashboard/:path*", "/login", "/cadastro"],
};