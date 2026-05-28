export const CALENDAR_HEADER_TOOLBAR = {
  left: "prev,next today",
  center: "title",
  right: "dayGridMonth,timeGridWeek,timeGridDay",
} as const;

export const CALENDAR_INITIAL_VIEW = "dayGridMonth" as const;

export const MONTH_VIEW_HEADER_TOOLBAR = {
  left: "prev,next today",
  center: "title",
  right: "",
} as const;

export const MONTH_VIEW_INITIAL_VIEW = "dayGridMonth" as const;
