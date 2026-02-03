'use server';

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import prisma from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
    const lang = await getCurrentLocal();
    const translations = await getTrans(lang);
    try {
        await prisma.user.delete({
            where: {
                id,
            },
        });
        revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.USERS}`);
        revalidatePath(`/${lang}/${Routes.ADMIN}/${Pages.USERS}/${id}/${Pages.EDIT}`);
        return {
            status: 200,
            message: translations.messages.deleteUserSucess 
        }
    }catch(error) {
        console.log(error);
        return {
            error: translations.messages.unexpectedError,
            status: 500
        }
    }
}   
