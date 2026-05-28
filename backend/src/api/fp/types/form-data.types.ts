import type { Class } from "@fp/types/class.types";
import type { Lecturer, FormattedLecturer } from "@fp/types/lecturer.types";
import type { Room, RoomsByBuilding } from "@fp/types/room.types";

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
