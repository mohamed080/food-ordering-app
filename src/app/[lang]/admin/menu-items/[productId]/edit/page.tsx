import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getProduct, getProducts } from "@/server/db/product";
import { redirect } from "next/navigation";
import Form from "../../_components/Form";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    productId: product.id,
  }));
}
async function EditProductPage({
  params,
}: {
  params: Promise<{ lang: Locale; productId: string }>;
}) {
  const { productId, lang } = await params;
  const translations = await getTrans(lang);
  const categories = await getCategories();

  const product = await getProduct(productId);
  
  if (!product) {
    redirect(`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Form product={product} translations={translations} categories={categories}/>
        </div>
      </section>
    </main>
  );
}

export default EditProductPage;
