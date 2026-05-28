import type { Context } from "hono";
import { EventsService } from "@oop/services/events.service";
import {
  formatValidationError,
  EventDateRangeValidator,
  type EventDateRangeQuery,
  CreateEventValidator,
  type CreateEventDto,
  DeleteEventValidator,
  type DeleteEventDto,
} from "@oop/validators/events.validator";
import { ValidationError } from "@lib/errors/app-errors";
import type { ExportFormat, FormattedCalendarEvent } from "@oop/types/events.types";
import { parseJsonBody } from "@lib/helpers/parse-json-body";
import { BookingService } from "@oop/services/booking.service";

export class EventsController {
  constructor(
    private readonly eventsService: EventsService = new EventsService(),
    private readonly bookingService: BookingService = new BookingService(),
    private readonly createEventValidator = CreateEventValidator,
    private readonly eventDateRangeQueryValidator = EventDateRangeValidator,
    private readonly deleteEventValidator = DeleteEventValidator,
  ) {}

  // Pobieranie skróconych danych o zajęciach z podanego zakresu dat dla widoku kalendarza
  async getEvents(c: Context) {
    // Pobieramy zakres dat z query params
    const { start, end, format } = c.req.query() as { start: string; end: string; format: string };

    // Sprawdzenie czy parametry istnieją
    if (!start || !end || !format) {
      console.error("EventsController - getEvents - missing query params:", { start, end, format });
      throw new ValidationError("Brak wymaganych parametrów 'start', 'end' lub 'format' w zapytaniu");
    }

    // Walidacja query params
    const validationResult = this.eventDateRangeQueryValidator.safeParse({ start, end, format });
    if (!validationResult.success) {
      console.error("EventsController - getEvents - validation error:", formatValidationError(validationResult.error));
      throw new ValidationError("Nieprawidłowe dane wejściowe");
    }
    const validatedData: EventDateRangeQuery = validationResult.data;

    // Pobieramy sformatowane dane o zajęciach z serwisu
    const events: FormattedCalendarEvent[] = await this.eventsService.getEvents(validatedData);

    return c.json({ events }, 200);
  }

  // Tworzenie nowego zajęcia
  async createEvent(c: Context) {
    // Pobieramy dane z body requestu
    const data: unknown = await parseJsonBody(c);

    // Walidacja danych
    const validationResult = this.createEventValidator.safeParse(data);
    if (!validationResult.success) {
      console.error(
        "EventsController - createEvent - validation error:",
        formatValidationError(validationResult.error),
      );
      throw new ValidationError("Nieprawidłowe dane wejściowe");
    }
    // Po walidacji, możemy bezpiecznie używać zweryfikowanych danych
    const validatedData: CreateEventDto = validationResult.data;

    // Tworzymy nowe zajęcia za pomocą serwisu
    const event = await this.bookingService.createEvent(validatedData);

    // Zwracamy dane nowo utworzonego zajęcia i status 201 Created
    return c.json({ event }, 201);
  }

  // Usuwanie zajęcia po ID
  async deleteEvent(c: Context) {
    const data = c.req.param();

    if (Object.keys(data).length === 0 || !data.id) {
      throw new ValidationError("Brak ID zajęcia do usunięcia");
    }

    const validationResult = this.deleteEventValidator.safeParse(data);
    if (!validationResult.success) {
      console.error(
        "EventsController - deleteEvent - validation error:",
        formatValidationError(validationResult.error),
      );
      throw new ValidationError("Nieprawidłowe dane wejściowe");
    }
    const { id }: DeleteEventDto = validationResult.data;

    await this.eventsService.deleteEvent(id);

    return c.json({ message: "Zajęcia zostały usunięte" }, 200);
  }

  // Eksport danych o zajęciach w wybranym formacie
  async exportEvents(c: Context) {
    const format = c.req.query("format") as ExportFormat;

    // Walidacja formatu
    if (!["json", "csv", "txt"].includes(format)) {
      throw new ValidationError("Format musi być jednym z: json, csv, txt");
    }

    // Pobieramy dane do eksportu z serwisu
    const result = await this.eventsService.exportEvents(format);

    // Ustawiamy odpowiedni Content-Type dla pliku do pobrania
    c.header("Content-Type", result.mimeType);

    // Ustawiamy nagłówek Content-Disposition, aby zasugerować przeglądarce, że odpowiedź jest plikiem do pobrania
    c.header("Content-Disposition", `attachment; filename="${result.filename}"`);

    // Zwracamy zawartość pliku do pobrania
    return c.body(result.content);
  }
}
