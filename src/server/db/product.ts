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
        },
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
  { revalidate: 3600}
);

export const getProducts = cache(
  () => {
    const products = prisma.product.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return products;
  },
  ["products"],
  { revalidate: 3600 }
);

export const getProduct = cache(
  (id: string) => {
    const product = prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        sizes: true,
        extras: true,
      }
    });
    return product;
  },
  [`product-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);
