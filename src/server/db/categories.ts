import { cache } from "@/lib/cache";
import prisma from "@/lib/prisma";

export const getCategories = cache(
  () => {
    const categories = prisma.category.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return categories;
  },
  ["categories"],
  { revalidate: 3600 }
);
