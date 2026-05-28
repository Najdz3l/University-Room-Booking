import type { Context } from "hono";
import {
  getEvents as serviceGetEvents,
  deleteEvent as serviceDeleteEvent,
  exportEvents as serviceExportEvents,
} from "@declarative/services/events.service";
import { createEvent as serviceCreateEvent } from "@declarative/services/booking.service";
import {
  formatValidationError,
  EventDateRangeValidator,
  type EventDateRangeQuery,
  CreateEventValidator,
  type CreateEventDto,
  DeleteEventValidator,
  type DeleteEventDto,
} from "@declarative/validators/events.validator";
import { ValidationError } from "@/lib/errors/app-errors";
import type { ExportFormat, FormattedCalendarEvent } from "@declarative/types/events.types";
import { parseJsonBody } from "@/lib/helpers/parse-json-body";

const throwError = (err: Error): never => {
  throw err;
};

// Pobieranie skróconych danych o zajęciach z podanego zakresu dat dla widoku kalendarza
export const getEvents = async (c: Context) => {
  // Pobieramy zakres dat z query params
  const { start, end, format } = c.req.query() as { start: string; end: string; format: string };

  // Sprawdzenie czy parametry istnieją
  start && end && format
    ? null
    : (() => {
        console.error("EventsController - getEvents - missing query params:", { start, end, format });
        throwError(new ValidationError("Brak wymaganych parametrów 'start', 'end' lub 'format' w zapytaniu"));
      })();

  // Walidacja query params
  const validationResult = EventDateRangeValidator.safeParse({ start, end, format });
  const validatedData: EventDateRangeQuery = validationResult.success
    ? validationResult.data
    : (() => {
        console.error(
          "EventsController - getEvents - validation error:",
          formatValidationError(validationResult.error),
        );
        return throwError(new ValidationError("Nieprawidłowe dane wejściowe"));
      })();

  // Pobieramy sformatowane dane o zajęciach z serwisu
  const events: FormattedCalendarEvent[] = await serviceGetEvents(validatedData);

  return c.json({ events }, 200);
};

// Tworzenie nowego zajęcia
export const createEvent = async (c: Context) => {
  // Pobieramy dane z body requestu
  const data: unknown = await parseJsonBody(c);

  // Walidacja danych
  const validationResult = CreateEventValidator.safeParse(data);
  const validatedData: CreateEventDto = validationResult.success
    ? validationResult.data
    : (() => {
        console.error(
          "EventsController - createEvent - validation error:",
          formatValidationError(validationResult.error),
        );
        return throwError(new ValidationError("Nieprawidłowe dane wejściowe"));
      })();

  // Tworzymy nowe zajęcia za pomocą serwisu
  const event = await serviceCreateEvent(validatedData);

  // Zwracamy dane nowo utworzonego zajęcia i status 201 Created
  return c.json({ event }, 201);
};

// Usuwanie zajęcia po ID
export const deleteEvent = async (c: Context) => {
  const data = c.req.param();

  Object.keys(data).length > 0 && data.id ? null : throwError(new ValidationError("Brak ID zajęcia do usunięcia"));

  const validationResult = DeleteEventValidator.safeParse(data);
  const { id }: DeleteEventDto = validationResult.success
    ? validationResult.data
    : (() => {
        console.error(
          "EventsController - deleteEvent - validation error:",
          formatValidationError(validationResult.error),
        );
        return throwError(new ValidationError("Nieprawidłowe dane wejściowe"));
      })();

  await serviceDeleteEvent(id);

  return c.json({ message: "Zajęcia zostały usunięte" }, 200);
};

// Eksport danych o zajęciach w wybranym formacie
export const exportEvents = async (c: Context) => {
  const format = c.req.query("format") as ExportFormat;

  // Walidacja formatu
  ["json", "csv", "txt"].includes(format)
    ? null
    : throwError(new ValidationError("Format musi być jednym z: json, csv, txt"));

  // Pobieramy dane do eksportu z serwisu
  const result = await serviceExportEvents(format);

  // Ustawiamy odpowiedni Content-Type dla pliku do pobrania
  c.header("Content-Type", result.mimeType);

  // Ustawiamy nagłówek Content-Disposition, aby zasugerować przeglądarce, że odpowiedź jest plikiem do pobrania
  c.header("Content-Disposition", `attachment; filename="${result.filename}"`);

  // Zwracamy zawartość pliku do pobrania
  return c.body(result.content);
};
