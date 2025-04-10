import { api } from "./api-client";

export interface GetBalanceResponse {
  month: string;
  incomes: string;
  expenses: string;
  balance: string;
  initial: string;
  predicted: string;
}

export async function getBalance() {
  const response = await api
    .get("metrics/balance")
    .json<GetBalanceResponse[]>();

  return response;
}
