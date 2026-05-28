import type { Class } from "./class.types";
import type { Lecturer } from "./lecturer.types";
import type { Room } from "./room.types";

// Model danych zajęć surowo z bazy danych
export type RawCalendarEvent = {
  id: string;
  startTime: Date;
  endTime: Date;
  room: Room;
  lecturer: Lecturer;
  class: Class;
};

// Model danych zajęć sformatowany do wyświetlenia w kalendarzu
export type FormattedCalendarEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  title: string;
};

// Możliwe formaty widoku kalendarza
export type Format = "MONTH" | "DAY";
export type ExportFormat = "json" | "csv" | "txt";

export type ExportedEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  lecturer: string;
  room: string;
  class: string;
};

export type ExportResult = {
  content: string;
  filename: string;
  mimeType: string;
};
