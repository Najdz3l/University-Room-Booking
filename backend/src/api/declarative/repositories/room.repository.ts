import { NotFoundError } from "@/lib/errors/app-errors";
import prisma from "@/prisma-client";
import type { Room } from "@declarative/types/room.types";

export const getAllRooms = (): Promise<Room[]> =>
  prisma.room.findMany().then((rooms: Room[]) => {
    // rooms table nie powinno być puste
    if (rooms.length <= 0) throw new NotFoundError("Rooms repository is empty");
    return rooms;
  });
