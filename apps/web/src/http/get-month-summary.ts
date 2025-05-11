import { api } from "./api-client";

interface GetWeeklySummaryResponse {
  expense: number;
  income: number;
  dayMonth: string;
}

export interface GetMonthSummaryRequest {
  date: string;
}

export async function getMonthSummary({ date }: GetMonthSummaryRequest) {
  const response = await api
    .get(`metrics/month-summary/${date}`)
    .json<GetWeeklySummaryResponse[]>();

  return response;
}
