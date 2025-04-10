import { api } from "./api-client";

interface AddCategoryRequest {
  name: string;
}

type AddCategoryResponse = void;

export async function addCategory({
  name,
}: AddCategoryRequest): Promise<AddCategoryResponse> {
  await api.post("category", {
    body: JSON.stringify({
      name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
