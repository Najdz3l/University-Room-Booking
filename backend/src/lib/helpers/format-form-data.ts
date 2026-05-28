import type { FormattedFormData, RawFormData } from "@oop/types/form-data.types";
import type { Lecturer, FormattedLecturer } from "@/api/oop/types/lecturer.types";
import type { RoomsByBuilding } from "@/api/oop/types/room.types";
import { formatLecturerData } from "./format-lecturer-data";

export const formatFormData = (raw: RawFormData): FormattedFormData => {
  // Formatowanie danych wykładowców - łączenie imienia, nazwiska i tytułów w jedno pole "name"
  const formattedLecturers: FormattedLecturer[] = raw.lecturers.map((l: Lecturer) => formatLecturerData(l));

  // Grupowanie sal po budynkach i piętrach
  // Struktura: { MAIN: { GROUND: [], FIRST: [] }, GYM: { GROUND: [] } }
  const roomsByBuilding: RoomsByBuilding = raw.rooms.reduce((acc, room) => {
    const building = room.building;
    const floor = room.floor;

    // Inicjalizuj budynek jeśli jeszcze nie istnieje
    if (!acc[building]) {
      acc[building] = {};
    }

    // Inicjalizuj piętro jeśli jeszcze nie istnieje
    if (!acc[building][floor]) {
      acc[building][floor] = [];
    }

    // Dodaj salę do odpowiedniego budynku i piętra
    acc[building][floor].push({
      id: room.id,
      name: room.name,
    });

    return acc;
  }, {} as RoomsByBuilding);

  return {
    lecturers: formattedLecturers,
    classes: raw.classes,
    rooms: roomsByBuilding,
  };
};
