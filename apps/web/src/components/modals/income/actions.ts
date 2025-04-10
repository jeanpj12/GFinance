"use server";

import { z } from "zod";
import { HTTPError } from "ky";

import { redirect } from "next/navigation";
import { addTransaction } from "@/http/add-transaction";
import { toast } from "sonner";

const addIncomeShema = z.object({
  name: z.string({ message: "title is required" }).trim(),
  amount: z.coerce.number({ message: "amount is required" }),
  description: z.string().optional(),
  categoryId: z.string({ message: "category is required" }).uuid(),
  subCategoryId: z.string().uuid().optional(),
  isPaid: z.coerce.boolean(),
  dueDate: z.coerce.date(),
});

export async function addIncome(data: FormData) {
  const raw = Object.fromEntries(data);

  const cleaned = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => {
      return [key, value === "" ? undefined : value];
    })
  );

  const incomeData = addIncomeShema.safeParse(cleaned);

  if (!incomeData.success) {
    const errors = incomeData.error.flatten().fieldErrors;
    return { sucess: false, message: null, errors };
  }

  const {
    amount,
    categoryId,
    description,
    dueDate,
    isPaid,
    name,
    subCategoryId,
  } = incomeData.data;

  const datePost = new Date();
  const toEmergencyFund = false;
  const type = "INCOME";

  console.log({
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
  });

  try {
    const response = await addTransaction({
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
    });
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();
      return { sucess: false, message, errors: null };
    }

    console.error(err);

    return {
      sucess: false,
      message: "Unexpected error, try again in a few minutes.",
      errors: null,
    };
  }

  redirect("/");
}
