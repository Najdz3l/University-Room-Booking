import type { Context } from "hono";
import { AppError } from "@lib/errors/app-errors";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errorHandler = (err: Error, c: Context) => {
  // Błędy które sami rzucamy — znamy status i kod
  if (err instanceof AppError) {
    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      err.statusCode as ContentfulStatusCode,
    );
  }

  // Nieoczekiwany błąd — loguj i zwróć 500
  console.error("Nieoczekiwany błąd:", err);

  return c.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Coś poszło nie tak",
      },
    },
    500 as ContentfulStatusCode,
  );
};
