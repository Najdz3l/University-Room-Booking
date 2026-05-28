import { formatLecturerData } from "@/lib/helpers/format-lecturer-data";
import {
  findSessionsByDateRange,
  findSessionById,
  deleteSessionById,
  getAllSessions,
} from "@fp/repositories/session.repository";
import type {
  ExportedEvent,
  ExportFormat,
  ExportResult,
  Format,
  FormattedCalendarEvent,
  RawCalendarEvent,
} from "@fp/types/events.types";
import type { EventDateRangeQuery } from "@fp/validators/events.validator";

// Helper do generowania godzin w formacie "HH:mm"
const getHours = (startTime: Date, endTime: Date): string => {
  const startTimeHour = startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const endTimeHour = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${startTimeHour}-${endTimeHour}`;
};

// Helper do generowania tytułu w podanym formacie
const getTitleByFormat = (format: Format, event: RawCalendarEvent): string => {
  const roomName = event.room.name;
  if (format === "MONTH") {
    return `${getHours(event.startTime, event.endTime)} | ${roomName}`;
  }

  const lecturerName = event.lecturer.firstName + " " + event.lecturer.lastName;
  const lecturerWithTitles = event.lecturer.titles ? `${lecturerName}, ${event.lecturer.titles}` : lecturerName;

  return `${getHours(event.startTime, event.endTime)} | ${roomName} | ${lecturerWithTitles}`;
};

// Helper do formatowania danych zajęć do formatu odpowiedniego dla widoku kalendarza
const formatFindByDateRangeResult = (sessions: RawCalendarEvent[], format: Format): FormattedCalendarEvent[] => {
  // Mapowanie danych zajęć do formatu odpowiedniego dla widoku kalendarza
  return sessions.map((session) => ({
    id: session.id,
    startDate: session.startTime,
    endDate: session.endTime,
    title: getTitleByFormat(format, session),
  }));
};

// Pobieranie skróconych danych o zajęciach z podanego zakresu dat dla widoku kalendarza
export const getEvents = async (query: EventDateRangeQuery): Promise<FormattedCalendarEvent[]> => {
  const sessions = await findSessionsByDateRange(query.start, query.end);
  // Mapowanie danych zajęć do formatu odpowiedniego dla widoku kalendarza
  return formatFindByDateRangeResult(sessions, query.format);
};

export const deleteEvent = async (id: string): Promise<void> => {
  // Sprawdzenie czy zajęcia o podanym ID istnieją
  await findSessionById(id);

  // Usunięcie zajęć o podanym ID
  await deleteSessionById(id);
};

// Mapowanie surowych danych — wspólne dla wszystkich formatów
const mapToExportedEvents = (sessions: RawCalendarEvent[]): ExportedEvent[] => {
  // Mapowanie danych zajęć do formatu odpowiedniego dla widoku kalendarza
  return sessions.map((session) => ({
    id: session.id,
    startDate: session.startTime,
    endDate: session.endTime,
    lecturer: formatLecturerData(session.lecturer).name,
    room: session.room.name,
    class: session.class.name,
  }));
};

const today = (): string => {
  // Pierwsze 10 znaków formatu ISO to data w formacie YYYY-MM-DD
  return new Date().toISOString().substring(0, 10);
};

// Generowanie pliku JSON do pobrania
const toJson = (events: ExportedEvent[]): ExportResult => {
  return {
    content: JSON.stringify(events, null, 2),
    filename: `zajecia-${today()}.json`,
    mimeType: "application/json",
  };
};

// Generowanie pliku CSV do pobrania
const toCsv = (events: ExportedEvent[]): ExportResult => {
  const header = "id,startDate,endDate,lecturer,room,class";
  const rows = events.map(
    (e) => `${e.id},${e.startDate.toISOString()},${e.endDate.toISOString()},"${e.lecturer}","${e.room}","${e.class}"`,
  );
  return {
    content: [header, ...rows].join("\n"),
    filename: `zajecia-${today()}.csv`,
    mimeType: "text/csv",
  };
};

// Generowanie pliku TXT do pobrania
const toTxt = (events: ExportedEvent[]): ExportResult => {
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
    filename: `zajecia-${today()}.txt`,
    mimeType: "text/plain",
  };
};

export const exportEvents = async (format: ExportFormat): Promise<ExportResult> => {
  const sessions = await getAllSessions();
  const mapped = mapToExportedEvents(sessions);

  // Generujemy plik do pobrania w zależności od wybranego formatu
  switch (format) {
    case "json":
      return toJson(mapped);
    case "csv":
      return toCsv(mapped);
    case "txt":
      return toTxt(mapped);
  }
};
