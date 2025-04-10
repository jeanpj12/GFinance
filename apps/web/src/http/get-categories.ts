import { api } from "./api-client";

interface GetCategoriesResponse {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCategories() {
  const response = await api.get("category").json<GetCategoriesResponse[]>();

  return response;
}
