import type { FormattedLecturer, Lecturer } from "@/api/oop/types/lecturer.types";

export const formatLecturerData = (raw: Lecturer): FormattedLecturer => {
  const fullName: string = raw.firstName + " " + raw.lastName;
  const fullNameWithTitles: string = raw.titles + " " + fullName;
  return {
    id: raw.id,
    name: fullNameWithTitles,
  };
};
