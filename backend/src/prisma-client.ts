import { PrismaClient, type Prisma } from "../prisma/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "@lib/constants/env.js";

const adapter = new PrismaPg({
  connectionString: ENV.DATABASE_URL,
});

const PrismaClientConfig: Prisma.PrismaClientOptions = {
  adapter,
  log: ENV.PRISMA_LOG ? (["query"] as const) : [],
};

const prisma = new PrismaClient({
  ...PrismaClientConfig,
});

export default prisma;
