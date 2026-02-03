"use server";

import { Pages, Routes } from "@/constants/enums";
import {
  Extra,
  ExtraIngredients,
  ProductSizes,
  Size,
} from "@/generated/prisma";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import prisma from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addProductSchema, updateProductSchema } from "@/validations/product";
import { revalidatePath } from "next/cache";

const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "product_images");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    const image = (await response.json()) as { url: string };
    return image.url;
  } catch (err) {
    console.log("Error uploading image to cloudinary", err);
  }
};

export const addProduct = async (
  args: {
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData,
) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  const result = addProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (result.success === false)
    return { error: result.error.flatten().fieldErrors, status: 400, formData };

  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;
  try {
    if (imageUrl) {
      await prisma.product.create({
        data: {
          ...data,
          image: imageUrl,
          basePrice,
          categoryId: args.categoryId,
          sizes: {
            createMany: {
              data: args.options.sizes.map((size) => ({
                name: size.name as ProductSizes,
                price: Number(size.price),
              })),
            },
          },
          extras: {
            createMany: {
              data: args.options.extras.map((extra) => ({
                name: extra.name as ExtraIngredients,
                price: Number(extra.price),
              })),
            },
          },
        },
      });
      revalidatePath(`/${lang}/${Routes.MENU}`);
      revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      revalidatePath(`/${lang}`);
      return {
        status: 201,
        message: translations.messages.productAdded,
      };
    }
    return {};
  } catch (err) {
    console.log(err);
    return { error: translations.messages.unexpectedError, status: 500 };
  }
};

export const updateProduct = async (
  args: {
    productId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData,
) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  const result = updateProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (result.success === false)
    return { error: result.error.flatten().fieldErrors, status: 400, formData };
  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;

  const product = await prisma.product.findUnique({
    where: { id: args.productId },
  });
  if (!product) {
    return { error: translations.messages.unexpectedError, status: 400 };
  }
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: args.productId,
      },
      data: {
        ...data,
        basePrice,
        image: imageUrl ?? product.image,
      },
    });

    await prisma.size.deleteMany({
      where: {
        productId: args.productId,
      },
    });

    await prisma.size.createMany({
      data: args.options.sizes.map((size) => ({
        productId: args.productId,
        name: size.name as ProductSizes,
        price: Number(size.price),
      })),
    });

    await prisma.extra.deleteMany({
      where: {
        productId: args.productId,
      },
    });

    await prisma.extra.createMany({
      data: args.options.extras.map((extra) => ({
        productId: args.productId,
        name: extra.name as ExtraIngredients,
        price: Number(extra.price),
      })),
    });
    revalidatePath(`/${lang}/${Routes.MENU}`);
    revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${updatedProduct.id}/${Pages.EDIT}`,
    );
    revalidatePath(`/${lang}`);
    return { status: 200, message: translations.messages.updateProductSucess };
  } catch (err) {
    console.log("errr", err);
    return { error: translations.messages.unexpectedError, status: 500 };
  }
};

export const deleteProduct = async (id: string) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/${lang}/${Routes.MENU}`);
    revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/${Pages.EDIT}`,
    );
    revalidatePath(`/${lang}`);
    return { status: 200, message: translations.messages.deleteProductSucess };
  } catch (err) {
    console.log(err);
    return { error: translations.messages.unexpectedError, status: 500 };
  }
};
