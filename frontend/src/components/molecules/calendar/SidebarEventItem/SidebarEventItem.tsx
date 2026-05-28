import { formatEventDate } from "@lib/helpers/dateFormatters";
import type { SidebarEventItemProps } from "./SidebarEventItem.types";

export const SidebarEventItem = ({ event }: SidebarEventItemProps) => {
  const startDate = event.start;

  return (
    <li className="sidebar-event-item">
      {startDate !== null && (
        <b className="sidebar-event-item__date">{formatEventDate(startDate)}</b>
      )}
      <i className="sidebar-event-item__title">{event.title}</i>
    </li>
  );
};
