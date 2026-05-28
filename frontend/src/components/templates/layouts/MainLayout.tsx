import type React from "react";
import { CalendarLayout } from "@components/templates/layouts/CalendarLayout/CalendarLayout";
import { CalendarSidebar } from "@components/organisms/calendar/CalendarSidebar/CalendarSidebar";
import { CalendarView } from "@components/organisms/calendar/CalendarView/CalendarView";
import { ReservationSidebar } from "@components/organisms/sidebar/ReservationSidebar/ReservationSidebar";
import { useCalendar } from "@lib/hooks/useCalendar";
import { useCalendarEvents } from "@lib/hooks/useCalendarEvents";
import { MONTH_VIEW_HEADER_TOOLBAR } from "@lib/constants/calendarConfig";

// NOTE: This component is deprecated and not used in the current routing setup
// It's kept for backwards compatibility only
export const MainLayout: React.FC = () => {
  const {
    weekendsVisible,
    sidebarMode,
    selectedDate,
    dailyEvents,
    handleWeekendsToggle,
    handleDateSelect,
    handleEventClick,
    handleEventsSet,
  } = useCalendar();

  const { fetchEvents } = useCalendarEvents("month");

  return (
    <CalendarLayout
      sidebar={
        <CalendarSidebar weekendsVisible={weekendsVisible} onWeekendsToggle={handleWeekendsToggle}>
          {sidebarMode === "reservation" && (
            <ReservationSidebar selectedDate={new Date(selectedDate).toLocaleDateString()} dailyEvents={dailyEvents} />
          )}
        </CalendarSidebar>
      }
      content={
        <CalendarView
          weekendsVisible={weekendsVisible}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          onEventsSet={handleEventsSet}
          headerToolbar={MONTH_VIEW_HEADER_TOOLBAR}
          events={fetchEvents}
        />
      }
    />
  );
};
