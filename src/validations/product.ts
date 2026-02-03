import { Translations } from "@/types/translations";
import z from "zod";

const imageSchema = (isRequired: boolean, translations: Translations) => {
    return !isRequired? z.custom(val => val instanceof File):
    z.custom((val) => {
        if (typeof val !== "object" || !val) {
            return false;
        } 
        if(!(val instanceof File)){
            return false;
        }
        const validMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif", "image/svg"];
        return validMimeTypes.includes(val.type);
    }, {
        message: translations.admin["menu-items"].form.image.validation.required,
    });
}
const getCommonValidations = (translations: Translations) =>{
    return {
        name: z.string().trim().min(1, { message: translations.admin["menu-items"].form.name.validation.required,}),
        description: z.string().trim().min(1, { message: translations.admin["menu-items"].form.description.validation.required,}),
        basePrice: z.string().min(1, { message: translations.admin["menu-items"].form.basePrice.validation.required,}),
        categoryId: z.string().min(1, { message: translations.admin["menu-items"].form.category.validation.required,}),
    }
};
export const addProductSchema = (translations: Translations) => z.object({
    ...getCommonValidations(translations),
    image: imageSchema(true,translations),
});
export const updateProductSchema = (translations: Translations) => z.object({
    ...getCommonValidations(translations),
    image: imageSchema(false,translations),
});