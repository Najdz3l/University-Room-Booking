import type { EventApi, EventContentArg, DateSelectArg, EventClickArg } from "@fullcalendar/core";

export type { EventApi, EventContentArg, DateSelectArg, EventClickArg };

export type CalendarState = {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
};

export type UseCalendarReturn = {
  weekendsVisible: boolean;
  currentEvents: EventApi[];
  sidebarMode: "instruction" | "reservation";
  selectedDate: string;
  dailyEvents: EventApi[];
  handleWeekendsToggle: () => void;
  handleDateSelect: (selectInfo: DateSelectArg) => void;
  handleEventClick: (clickInfo: EventClickArg) => void;
  handleEventsSet: (events: EventApi[]) => void;
  handleBackToInstructions: () => void;
};
