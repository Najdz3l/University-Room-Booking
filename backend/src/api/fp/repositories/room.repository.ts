import { NotFoundError } from "@/lib/errors/app-errors";
import prisma from "@/prisma-client";
import type { Room } from "@fp/types/room.types";

export const getAllRooms = async (): Promise<Room[]> => {
  const rooms: Room[] = await prisma.room.findMany();

  // rooms table nie powinno być puste
  if (rooms.length <= 0) throw new NotFoundError("Rooms repository is empty");

  return rooms;
};
