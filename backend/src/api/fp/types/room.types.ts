type Floor = "GROUND" | "FIRST" | "SECOND" | "THIRD";

type Building = "MAIN" | "GYM";

export type Room = {
  id: string;
  name: string;
  floor: Floor;
  building: Building;
};

export type FormattedRoom = {
  id: string;
  name: string;
};

export type RoomsByBuilding = Record<Building, Partial<Record<Floor, FormattedRoom[]>>>;
