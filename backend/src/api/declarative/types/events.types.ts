import type { Class } from "@declarative/types/class.types";
import type { Lecturer } from "@declarative/types/lecturer.types";
import type { Room } from "@declarative/types/room.types";

export type RawCalendarEvent = {
  id: string;
  startTime: Date;
  endTime: Date;
  room: Room;
  lecturer: Lecturer;
  class: Class;
};

export type FormattedCalendarEvent = {
  id: string;
  startDate: Date;
  endDate: Date;
  title: string;
};

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
