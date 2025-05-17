import { api } from "./api-client";

export interface GetTransactionsResponse {
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

interface GetTransactionRequest {
  date: string;
}

export async function getTransactions({ date }: GetTransactionRequest) {
  const response = await api
    .get(`transaction/?date=${date}`)
    .json<GetTransactionsResponse[]>();

  return response;
}
