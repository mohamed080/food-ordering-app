import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getCurrentLocal } from "@/lib/getCurrentLocal";
import getTrans from "@/lib/translation";
import { getBestSellers } from "@/server/db/product";

async function BestSellers() {
  const bestSellers = await getBestSellers(3);
  const locale = await getCurrentLocal();
  const { home } = await getTrans(locale);
  const {bestSeller} = home;
  return (
    <section>
      <div className="container">
        <div className="text-center mb-4">
          <MainHeading title={bestSeller.title} subTitle={bestSeller.checkOut} />
        </div>
        <Menu items={bestSellers} />
      </div>
    </section>
  );
}

export default BestSellers;
