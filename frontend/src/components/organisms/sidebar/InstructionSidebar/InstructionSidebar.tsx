import type { InstructionSidebarProps } from "./InstructionSidebar.types";

export const InstructionSidebar = ({
  title,
  sections,
}: InstructionSidebarProps) => {
  return (
    <aside className="instruction-sidebar">
      <div className="instruction-sidebar__header">
        <h2 className="instruction-sidebar__title">{title}</h2>
      </div>

      <div className="instruction-sidebar__content">
        {sections.map((section, index) => (
          <div key={index} className="instruction-sidebar__section">
            <h3 className="instruction-sidebar__section-heading">
              {section.heading}
            </h3>
            <p className="instruction-sidebar__section-content">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
};
