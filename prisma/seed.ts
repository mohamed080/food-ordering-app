import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const pizzaData: Prisma.ProductCreateInput[] = [
  {
    name: "Margherita",
    description:
      "Classic Margherita pizza with mozzarella, tomato sauce, and basil",
    image: "https://picsum.photos/id/1025/400/300",
    order: 1,
    basePrice: 6.99,
  },
  {
    name: "Pepperoni",
    description: "Pepperoni pizza with cheese and tomato sauce",
    image: "https://picsum.photos/id/1040/400/300",
    order: 2,
    basePrice: 8.5,
  },
  {
    name: "BBQ Chicken",
    description: "BBQ sauce, grilled chicken, onion, and cheese",
    image: "https://picsum.photos/id/1050/400/300",
    order: 3,
    basePrice: 9.99,
  },
  {
    name: "Veggie Supreme",
    description: "Bell peppers, onions, olives, mushrooms, and cheese",
    image: "https://picsum.photos/id/1060/400/300",
    order: 4,
    basePrice: 7.5,
  },
  {
    name: "Hawaiian",
    description: "Ham, pineapple, and cheese",
    image: "https://picsum.photos/id/1070/400/300",
    order: 5,
    basePrice: 8.0,
  },
  {
    name: "Meat Lovers",
    description: "Pepperoni, sausage, bacon, ham, and cheese",
    image: "https://picsum.photos/id/1080/400/300",
    order: 6,
    basePrice: 10.5,
  },
];

export async function main() {
  console.log(`Start seeding ...`);
  for (const p of pizzaData) {
    const pizza = await prisma.product.create({
      data: p,
    });
    console.log(`Created pizza with id: ${pizza.id}`);
  }
  console.log(`Seeding finished.`);
}

main();
