import { api } from "./api-client";

interface AddCategoryRequest {
  name: string;
  type: string;
}

type AddCategoryResponse = void;

export async function addCategory({
  name,
  type,
}: AddCategoryRequest): Promise<AddCategoryResponse> {
  await api.post("category", {
    body: JSON.stringify({
      name,
      type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
