"use server";

import { z } from "zod";
import { HTTPError } from "ky";

import { redirect } from "next/navigation";
import { addCategory } from "@/http/add-category";

const addCategorySchema = z.object({
  name: z.string(),
});

export async function addCategoryAction(data: FormData) {
  const raw = Object.fromEntries(data);

  const cleaned = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => {
      return [key, value === "" ? undefined : value];
    })
  );

  const categoryData = addCategorySchema.safeParse(cleaned);

  if (!categoryData.success) {
    const errors = categoryData.error.flatten().fieldErrors;
    return { sucess: false, message: null, errors };
  }

  const { name } = categoryData.data;

  console.log({
    name,
  });

  try {
    const response = await addCategory({
      name,
    });
    return {
      sucess: true,
      message: "Category added successfully.",
      errors: null,
    };
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
}
