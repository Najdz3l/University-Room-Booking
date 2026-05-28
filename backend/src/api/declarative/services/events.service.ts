import { formatLecturerData } from "@/lib/helpers/format-lecturer-data";
import {
  findSessionsByDateRange,
  findSessionById,
  deleteSessionById,
  getAllSessions,
} from "@declarative/repositories/session.repository";
import type {
  ExportedEvent,
  ExportFormat,
  ExportResult,
  Format,
  FormattedCalendarEvent,
  RawCalendarEvent,
} from "@declarative/types/events.types";
import type { EventDateRangeQuery } from "@declarative/validators/events.validator";

// Helper do generowania godzin w formacie "HH:mm"
const getHours = (startTime: Date, endTime: Date): string =>
  `${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}-${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`;

// Obiekt logiczny mapujący formaty na funkcje formatujące tytuł (zastępuje if/switch)
const titleFormatters: Record<Format, (event: RawCalendarEvent) => string> = {
  MONTH: (event) => `${getHours(event.startTime, event.endTime)} | ${event.room.name}`,
  DAY: (event) => {
    const lecturerName = `${event.lecturer.firstName} ${event.lecturer.lastName}`;
    const lecturerWithTitles = event.lecturer.titles ? `${lecturerName}, ${event.lecturer.titles}` : lecturerName;
    return `${getHours(event.startTime, event.endTime)} | ${event.room.name} | ${lecturerWithTitles}`;
  },
};

// Helper do generowania tytułu w podanym formacie
const getTitleByFormat = (format: Format, event: RawCalendarEvent): string => titleFormatters[format](event);

// Helper do formatowania danych zajęć do formatu odpowiedniego dla widoku kalendarza
const formatFindByDateRangeResult = (sessions: RawCalendarEvent[], format: Format): FormattedCalendarEvent[] =>
  sessions.map((session) => ({
    id: session.id,
    startDate: session.startTime,
    endDate: session.endTime,
    title: getTitleByFormat(format, session),
  }));

// Pobieranie skróconych danych o zajęciach z podanego zakresu dat dla widoku kalendarza
export const getEvents = async (query: EventDateRangeQuery): Promise<FormattedCalendarEvent[]> =>
  formatFindByDateRangeResult(await findSessionsByDateRange(query.start, query.end), query.format);

export const deleteEvent = async (id: string): Promise<void> => {
  // Sprawdzenie czy zajęcia o podanym ID istnieją
  await findSessionById(id);
  // Usunięcie zajęć o podanym ID
  await deleteSessionById(id);
};

// Mapowanie surowych danych — wspólne dla wszystkich formatów
const mapToExportedEvents = (sessions: RawCalendarEvent[]): ExportedEvent[] =>
  sessions.map((session) => ({
    id: session.id,
    startDate: session.startTime,
    endDate: session.endTime,
    lecturer: formatLecturerData(session.lecturer).name,
    room: session.room.name,
    class: session.class.name,
  }));

const today = (): string => new Date().toISOString().substring(0, 10);

// Generowanie pliku JSON do pobrania
const toJson = (events: ExportedEvent[]): ExportResult => ({
  content: JSON.stringify(events, null, 2),
  filename: `zajecia-${today()}.json`,
  mimeType: "application/json",
});

// Generowanie pliku CSV do pobrania
const toCsv = (events: ExportedEvent[]): ExportResult => ({
  content: [
    "id,startDate,endDate,lecturer,room,class",
    ...events.map(
      (e) => `${e.id},${e.startDate.toISOString()},${e.endDate.toISOString()},"${e.lecturer}","${e.room}","${e.class}"`,
    ),
  ].join("\n"),
  filename: `zajecia-${today()}.csv`,
  mimeType: "text/csv",
});

// Generowanie pliku TXT do pobrania
const toTxt = (events: ExportedEvent[]): ExportResult => ({
  content: events
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
    .join("\n\n"),
  filename: `zajecia-${today()}.txt`,
  mimeType: "text/plain",
});

// Obiekt logiczny mapujący format zapisu na generatory (zastępuje switch)
const exportHandlers: Record<ExportFormat, (events: ExportedEvent[]) => ExportResult> = {
  json: toJson,
  csv: toCsv,
  txt: toTxt,
};

export const exportEvents = async (format: ExportFormat): Promise<ExportResult> =>
  exportHandlers[format](mapToExportedEvents(await getAllSessions()));
