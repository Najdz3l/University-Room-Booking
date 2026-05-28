import prisma from "@/prisma-client";
import type { RawCalendarEvent } from "@oop/types/events.types";
import type { CreateEventDto } from "../validators/events.validator";
import { NotFoundError } from "@/lib/errors/app-errors";

export class SessionRepository {
  // Pobieranie zajęć z podanego zakresu dat wraz z danymi o wykładowcy, sali i przedmiocie
  async findByDateRange(startDate: string, endDate: string): Promise<RawCalendarEvent[]> {
    const sessions = await prisma.session.findMany({
      // Zajęcia z podanego zakresu dat
      where: {
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      // Dołączamy dane o wykładowcy, sali i przedmiocie
      include: {
        lecturer: true,
        room: true,
        class: true,
      },
      // Sortujemy zajęcia rosnąco po dacie rozpoczęcia
      orderBy: {
        startTime: "asc",
      },
    });

    return sessions;
  }

  // Tworzenie nowej sesji (zajęć) w bazie danych
  async createSession(newSessionData: CreateEventDto): Promise<RawCalendarEvent> {
    const session = await prisma.session.create({
      data: {
        startTime: new Date(newSessionData.startTime),
        endTime: new Date(newSessionData.endTime),
        roomId: newSessionData.roomId,
        lecturerId: newSessionData.lecturerId,
        classId: newSessionData.classId,
      },
      include: {
        lecturer: true,
        room: true,
        class: true,
      },
    });
    return session;
  }

  // Pobieranie sesji (zajęć) z bazy danych po ID
  async findById(id: string): Promise<void> {
    const session = await prisma.session.findUnique({
      where: {
        id,
      },
    });

    // Jeśli nie znaleziono zajęć o podanym ID, rzucamy błąd NotFoundError
    if (!session) {
      throw new NotFoundError("Nie znaleziono zajęć o podanym ID");
    }
  }

  // Usuwanie sesji (zajęć) z bazy danych po ID
  async deleteSession(id: string): Promise<void> {
    await prisma.session.delete({
      where: {
        id,
      },
    });
  }

  async getAllSessions(): Promise<RawCalendarEvent[]> {
    const sessions = await prisma.session.findMany({
      include: {
        lecturer: true,
        room: true,
        class: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return sessions;
  }
}
