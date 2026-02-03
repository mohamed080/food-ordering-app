"use server";
import { Pages, Routes } from "@/constants/enums";
import { UserRole } from "@/generated/prisma";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import prisma from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { updateProfileSchema } from "@/validations/profile";
import { revalidatePath } from "next/cache";

export const updateProfile = async (isAdmin: boolean,prevState: unknown, formData: FormData) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  const result = updateProfileSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      formData,
      status: 400,
    };
  }
  const data = result.data;
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return {
        error: translations.messages.userNotFound,
        status: 401,
        formData,
      };
    }
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        ...data,
        image: imageUrl ?? user.image,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });
    revalidatePath(`/${lang}/${Routes.PROFILE}`);
    revalidatePath(`/${lang}/${Routes.ADMIN}`);
    revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${lang}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`
    );
    return {
      status: 200,
      message: translations.messages.updateProfileSucess,
    }
  } catch (err) {
    console.log(err);
    return {
      error: translations.messages.unexpectedError,
      status: 500,
    };
  }
};

const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "profile_images");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const image = (await response.json()) as { url: string };
    return image.url;
  } catch (err) {
    console.log("Error uploading image to cloudinary", err);
  }
};
