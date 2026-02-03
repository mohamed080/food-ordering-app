import { Locale } from "@/i18n.config"
import getTrans from "@/lib/translation";
import Form from "../_components/Form";
import { getCategories } from "@/server/db/categories";
import { redirect } from "next/navigation";
import { Pages, Routes } from "@/constants/enums";

async function NewProductPage({params}: {params: Promise<{lang: Locale}>}) {
    const lang = (await params).lang
    const translations = await getTrans(lang);

    const categories = await getCategories();

    if(!categories ||categories.length === 0) {
        redirect(`${lang}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
    }
  return (
    <main>
        <div className="section-gap">
            <div className="container">
                <Form translations={translations} categories={categories} />
            </div>
        </div>
    </main>
  )
}

export default NewProductPage