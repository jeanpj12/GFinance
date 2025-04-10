import { api } from "./api-client";

interface GetWeeklySummaryResponse {
  expense: number;
  income: number;
  dayMonth: string;
}

export async function getWeeklySummary() {
  const response = await api.get("metrics/weekly-summary").json<GetWeeklySummaryResponse[]>();

  return response;
}
