import { api } from "./api-client";

export interface GetLastTransactionsResponse {
  id: string;
  name: string;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  subCategoryId: string;
  isPaid: boolean;
  dueDate: string;
}

export async function getLastTransactions() {
  const response = await api
    .get("metrics/last-transactions")
    .json<GetLastTransactionsResponse[]>();

  return response;
}
