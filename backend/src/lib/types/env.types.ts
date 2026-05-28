export type ApplicationEnvironment = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  PRISMA_LOG: boolean;
  PRISMA_LOG_SEEDING: boolean;
};
