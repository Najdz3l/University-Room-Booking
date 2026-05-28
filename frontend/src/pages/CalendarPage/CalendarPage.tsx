import { CalendarLayout } from "@components/templates/layouts/CalendarLayout/CalendarLayout";
import { CalendarSidebar } from "@components/organisms/calendar/CalendarSidebar/CalendarSidebar";
import { CalendarView } from "@components/organisms/calendar/CalendarView/CalendarView";
import { InstructionSidebar } from "@components/organisms/sidebar/InstructionSidebar/InstructionSidebar";
import { ReservationSidebar } from "@components/organisms/sidebar/ReservationSidebar/ReservationSidebar";
import { SessionFormSidebar } from "@components/organisms/sidebar/SessionFormSidebar/SessionFormSidebar";
import { useCalendar } from "@lib/hooks/useCalendar";
import { useCalendarEvents } from "@lib/hooks/useCalendarEvents";
import { useReservationData } from "@lib/hooks/useReservationData";
import { SIDEBAR_INSTRUCTIONS } from "@lib/constants/sidebarInstructions";
import type FullCalendar from "@fullcalendar/react";
import React, { useRef, useCallback } from "react";

interface CalendarPageProps {
  mode?: "month" | "day";
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ mode = "month" }) => {
  const {
    weekendsVisible,
    sidebarMode,
    selectedDate,
    dailyEvents,
    handleWeekendsToggle,
    handleDateSelect,
    handleEventClick,
    handleEventsSet,
    handleBackToInstructions,
  } = useCalendar();

  const { reservation } = useReservationData();
  const { fetchEvents } = useCalendarEvents(mode);
  const calendarRef = useRef<FullCalendar>(null);

  const handleRefreshCalendar = useCallback(() => {
    calendarRef.current?.getApi().refetchEvents();
  }, []);

  // For day view, we need reservation data
  if (mode === "day" && !reservation) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "red" }}>Błąd: Brak danych rezerwacji. Wróć do kalendarza.</p>
      </div>
    );
  }

  const renderSidebar = () => {
    // Day view shows session form
    if (mode === "day" && reservation) {
      return (
        <CalendarSidebar weekendsVisible={weekendsVisible} onWeekendsToggle={handleWeekendsToggle}>
          <SessionFormSidebar date={reservation.date} room={reservation.room} />
        </CalendarSidebar>
      );
    }

    // Month view shows instruction or reservation form
    return (
      <CalendarSidebar weekendsVisible={weekendsVisible} onWeekendsToggle={handleWeekendsToggle}>
        {sidebarMode === "instruction" ? (
          <InstructionSidebar
            title={SIDEBAR_INSTRUCTIONS.default.title}
            sections={SIDEBAR_INSTRUCTIONS.default.sections}
          />
        ) : (
          <ReservationSidebar
            selectedDate={selectedDate}
            dailyEvents={dailyEvents}
            onCancel={handleBackToInstructions}
            onSuccess={handleRefreshCalendar}
          />
        )}
      </CalendarSidebar>
    );
  };

  return (
    <CalendarLayout
      sidebar={renderSidebar()}
      content={
        <CalendarView
          calendarRef={calendarRef}
          weekendsVisible={weekendsVisible}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          onEventsSet={handleEventsSet}
          viewType={mode}
          events={fetchEvents}
        />
      }
    />
  );
};
