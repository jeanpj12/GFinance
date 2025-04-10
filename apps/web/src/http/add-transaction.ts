import { api } from "./api-client";

interface AddTransactionRequest {
  name: string;
  amount: number;
  description?: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  subCategoryId?: string;
  isPaid: boolean;
  dueDate: Date;
  datePost?: Date;
  toEmergencyFund: boolean;
}

type AddTransactionResponse = void;

export async function addTransaction({
  amount,
  categoryId,
  datePost,
  description,
  dueDate,
  isPaid,
  name,
  subCategoryId,
  toEmergencyFund,
  type,
}: AddTransactionRequest): Promise<AddTransactionResponse> {
  await api.post("transaction", {
    body: JSON.stringify({
      amount,
      categoryId,
      datePost: datePost
        ? new Date(datePost).toISOString()
        : new Date().toISOString(),
      description,
      dueDate: new Date(dueDate).toISOString(),
      isPaid,
      name,
      subCategoryId,
      toEmergencyFund,
      type,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
