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

// reports-service (geração assíncrona via RabbitMQ)
export type ReportStatus = "REQUESTED" | "READY" | "FAILED";

export type ReportDTO = {
  id: string;
  status: ReportStatus;
  fileName: string;
  format: "XLSX";
  periodStart: string | null;
  periodEnd: string | null;
  periodDescription: string;
  totalIncome: number | null;
  totalExpense: number | null;
  balance: number | null;   // receitas − despesas (null enquanto REQUESTED)
  entryCount: number | null;
  failureReason: string | null;
  requestedAt: string;
  completedAt: string | null;
};
