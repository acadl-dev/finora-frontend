// Contratos (DTOs) expostos pela API do backend Spring.

export type TransactionType = "INCOME" | "EXPENSE";

export type TransactionDTO = {
  id: string;
  description: string;
  amount: number;        // sempre positivo
  signedAmount: number;  // positivo para receitas, negativo para despesas
  type: TransactionType;
  category: string | null;
  date: string;          // yyyy-MM-dd
  createdAt: string;
};

// reports-service
export type ReportHistoryDTO = {
  id: string;
  fileName: string;
  format: "XLSX";
  periodStart: string | null;
  periodEnd: string | null;
  periodDescription: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;       // receitas − despesas
  entryCount: number;
  generatedAt: string;
};
