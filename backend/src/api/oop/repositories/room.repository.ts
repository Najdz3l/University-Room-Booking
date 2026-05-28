import prisma from "@/prisma-client";
import { NotFoundError } from "@/lib/errors/app-errors";
import type { Room } from "@oop/types/room.types";

export class RoomRepository {
  async getAll(): Promise<Room[]> {
    const rooms: Room[] = await prisma.room.findMany();

    // rooms table nie powinno być puste
    if (rooms.length <= 0) throw new NotFoundError("Rooms repository is empty");

    return rooms;
  }
}
