import { defineConfig } from "prisma/config";
import type { PrismaConfig } from "prisma";
import { ENV } from "./src/lib/constants/env"; //! Cała ścieżka ponieważ prisma nie potrafi wczytać aliasów

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: ENV.DATABASE_URL,
  },
}) satisfies PrismaConfig;
