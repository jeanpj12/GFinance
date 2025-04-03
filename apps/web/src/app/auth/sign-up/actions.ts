"use server";

import { z } from "zod";
import { HTTPError } from "ky";
import { redirect } from "next/navigation";
import { signUp } from "@/http/sign-up";

const signUpSchemma = z
  .object({
    firstName: z.string().trim().min(3, {
      message: "First Name is required and must be at least 3 characters long.",
    }),
    lastName: z.string().trim().min(3, {
      message: "Last Name is required and must be at least 3 characters long.",
    }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export async function signUpAction(data: FormData) {
  const signUpData = signUpSchemma.safeParse(Object.fromEntries(data));

  if (!signUpData.success) {
    const errors = signUpData.error.flatten().fieldErrors;
    return { sucess: false, message: null, errors };
  }

  const { firstName, lastName, email, password } = signUpData.data;

  try {
    await signUp({
      firstName,
      lastName,
      email,
      password,
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

  redirect("/auth/sign-in");
}
