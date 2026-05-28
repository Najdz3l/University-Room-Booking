import type { Class } from "./class.types";
import type { Lecturer, FormattedLecturer } from "./lecturer.types";
import type { Room, RoomsByBuilding } from "./room.types";

// Raw - tuple do odebrania trzech tablic z Promise.all
export type RawFormDataTuple = [Lecturer[], Room[], Class[]];

// Raw - dane z bazy przed formatowaniem
export type RawFormData = {
  lecturers: Lecturer[];
  rooms: Room[];
  classes: Class[];
};

// Formatted - dane sformatowane dla frontend'u (sale pogrupowane po budynkach i piętrach)
export type FormattedFormData = {
  lecturers: FormattedLecturer[];
  classes: Class[];
  rooms: RoomsByBuilding;
};
