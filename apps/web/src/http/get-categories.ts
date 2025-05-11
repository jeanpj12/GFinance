import { api } from "./api-client";

interface GetCategoriesResponse {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCategories(type: "EXPENSE" | "INCOME") {
  const response = await api.get(`category/${type}`).json<GetCategoriesResponse[] | []>();
  return response;
}
