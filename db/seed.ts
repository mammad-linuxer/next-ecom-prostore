// import "dotenv/config";
// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import sampleData from "./sample-data";
import { prisma } from "@/db/prisma";

async function main() {
  //   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  //   const prisma = new PrismaClient({ adapter });
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

  console.log("Database Seeded Successfully");
}

main();

// FOR EXECUTING THIS FILE, JUST USE THE COMMAND:
// npx tsx --env-file=.env ./db/seed.ts
