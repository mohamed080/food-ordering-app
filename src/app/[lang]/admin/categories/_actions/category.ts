"use server";

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import prisma from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addCategorySchema, updateCategorySchema } from "@/validations/category";
import { revalidatePath } from "next/cache";

export const addCategory = async (prevState: unknown, formData: FormData) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  const result = addCategorySchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false)
    return { error: result.error.flatten().fieldErrors, status: 400 };
  const data = result.data;
  try {
    await prisma.category.create({
        data,
    })
    revalidatePath(`${lang}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
    revalidatePath(`${lang}/${Routes.MENU}`);

    return {
        status: 201,
        message: translations.messages.categoryAdded
    }
  } catch (err) {
    console.log(err);
    return { error: translations.messages.unexpectedError, status: 500 };
  }
};
export const updateCategory = async (id: string,prevState: unknown, formData: FormData) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  const result = updateCategorySchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false)
    return { error: result.error.flatten().fieldErrors, status: 400 };
  const data = result.data;
  try {
    await prisma.category.update({
        where: {
            id
        },
        data: {
            name: data.categoryName,
        }
    })
    revalidatePath(`${lang}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
    revalidatePath(`${lang}/${Routes.MENU}`);

    return {
        status: 200,
        message: translations.messages.updatecategorySucess
    }
  } catch (err) {
    console.log(err);
    return { error: translations.messages.unexpectedError, status: 500,
        message: translations.messages.unexpectedError
     };
  }
};

export const deleteCategory = async (id: string) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });
    revalidatePath(`${lang}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
    revalidatePath(`${lang}/${Routes.MENU}`);
    return {
      status: 200,
      message: translations.messages.deleteCategorySucess,
    };
  } catch (err) {
    console.log(err);
    return { error: translations.messages.unexpectedError, status: 500 };
  }
}