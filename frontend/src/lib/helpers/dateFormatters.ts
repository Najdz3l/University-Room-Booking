import { formatDate } from "@fullcalendar/core";

export function formatEventDate(date: Date): string {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
