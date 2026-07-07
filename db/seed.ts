// import "dotenv/config";
// import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
import sampleData from "./sample-data";
import { prisma } from "@/db/prisma";

async function main() {
  //   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  //   const prisma = new PrismaClient({ adapter });

  /*Deleting all the data in the database*/
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  /*create data from sampleData*/
  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log("Database Seeded Successfully");
}

main();

// FOR EXECUTING THIS FILE, JUST USE THE COMMAND:
// npx tsx --env-file=.env ./db/seed.ts
