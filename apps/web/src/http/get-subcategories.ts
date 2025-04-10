import { api } from "./api-client";

interface GetSubCategoriesResponse {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getSubCategories(id: string) {
  const response = await api
    .get(`subcategory/${id}`)
    .json<GetSubCategoriesResponse[]>();

  return response;
}
