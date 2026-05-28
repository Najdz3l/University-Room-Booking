import { useCallback } from "react";
import { fetchCalendarEvents } from "@services/api/calendarApi";

export const useCalendarEvents = (viewType: "month" | "day") => {
  const fetchEvents = useCallback(
    (fetchInfo: any, successCallback: any, failureCallback: any) => {
      fetchCalendarEvents(fetchInfo.startStr, fetchInfo.endStr, viewType)
        .then((data) =>
          successCallback(
            data.events.map((e: any) => ({
              id: e.id,
              title: e.title,
              start: e.startDate,
              end: e.endDate,
            })),
          ),
        )
        .catch(failureCallback);
    },
    [viewType],
  );

  return { fetchEvents };
};
