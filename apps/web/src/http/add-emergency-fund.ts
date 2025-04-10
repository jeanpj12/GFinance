import { api } from "./api-client";

interface AddEmergencyFundRequest {
  amount: number;
  isPaid: boolean;
  dueDate: Date;
}

type AddEmergencyFundResponse = void;

export async function addEmergencyFund({
  amount,
  dueDate,
  isPaid,
}: AddEmergencyFundRequest): Promise<AddEmergencyFundResponse> {
  await api.post("transaction/emergency-funds", {
    body: JSON.stringify({
      amount,
      dueDate: new Date(dueDate).toISOString(),
      isPaid,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
