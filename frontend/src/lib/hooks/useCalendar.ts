import { useState, useCallback } from "react";
import type { EventApi, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import type { UseCalendarReturn } from "@lib/types/calendar.types";
import { deleteEvent } from "@services/api/reservationApi";

export function useCalendar(): UseCalendarReturn {
  const [weekendsVisible, setWeekendsVisible] = useState<boolean>(true);
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [sidebarMode, setSidebarMode] = useState<"instruction" | "reservation">("instruction");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const dailyEvents = currentEvents.filter((event) => {
    if (!selectedDate) return false;
    const eventDate = new Date(event.startStr).toISOString().split("T")[0];
    const targetDate = new Date(selectedDate).toISOString().split("T")[0];
    return eventDate === targetDate;
  });

  const handleWeekendsToggle = useCallback(() => {
    setWeekendsVisible((prev) => !prev);
  }, []);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    calendarApi.changeView("timeGridDay", selectInfo.startStr);

    setSelectedDate(selectInfo.startStr);
    setSidebarMode("reservation");
  }, []);

  // ToDo: Usuwanie wydarzenia. Trzeba zrobić małą kartę.
  const handleEventClick = useCallback(async (clickInfo: EventClickArg) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      try {
        await deleteEvent(clickInfo.event.id);
        clickInfo.event.remove();
      } catch (error) {
        console.error("Failed to delete event", error);
        alert("Wystąpił błąd podczas usuwania. Spróbuj ponownie.");
      }
    }
  }, []);

  const handleEventsSet = useCallback((events: EventApi[]) => {
    setCurrentEvents(events);
  }, []);

  const handleBackToInstructions = useCallback(() => {
    setSidebarMode("instruction");
  }, []);

  return {
    weekendsVisible,
    currentEvents,
    sidebarMode,
    selectedDate,
    dailyEvents,
    handleWeekendsToggle,
    handleDateSelect,
    handleEventClick,
    handleEventsSet,
    handleBackToInstructions,
  };
}
