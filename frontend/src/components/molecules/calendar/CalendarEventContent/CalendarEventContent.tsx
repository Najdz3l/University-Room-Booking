import { CalendarEventTitle } from "@components/atoms/calendar/CalendarEventTitle/CalendarEventTitle";
import type { CalendarEventContentProps } from "./CalendarEventContent.types";

export const CalendarEventContent = ({ eventContent }: CalendarEventContentProps) => {
  return (
    <>
      {/* CalendarEventTime ma w sobie godzine AM/PM */}
      {/* <CalendarEventTime timeText={eventContent.timeText} /> */}
      <CalendarEventTitle title={eventContent.event.title} />
    </>
  );
};
