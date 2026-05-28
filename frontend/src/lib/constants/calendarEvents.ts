import type { EventInput } from "@fullcalendar/core";

type EventData = {
  id: string;
  room: string;
  start: Date;
  end: Date;
};

const eventData: EventData[] = [
  {
    id: "1",
    room: "109",
    start: new Date("2026-05-13T11:30:00"),
    end: new Date("2026-05-13T13:00:00"),
  },
  {
    id: "2",
    room: "109",
    start: new Date("2026-05-13T11:30:00"),
    end: new Date("2026-05-13T13:00:00"),
  },
  {
    id: "3",
    room: "109",
    start: new Date("2026-05-13T11:30:00"),
    end: new Date("2026-05-13T13:00:00"),
  },
  {
    id: "4",
    room: "109",
    start: new Date("2026-05-13T11:30:00"),
    end: new Date("2026-05-13T13:00:00"),
  },
  {
    id: "5",
    room: "109",
    start: new Date("2026-05-13T11:30:00"),
    end: new Date("2026-05-13T13:00:00"),
  },
  {
    id: "6",
    room: "109",
    start: new Date("2026-05-13T11:30:00"),
    end: new Date("2026-05-13T13:00:00"),
  },
];

const getHours = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const createEventTitle = (event: EventData): string => {
  const hours = `${getHours(event.start)}-${getHours(event.end)}`;
  return ` ${hours} | ${event.room}`;
};

const createEventInfo = (event: EventData): EventInput => {
  return {
    id: event.id,
    title: createEventTitle(event),
    start: event.start,
    end: event.end,
  };
};

export const INITIAL_EVENTS: EventInput[] = eventData.map(createEventInfo);
