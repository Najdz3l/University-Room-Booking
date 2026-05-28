import { WeekendToggle } from "@components/atoms/calendar/WeekendToggle/WeekendToggle";
import type { SidebarControlsProps } from "./SidebarControls.types";
import { SIDEBAR_INSTRUCTIONS } from "@lib/constants/sidebarInstructions";

export const SidebarControls = ({ weekendsVisible, onWeekendsToggle }: SidebarControlsProps) => {
  const sections = SIDEBAR_INSTRUCTIONS.default.sections || [];
  const title = SIDEBAR_INSTRUCTIONS.default.title;

  return (
    <>
      <div className="sidebar__section">
        <h2 className="sidebar__heading">{title}</h2>
        <ul className="sidebar__instructions">
          {sections.length > 0 ? (
            sections.map((section, index: number) => <li key={index}>{section.content}</li>)
          ) : (
            <li>Brak instrukcji</li>
          )}
        </ul>
      </div>

      <div className="sidebar__section">
        <WeekendToggle checked={weekendsVisible} onChange={onWeekendsToggle} />
      </div>
    </>
  );
};
