import { cache } from "@/lib/cache";
import prisma from "@/lib/prisma";

export const getProductsByCategory = cache(
  () => {
    const products = prisma.category.findMany({
      include: {
        products: {
          include: {
            sizes: true,
            extras: true,
          },
        },
      },
    });
    return products;
  },
  ["products-by-category"],
  { revalidate: 3600 }
);

export const getBestSellers = cache(
  (limit?: number | undefined) => {
    const bestSellers = prisma.product.findMany({
      where: {
        orders: {
          some: {},
        },
      },
      orderBy: [
       {
         orders: {
           _count: "desc",
         },
       }
    ],
      include: {
        sizes: true,
        extras: true,
      },
      take: limit,
    });
    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 3600, tags: ["products"] }
);
