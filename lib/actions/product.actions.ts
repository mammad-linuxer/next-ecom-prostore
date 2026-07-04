"use server";
// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { prisma } from "@/db/prisma";

// Get the Latest Products
export async function getLatestProducts() {
  // const connectionString = process.env.DATABASE_URL;
  // const adapter = new PrismaPg({ connectionString: connectionString });
  // const prisma = new PrismaClient({ adapter });
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  // console.log(data);
  return convertToPlainObject(data);
}

// Get sing Product by its slug

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({ where: { slug: slug } });
}
