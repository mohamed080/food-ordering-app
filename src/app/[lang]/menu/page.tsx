import Menu from "@/components/menu";
import { getProductsByCategory } from "@/server/db/product";

async function MenuPage() {
  const categorites = await getProductsByCategory();
  return (
    <main>
      {categorites.map((category) => (
        <section key={category.id} className="section-gap">
          <div className="container text-center">
            <h1 className="text-primary text-4xl font-bold italic mb-6">
              {category.name}
            </h1>
            <Menu items={category.products } />
          </div>
        </section>
      ))}
    </main>
  );
}

export default MenuPage;
