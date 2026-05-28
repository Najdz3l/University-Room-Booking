import type { Class } from "@declarative/types/class.types";
import type { Lecturer, FormattedLecturer } from "@declarative/types/lecturer.types";
import type { Room, RoomsByBuilding } from "@declarative/types/room.types";

export type RawFormDataTuple = [Lecturer[], Room[], Class[]];

export type RawFormData = {
  lecturers: Lecturer[];
  rooms: Room[];
  classes: Class[];
};

export type FormattedFormData = {
  lecturers: FormattedLecturer[];
  classes: Class[];
  rooms: RoomsByBuilding;
};
