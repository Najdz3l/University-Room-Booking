src/
├── components/
│   ├── atoms/calendar/
│   │   ├── CalendarEventTime/     ← <b> z czasem eventu
│   │   ├── CalendarEventTitle/    ← <i> z tytułem eventu
│   │   └── WeekendToggle/         ← checkbox toggle
│   ├── molecules/calendar/
│   │   ├── CalendarEventContent/  ← time + title razem
│   │   ├── SidebarEventItem/      ← jeden event w liście
│   │   └── SidebarControls/       ← instrukcje + toggle
│   ├── organisms/calendar/
│   │   ├── CalendarView/          ← główny <FullCalendar>
│   │   └── CalendarSidebar/       ← kompletny sidebar
│   └── templates/layouts/
│       └── CalendarLayout/        ← slot-based: {sidebar, content}
├── pages/
│   ├── App.tsx
│   └── CalendarPage/              ← finalna strona
└── lib/
    ├── hooks/useCalendar.ts        ← cały stan + handlery
    ├── types/calendar.types.ts     ← typy FullCalendar
    ├── constants/calendarEvents.ts ← INITIAL_EVENTS, createEventId
    ├── constants/calendarConfig.ts ← headerToolbar, initialView
    └── helpers/dateFormatters.ts   ← formatEventDate