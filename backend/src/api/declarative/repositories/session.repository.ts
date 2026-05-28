import prisma from "@/prisma-client";
import type { RawCalendarEvent } from "@declarative/types/events.types";
import type { CreateEventDto } from "@declarative/validators/events.validator";
import { NotFoundError } from "@/lib/errors/app-errors";

export const findSessionsByDateRange = (startDate: string, endDate: string): Promise<RawCalendarEvent[]> =>
  prisma.session.findMany({
    where: {
      // Zajęcia z podanego zakresu dat
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
  }) as unknown as Promise<RawCalendarEvent[]>;

// Tworzenie nowej sesji (zajęć) w bazie danych
export const createNewSession = (newSessionData: CreateEventDto): Promise<RawCalendarEvent> =>
  prisma.session.create({
    data: {
      startTime: new Date(newSessionData.startTime),
      endTime: new Date(newSessionData.endTime),
      roomId: newSessionData.roomId,
      lecturerId: newSessionData.lecturerId,
      classId: newSessionData.classId,
    },
    // Dołączamy dane o wykładowcy, sali i przedmiocie
    include: {
      lecturer: true,
      room: true,
      class: true,
    },
  }) as unknown as Promise<RawCalendarEvent>;

// Pobieranie sesji (zajęć) z bazy danych po ID
export const findSessionById = (id: string): Promise<void> =>
  prisma.session
    .findUnique({
      where: {
        id,
      },
    })
    .then((session: unknown) => {
      // Jeśli nie znaleziono zajęć o podanym ID, rzucamy błąd NotFoundError
      if (!session) {
        throw new NotFoundError("Nie znaleziono zajęć o podanym ID");
      }
    });

// Usuwanie sesji (zajęć) z bazy danych po ID
export const deleteSessionById = (id: string): Promise<void> =>
  prisma.session
    .delete({
      where: {
        id,
      },
    })
    .then(() => {});

export const getAllSessions = (): Promise<RawCalendarEvent[]> =>
  prisma.session.findMany({
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
  }) as unknown as Promise<RawCalendarEvent[]>;
