import type { EventApi } from "@fullcalendar/core";

export type ReservationSidebarProps = {
  selectedDate: string;
  dailyEvents: EventApi[];
  onCancel?: () => void;
  onSuccess?: () => void;
};
