import type { CalendarEventTitleProps } from "./CalendarEventTitle.types";

export const CalendarEventTitle = ({ title }: CalendarEventTitleProps) => {
  return <i className="calendar-event__title">{title}</i>;
};
