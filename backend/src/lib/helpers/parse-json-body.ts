import { ValidationError } from "@lib/errors/app-errors";
import type { Context } from "hono";

// Helper do parsowania danych z body requestu i obsługi błędów związanych z tym procesem
export const parseJsonBody = async (c: Context): Promise<unknown> => {
  try {
    const data = await c.req.json();
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      throw new ValidationError("Brak danych w żądaniu");
    }
    return data;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new ValidationError("Nie można odczytać danych z żądania");
  }
};
