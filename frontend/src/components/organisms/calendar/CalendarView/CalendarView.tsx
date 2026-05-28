import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventContentArg } from "@fullcalendar/core";
import { CalendarEventContent } from "@components/molecules/calendar/CalendarEventContent/CalendarEventContent";
import { CALENDAR_HEADER_TOOLBAR } from "@lib/constants/calendarConfig";
import type { CalendarViewProps } from "./CalendarView.types";

const renderEventContent = (eventContent: EventContentArg) => <CalendarEventContent eventContent={eventContent} />;

export const CalendarView = ({
  weekendsVisible,
  onDateSelect,
  onEventClick,
  onEventsSet,
  headerToolbar = CALENDAR_HEADER_TOOLBAR,
  viewType = "month",
  events,
  calendarRef,
}: CalendarViewProps) => {
  // Determine which view to use based on viewType
  const view = viewType === "day" ? "timeGridDay" : "dayGridMonth";

  return (
    <div className="calendar-view">
      <FullCalendar
        ref={calendarRef}
        // Wtyczki potrzebne do rysowania widoków i obsługi interakcji (np. klikania, zaznaczania)
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        // Konfiguracja paska na górze (przyciski nawigacyjne, tytuł, zmiana widoków)
        headerToolbar={headerToolbar}
        // Domyślny widok przy pierwszym załadowaniu (np. miesiąc lub tydzień)
        initialView={view}
        // Pozwala na zaznaczanie obszaru myszką (wymagane dla opcji 'select' / funkcja drag dla nowych zdarzeń)
        selectable={true}
        // Tworzy "tymczasowe" wirtualne zdarzenie podczas przeciągania myszką (fajny efekt wizualny)
        selectMirror={true}
        // Pojawia się link "+X więcej" rzamiast psuć wyoskość pola, gdy jest za dużo eventów jednego dnia
        dayMaxEvents={true}
        // Steruje tym, czy pokazujemy kolumny z sobotą i niedzielą
        weekends={weekendsVisible}
        // Funkcja (lub tablica) z wydarzeniami przekazywana z wyższego komponentu
        events={events}
        // Co ma się wydarzyć, gdy użytkownik zaznaczy dni/godziny potrącając myszką (DRAG dla NOWYCH rezerwacji)
        select={onDateSelect}
        // Renderuje dostosowany widok wewnątrz "klocka" przypominającego samo wydarzenie
        eventContent={renderEventContent}
        // Co ma się wydarzyć po kliknięciu lewym przyciskiem myszy na gotowe wydarzenie (KLIKANIE)
        eventClick={onEventClick}
        // Funkcja uruchamiająca się pod spodem gdy wewnętrzna lista eventów w pamięci kalendarza się zmienia (do sidebaru)
        eventsSet={onEventsSet}
        // Ukryj natywny czas FullCalendar (inaczej bedzie sie dupikowac z naszym renderowanym tekstem)
        displayEventTime={false}
        // Ustawia poniedziałek jako pierwszy dzień tygodnia (domyślnie niedziela)
        firstDay={1}
      />
    </div>
  );
};
