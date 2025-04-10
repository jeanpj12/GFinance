import { api } from "./api-client";

interface AddSubcategoryRequest {
  name: string;
  categoryId: string;
}

type AddSubcategoryResponse = void;

export async function addSubcategory({
  name,
  categoryId,
}: AddSubcategoryRequest): Promise<AddSubcategoryResponse> {
  await api.post("subcategory", {
    body: JSON.stringify({
      name,
      categoryId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
