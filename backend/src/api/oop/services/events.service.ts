import { formatLecturerData } from "@/lib/helpers/format-lecturer-data";
import { SessionRepository } from "@oop/repositories/session.repository";
import type {
  ExportedEvent,
  ExportFormat,
  ExportResult,
  Format,
  FormattedCalendarEvent,
  RawCalendarEvent,
} from "@oop/types/events.types";
import type { EventDateRangeQuery } from "@oop/validators/events.validator";

export class EventsService {
  constructor(private readonly sessionRepo: SessionRepository = new SessionRepository()) {}

  // Pobieranie skróconych danych o zajęciach z podanego zakresu dat dla widoku kalendarza
  async getEvents(query: EventDateRangeQuery): Promise<FormattedCalendarEvent[]> {
    const sessions: RawCalendarEvent[] = await this.sessionRepo.findByDateRange(query.start, query.end);

    // Mapowanie danych zajęć do formatu odpowiedniego dla widoku kalendarza
    const formattedEvents = this.#formatFindByDateRangeResult(sessions, query.format);

    return formattedEvents;
  }

  async deleteEvent(id: string): Promise<void> {
    // Sprawdzenie czy zajęcia o podanym ID istnieją
    await this.sessionRepo.findById(id);

    // Usunięcie zajęć o podanym ID
    await this.sessionRepo.deleteSession(id);
  }

  async exportEvents(format: ExportFormat): Promise<ExportResult> {
    // Pobieramy wszystkie zajęcia z bazy danych
    const sessions: RawCalendarEvent[] = await this.sessionRepo.getAllSessions();
    // Mapujemy surowe dane zajęć do formatu odpowiedniego dla eksportu
    const mapped = this.#mapToExportedEvents(sessions);

    // Generujemy plik do pobrania w zależności od wybranego formatu
    switch (format) {
      case "json":
        return this.#toJson(mapped);
      case "csv":
        return this.#toCsv(mapped);
      case "txt":
        return this.#toTxt(mapped);
    }
  }

  // Helper do generowania godzin w formacie "HH:mm"
  #getHours(startTime: Date, endTime: Date): string {
    const startTimeHour = startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const endTimeHour = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${startTimeHour}-${endTimeHour}`;
  }

  // Helper do generowania tytułu w podanym formacie
  #getTitleByFormat(format: Format, event: RawCalendarEvent): string {
    const roomName = event.room.name;
    if (format === "MONTH") {
      return `${this.#getHours(event.startTime, event.endTime)} | ${roomName}`;
    }

    const lecturerName = event.lecturer.firstName + " " + event.lecturer.lastName;
    const lecturerWithTitles = event.lecturer.titles ? `${lecturerName}, ${event.lecturer.titles}` : lecturerName;

    return `${this.#getHours(event.startTime, event.endTime)} | ${roomName} | ${lecturerWithTitles}`;
  }

  // Helper do formatowania danych zajęć do formatu odpowiedniego dla widoku kalendarza
  #formatFindByDateRangeResult(sessions: RawCalendarEvent[], format: Format): FormattedCalendarEvent[] {
    // Mapowanie danych zajęć do formatu odpowiedniego dla widoku kalendarza
    const formattedResult: FormattedCalendarEvent[] = sessions.map((session) => ({
      id: session.id,
      startDate: session.startTime,
      endDate: session.endTime,
      title: this.#getTitleByFormat(format, session),
    }));

    return formattedResult;
  }

  // Mapowanie surowych danych — wspólne dla wszystkich formatów
  #mapToExportedEvents(sessions: RawCalendarEvent[]): ExportedEvent[] {
    return sessions.map((session) => ({
      id: session.id,
      startDate: session.startTime,
      endDate: session.endTime,
      lecturer: formatLecturerData(session.lecturer).name,
      room: session.room.name,
      class: session.class.name,
    }));
  }

  // Generowanie pliku JSON do pobrania
  #toJson(events: ExportedEvent[]): ExportResult {
    return {
      content: JSON.stringify(events, null, 2),
      filename: `zajecia-${this.#today()}.json`,
      mimeType: "application/json",
    };
  }

  // Generowanie pliku CSV do pobrania
  #toCsv(events: ExportedEvent[]): ExportResult {
    const header = "id,startDate,endDate,lecturer,room,class";
    const rows = events.map(
      (e) => `${e.id},${e.startDate.toISOString()},${e.endDate.toISOString()},"${e.lecturer}","${e.room}","${e.class}"`,
    );
    return {
      content: [header, ...rows].join("\n"),
      filename: `zajecia-${this.#today()}.csv`,
      mimeType: "text/csv",
    };
  }

  // Generowanie pliku TXT do pobrania
  #toTxt(events: ExportedEvent[]): ExportResult {
    const content = events
      .map((e) =>
        [
          `ID: ${e.id}`,
          `Start: ${e.startDate.toISOString()}`,
          `Koniec: ${e.endDate.toISOString()}`,
          `Wykładowca: ${e.lecturer}`,
          `Sala: ${e.room}`,
          `Klasa: ${e.class}`,
        ].join("\n"),
      )
      .join("\n\n");

    return {
      content,
      filename: `zajecia-${this.#today()}.txt`,
      mimeType: "text/plain",
    };
  }

  #today(): string {
    // Pierwsze 10 znaków formatu ISO to data w formacie YYYY-MM-DD
    return new Date().toISOString().substring(0, 10);
  }
}
