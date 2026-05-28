import type { CalendarEventTimeProps } from "./CalendarEventTime.types";

export const CalendarEventTime = ({ timeText }: CalendarEventTimeProps) => {
  return <b className="calendar-event__time">{timeText}</b>;
};
