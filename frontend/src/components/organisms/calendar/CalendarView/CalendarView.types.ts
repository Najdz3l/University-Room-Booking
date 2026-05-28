import type { EventApi, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import type FullCalendar from "@fullcalendar/react";

export type CalendarViewProps = {
  weekendsVisible: boolean;
  onDateSelect: (selectInfo: DateSelectArg) => void;
  onEventClick: (clickInfo: EventClickArg) => void;
  onEventsSet: (events: EventApi[]) => void;
  headerToolbar?: { left: string; center: string; right: string };
  initialView?: string;
  viewType?: "month" | "day";
  events?: any; // The function or array to fetch/provide events
  calendarRef?: React.RefObject<FullCalendar | null>;
};
