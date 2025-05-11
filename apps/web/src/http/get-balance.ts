import { api } from "./api-client";

export interface GetBalanceResponse {
  month: string;
  incomes: string;
  expenses: string;
  balance: string;
  initial: string;
  predicted: string;
}

export interface GetBalanceRequest {
  date: string;
}

export async function getBalance({ date }: GetBalanceRequest) {
  const response = await api
    .get(`metrics/balance/${date}`)
    .json<GetBalanceResponse[]>();

  return response;
}
