import { getAllClasses } from "@fp/repositories/class.repository";
import { getAllLecturers } from "@fp/repositories/lecturer.repository";
import { getAllRooms } from "@fp/repositories/room.repository";
import { findSessionsByDateRange, createNewSession } from "@fp/repositories/session.repository";
import type { FormattedCalendarEvent, RawCalendarEvent } from "@fp/types/events.types";
import { ConflictError, ValidationError } from "@/lib/errors/app-errors";
import type { CreateEventDto } from "@fp/validators/events.validator";

// Helper do walidacji istnienia klasy, wykładowcy i sali na podstawie podanych ID
const validateEntityExists = async ({
  classId,
  lecturerId,
  roomId,
}: {
  classId: string;
  lecturerId: string;
  roomId: string;
}): Promise<void> => {
  // Sprawdzamy równocześnie istnienie klasy, wykładowcy i sali, aby zminimalizować czas oczekiwania
  const [classExists, lecturerExists, roomExists] = await Promise.all([
    getAllClasses().then((classes) => classes.some((c) => c.id === classId)),
    getAllLecturers().then((lecturers) => lecturers.some((l) => l.id === lecturerId)),
    getAllRooms().then((rooms) => rooms.some((r) => r.id === roomId)),
  ]);

  // Sprawdzenie wyników i logowanie informacji o brakujących zasobach bez ujawniania ID
  if (!classExists || !lecturerExists || !roomExists) {
    const missingEntities: string[] = [];

    if (!classExists) {
      console.error(
        `BookingService - createEvent - validation error: Klasa o podanym ID ${classId} nie została znaleziona`,
      );
      missingEntities.push("Klasa o podanym ID nie została znaleziona");
    }
    if (!lecturerExists) {
      console.error(
        `BookingService - createEvent - validation error: Wykładowca o podanym ID ${lecturerId} nie został znaleziony`,
      );
      missingEntities.push("Wykładowca o podanym ID nie został znaleziony");
    }
    if (!roomExists) {
      console.error(
        `BookingService - createEvent - validation error: Sala o podanym ID ${roomId} nie została znaleziona`,
      );
      missingEntities.push("Sala o podanym ID nie została znaleziona");
    }

    throw new ValidationError(missingEntities.join(", "));
  }
};

const hasTimeOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  return start1 < end2 && start2 < end1;
};

const checkForSchedulingConflicts = async (newSessionData: CreateEventDto): Promise<void> => {
  const startDay = new Date(newSessionData.startTime);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(newSessionData.endTime);
  endDay.setHours(23, 59, 59, 999);

  const sessionsOnSameDay = await findSessionsByDateRange(startDay.toISOString(), endDay.toISOString());
  if (sessionsOnSameDay.length === 0) {
    console.log("BookingService - createEvent - Brak zajęć w tym dniu, brak konfliktów do sprawdzenia");
    return;
  }

  const newStart = new Date(newSessionData.startTime);
  const newEnd = new Date(newSessionData.endTime);

  const hasRoomConflict = sessionsOnSameDay.some(
    (session) =>
      session.room.id === newSessionData.roomId &&
      hasTimeOverlap(new Date(session.startTime), new Date(session.endTime), newStart, newEnd),
  );
  if (hasRoomConflict) {
    console.error("BookingService - createEvent - Konflikt terminu dla sali", { roomId: newSessionData.roomId });
    throw new ConflictError("Sala jest już zajęta w podanym terminie");
  }

  const hasLecturerConflict = sessionsOnSameDay.some(
    (session) =>
      session.lecturer.id === newSessionData.lecturerId &&
      hasTimeOverlap(new Date(session.startTime), new Date(session.endTime), newStart, newEnd),
  );
  if (hasLecturerConflict) {
    console.error("BookingService - createEvent - Konflikt terminu dla wykładowcy", {
      lecturerId: newSessionData.lecturerId,
    });
    throw new ConflictError("Wykładowca jest już zajęty w podanym terminie");
  }
};

const formatEventData = (rawEventData: RawCalendarEvent): FormattedCalendarEvent => {
  const lecturerFullData = `${rawEventData.lecturer.titles ? rawEventData.lecturer.titles + " " : ""}${rawEventData.lecturer.firstName} ${rawEventData.lecturer.lastName}`;

  return {
    id: rawEventData.id,
    startDate: rawEventData.startTime,
    endDate: rawEventData.endTime,
    title: `${rawEventData.class.name} - ${lecturerFullData} - ${rawEventData.room.name}`,
  };
};

export const createEvent = async (newSessionData: CreateEventDto): Promise<FormattedCalendarEvent> => {
  // Sprawdzamy, czy podane ID istnieją
  await validateEntityExists({
    classId: newSessionData.classId,
    lecturerId: newSessionData.lecturerId,
    roomId: newSessionData.roomId,
  });

  // Sprawdzenie konfliktów terminów dla sali, wykładowcy i klasy
  await checkForSchedulingConflicts(newSessionData);

  // Jeśli wszystkie walidacje przeszły pomyślnie, tworzymy nowe zajęcia
  const createdSession = await createNewSession(newSessionData);
  // Formatowanie danych nowo utworzonego zajęcia
  return formatEventData(createdSession);
};
