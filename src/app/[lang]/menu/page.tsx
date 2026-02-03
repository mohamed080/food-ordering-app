import Menu from "@/components/menu";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getProductsByCategory } from "@/server/db/product";

async function MenuPage({params}: {params: Promise<{lang: Locale}>}) {
  const lang = (await params).lang;
  const translations = await getTrans(lang);
  const categorites = await getProductsByCategory();

  return (
    <main>
      {categorites.length > 0 ? (
        categorites.map((category) => (
            <section key={category.id} className="section-gap">
              <div className="container text-center">
                <h1 className="text-primary text-4xl font-bold italic mb-6">
                  {category.name}
                </h1>
                <Menu items={category.products} />
              </div>
            </section>
          ))
      ) : (
        <p className="text-accent text-center py-20">{translations.noProductsFound}</p>
      )}
    </main>
  );
}

export default MenuPage;
