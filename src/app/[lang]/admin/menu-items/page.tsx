import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { ArrowRightCircle } from "lucide-react";
import MenuItems from "./_components/MenuItems";
import { getProducts } from "@/server/db/product";

async function MenuItemsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const lang = (await params).lang;
  const translations = await getTrans(lang);
  const products = await getProducts();

  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Link
            href={`/${lang}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
            className={`${buttonVariants({
              variant: "outline",
            })} mx-auto! flex! w-80! h-10! mb-8`}
          >
            {translations.admin["menu-items"].createNewMenuItem}
            <ArrowRightCircle
              className={`w-5! h-5! ${
                lang === Languages.ARABIC ? "rotate-180" : ""
              }`}
            />
          </Link>
          <MenuItems products={products} />
        </div>
      </section>
    </main>
  );
}

export default MenuItemsPage;
