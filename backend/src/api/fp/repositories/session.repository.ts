import prisma from "@/prisma-client";
import type { RawCalendarEvent } from "@fp/types/events.types";
import type { CreateEventDto } from "@fp/validators/events.validator";
import { NotFoundError } from "@/lib/errors/app-errors";

export const findSessionsByDateRange = async (startDate: string, endDate: string): Promise<RawCalendarEvent[]> => {
  const sessions = await prisma.session.findMany({
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
  });

  return sessions as RawCalendarEvent[]; // cast to match type if Prisma schema omits some nested specifics that TS flags, but it should be fine
};

// Tworzenie nowej sesji (zajęć) w bazie danych
export const createNewSession = async (newSessionData: CreateEventDto): Promise<RawCalendarEvent> => {
  const session = await prisma.session.create({
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
  });
  return session as unknown as RawCalendarEvent;
};

// Pobieranie sesji (zajęć) z bazy danych po ID
export const findSessionById = async (id: string): Promise<void> => {
  const session = await prisma.session.findUnique({
    where: {
      id,
    },
  });

  // Jeśli nie znaleziono zajęć o podanym ID, rzucamy błąd NotFoundError
  if (!session) {
    throw new NotFoundError("Nie znaleziono zajęć o podanym ID");
  }
};

// Usuwanie sesji (zajęć) z bazy danych po ID
export const deleteSessionById = async (id: string): Promise<void> => {
  await prisma.session.delete({
    where: {
      id,
    },
  });
};

export const getAllSessions = async (): Promise<RawCalendarEvent[]> => {
  const sessions = await prisma.session.findMany({
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

  return sessions as RawCalendarEvent[];
};
