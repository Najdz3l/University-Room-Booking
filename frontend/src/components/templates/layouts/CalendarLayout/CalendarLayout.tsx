import type { CalendarLayoutProps } from "./CalendarLayout.types";

export const CalendarLayout = ({ sidebar, content }: CalendarLayoutProps) => {
  return (
    <div className="calendar-layout">
      {sidebar}
      <main className="calendar-layout__main">{content}</main>
    </div>
  );
};
