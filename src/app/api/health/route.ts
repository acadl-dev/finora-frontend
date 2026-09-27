import { NextResponse } from "next/server";

// Health check usado pelo Kubernetes (liveness/readiness) e pelo Docker.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "UP" });
}
