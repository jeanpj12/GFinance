"use server";

import { z } from "zod";
import { HTTPError } from "ky";

import { redirect } from "next/navigation";
import { addEmergencyFund } from "@/http/add-emergency-fund";

const addEmergencyFundShema = z.object({
  amount: z.coerce.number({ message: "amount is required" }),
  isPaid: z.coerce.boolean(),
  dueDate: z.coerce.date(),
});

export async function addEmergencyFundAction(data: FormData) {
  const raw = Object.fromEntries(data);

  const cleaned = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => {
      return [key, value === "" ? undefined : value];
    })
  );

  const emergencyFundData = addEmergencyFundShema.safeParse(cleaned);

  if (!emergencyFundData.success) {
    const errors = emergencyFundData.error.flatten().fieldErrors;
    return { sucess: false, message: null, errors };
  }

  const { amount, dueDate, isPaid } = emergencyFundData.data;

  console.log({
    amount,
    dueDate,
    isPaid,
  });

  try {
    const response = await addEmergencyFund({
      amount,
      dueDate,
      isPaid,
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
