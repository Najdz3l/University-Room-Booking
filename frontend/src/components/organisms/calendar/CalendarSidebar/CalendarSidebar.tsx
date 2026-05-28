import { WeekendToggle } from "@components/atoms/calendar/WeekendToggle/WeekendToggle";
import type { CalendarSidebarProps } from "./CalendarSidebar.types";
import { useState } from "react";
import { APIEndpoints } from "@services/api/endpoints";

export const CalendarSidebar = ({ weekendsVisible, onWeekendsToggle, children }: CalendarSidebarProps) => {
  const [exportFormat, setExportFormat] = useState<string>("json");

  const handleExport = () => {
    const url = `${APIEndpoints.CALENDAR_EVENTS}/export?format=${exportFormat}`;
    window.location.href = url;
  };

  return (
    <aside className="calendar-sidebar">
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1 }}>{children ? <div className="sidebar__custom-content">{children}</div> : null}</div>
        <div
          className="sidebar__section"
          style={{
            marginTop: "auto",
            borderTop: "1px solid var(--color-sidebar-border)",
            paddingTop: "var(--spacing-md)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="calendar-sidebar__export-select"
              style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="txt">TXT</option>
            </select>
            <button
              onClick={handleExport}
              className="calendar-sidebar__export-button"
              style={{
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                borderRadius: "4px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-secondary)",
              }}
            >
              Eksportuj
            </button>
          </div>
          <WeekendToggle checked={weekendsVisible} onChange={onWeekendsToggle} />
        </div>
      </div>
    </aside>
  );
};
