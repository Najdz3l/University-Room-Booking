type Floor = "GROUND" | "FIRST" | "SECOND" | "THIRD";

type Building = "MAIN" | "GYM";

// Model - jak wyglądają dane sal z bazy danych
export type Room = {
  id: string;
  name: string;
  floor: Floor;
  building: Building;
};

// Formatted - dane sformatowane dla frontend'u
export type FormattedRoom = {
  id: string;
  name: string;
};

// Formatted - sale pogrupowane po budynkach i piętrach
export type RoomsByBuilding = Record<Building, Partial<Record<Floor, FormattedRoom[]>>>;
