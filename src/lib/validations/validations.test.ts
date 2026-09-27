import { describe, expect, it } from "vitest";
import { transactionSchema } from "./transaction-schema";
import { loginSchema } from "./login-schema";
import { registerSchema } from "./register-schema";

describe("transactionSchema", () => {
  const valid = {
    description: "Supermercado",
    amount: "350.90",
    type: "EXPENSE",
    category: "Alimentação",
    date: "2026-09-27",
  };

  it("aceita uma despesa válida e converte o valor para número", () => {
    const parsed = transactionSchema.parse(valid);
    expect(parsed.amount).toBe(350.9);
    expect(parsed.type).toBe("EXPENSE");
  });

  it("rejeita valor zero ou negativo", () => {
    expect(transactionSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false);
    expect(transactionSchema.safeParse({ ...valid, amount: -10 }).success).toBe(false);
  });

  it("rejeita descrição vazia e tipo desconhecido", () => {
    expect(transactionSchema.safeParse({ ...valid, description: "" }).success).toBe(false);
    expect(transactionSchema.safeParse({ ...valid, type: "TRANSFER" }).success).toBe(false);
  });

  it("categoria é opcional", () => {
    const { category: _omit, ...withoutCategory } = valid;
    void _omit;
    expect(transactionSchema.safeParse(withoutCategory).success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("exige e-mail válido e senha", () => {
    expect(loginSchema.safeParse({ email: "ana@finora.com", password: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "ana", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "ana@finora.com", password: "" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("exige senha forte (8+ caracteres, maiúscula e número)", () => {
    const base = { name: "Ana", email: "ana@finora.com" };
    expect(registerSchema.safeParse({ ...base, password: "Senha123" }).success).toBe(true);
    expect(registerSchema.safeParse({ ...base, password: "senha123" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, password: "SenhaForte" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, password: "S1" }).success).toBe(false);
  });
});
