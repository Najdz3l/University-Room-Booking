import type { ReactNode } from "react";

export type CalendarSidebarProps = {
  weekendsVisible: boolean;
  onWeekendsToggle: () => void;
  children?: ReactNode;
};
