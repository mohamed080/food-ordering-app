import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import Form from "./_components/Form";
import CategoryItem from "./_components/CategoryItem";

async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const categories = await getCategories();
  const lang = (await params).lang;
  const translations = await getTrans(lang);
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <div className="sm:max-w-156.25 mx-auto space-y-6">
            <Form translations={translations} />
            {categories.length > 0 ? (
              <ul className="space-y-4">
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </ul>
            ) : (
              <p className="text-accent text-center py-10">
                {translations.noCategoriesFound}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CategoriesPage;
