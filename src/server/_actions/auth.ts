"use server";

import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import prisma from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { loginSchema, signupSchema } from "@/validations/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export const login = async (
  credentials: { email: string; password: string } | undefined,
  lang: Locale
) => {
  const translations = await getTrans(lang);

  const result = loginSchema(translations).safeParse(credentials);

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user) {
      return {
        message: translations.messages.userNotFound,
        status: 401,
      };
    }
    const hashedPass = user.password;
    const isValidPass = await bcrypt.compare(result.data.password, hashedPass);
    if (!isValidPass) {
      return {
        message: translations.messages.incorrectPassword,
        status: 401,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPass } = user;
    return {
      user: userWithoutPass,
      status: 200,
      message: translations.messages.loginSuccessful,
    };
  } catch (err) {
    console.log(err);
    return {
      message: translations.messages.unexpectedError,
      status: 500,
    };
  }

  // continue login logic...
};

export const signup = async (prevState: unknown, formData: FormData) => {
  const lang = await getCurrentLocal();
  const translations = await getTrans(lang);
  const result = signupSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      formData,
      status: 400,
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (user)
      return {
        message: translations.messages.userAlreadyExists,
        formData,
        status: 409,
      };
    const hashedPass = await bcrypt.hash(result.data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: result.data.email,
        name: result.data.name,
        password: hashedPass,
      },
    });
    revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.USERS}/${newUser.id}/${Pages.EDIT}`);
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
      },
      status: 201,
      message: translations.messages.accountCreated,
    };

  } catch (err) {
    console.error(err);
    return {
      message: translations.messages.unexpectedError,
      status: 500,
    };
  }
  console.log(formData);
};
