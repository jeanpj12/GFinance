"use server";

import { z } from "zod";
import { HTTPError } from "ky";

import { redirect } from "next/navigation";
import { addCategory } from "@/http/add-category";
import { addSubcategory } from "@/http/add-subcategory";

const addSubcategorySchema = z.object({
  name: z.string(),
  categoryId: z.string().uuid({ message: "Category required" }),
});

export async function addSubcategoryAction(data: FormData) {
  const raw = Object.fromEntries(data);

  const cleaned = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => {
      return [key, value === "" ? undefined : value];
    })
  );

  const subcategoryData = addSubcategorySchema.safeParse(cleaned);

  if (!subcategoryData.success) {
    const errors = subcategoryData.error.flatten().fieldErrors;
    return { sucess: false, message: null, errors };
  }

  const { name, categoryId } = subcategoryData.data;

  console.log({
    name,
    categoryId,
  });

  try {
    const response = await addSubcategory({
      name,
      categoryId,
    });
    return {
      sucess: true,
      message: "Subcategory added successfully.",
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
