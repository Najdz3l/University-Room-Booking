import type { ApplicationEnvironment } from "@lib/types/env.types";

export const ENV: ApplicationEnvironment = {
  NODE_ENV: Bun.env.NODE_ENV || "development",
  PORT: Number(Bun.env.PORT) || 3000,
  DATABASE_URL: Bun.env.DATABASE_URL || "postgresql://username:password@localhost:5432/dbname",
  FRONTEND_URL: Bun.env.FRONTEND_URL || "http://localhost:8080",
  PRISMA_LOG: Bun.env.PRISMA_LOG === "true" || false,
  PRISMA_LOG_SEEDING: Bun.env.PRISMA_LOG_SEEDING === "true" || false,
} as const;
