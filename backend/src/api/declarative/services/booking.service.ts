import { getAllClasses } from "@declarative/repositories/class.repository";
import { getAllLecturers } from "@declarative/repositories/lecturer.repository";
import { getAllRooms } from "@declarative/repositories/room.repository";
import { findSessionsByDateRange, createNewSession } from "@declarative/repositories/session.repository";
import type { FormattedCalendarEvent, RawCalendarEvent } from "@declarative/types/events.types";
import { ConflictError, ValidationError } from "@/lib/errors/app-errors";
import type { CreateEventDto } from "@declarative/validators/events.validator";

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
  const missingEntities = (
    await Promise.all([
      getAllClasses().then((classes) =>
        classes.some((c) => c.id === classId) ? null : "Klasa o podanym ID nie została znaleziona",
      ),
      getAllLecturers().then((lecturers) =>
        lecturers.some((l) => l.id === lecturerId) ? null : "Wykładowca o podanym ID nie został znaleziony",
      ),
      getAllRooms().then((rooms) =>
        rooms.some((r) => r.id === roomId) ? null : "Sala o podanym ID nie została znaleziona",
      ),
    ])
  ).filter(Boolean) as string[];

  return missingEntities.length > 0
    ? (() => {
        // Sprawdzenie wyników i logowanie informacji o brakujących zasobach bez ujawniania ID
        missingEntities.forEach((err) => console.error(`BookingService - createEvent - validation error: ${err}`));
        throw new ValidationError(missingEntities.join(", "));
      })()
    : undefined;
};

// Helper do sprawdzania nakładania się dwóch przedziałów czasowych
const hasTimeOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  return start1 < end2 && start2 < end1;
};

// Helper do sprawdzania konfliktów terminów dla sali, wykładowcy i klasy
const checkForSchedulingConflicts = async (newSessionData: CreateEventDto): Promise<void> => {
  // Zakres czasowy do sprawdzenia konfliktów - cały dzień, w którym odbywają się zajęcia
  const startDay = new Date(newSessionData.startTime);
  startDay.setHours(0, 0, 0, 0); // Ustawiamy czas na początek dnia
  const endDay = new Date(newSessionData.endTime);
  endDay.setHours(23, 59, 59, 999); // Ustawiamy czas na koniec dnia

  // Pobieramy wszystkie zajęcia z podanego dnia (nie zakresu czasowego)
  const sessionsOnSameDay = await findSessionsByDateRange(startDay.toISOString(), endDay.toISOString());

  // Dane zakresu czasowego nowej sesji, które chcemy utworzyć
  const newStart = new Date(newSessionData.startTime);
  const newEnd = new Date(newSessionData.endTime);

  return sessionsOnSameDay.length === 0
    ? console.log("BookingService - createEvent - Brak zajęć w tym dniu, brak konfliktów do sprawdzenia")
    : // Sprawdzamy konflikty dla sali - każda sesja tej sali która nakłada się czasowo
      sessionsOnSameDay.some(
          (session) =>
            session.room.id === newSessionData.roomId &&
            hasTimeOverlap(new Date(session.startTime), new Date(session.endTime), newStart, newEnd),
        )
      ? (() => {
          // Jeśli wykryto konflikt, logujemy szczegóły i rzucamy błąd walidacji
          console.error("BookingService - createEvent - Konflikt terminu dla sali", { roomId: newSessionData.roomId });
          throw new ConflictError("Sala jest już zajęta w podanym terminie");
        })()
      : // Sprawdzamy konflikty dla wykładowcy - każda sesja wykładowcy która nakłada się czasowo
        sessionsOnSameDay.some(
            (session) =>
              session.lecturer.id === newSessionData.lecturerId &&
              hasTimeOverlap(new Date(session.startTime), new Date(session.endTime), newStart, newEnd),
          )
        ? (() => {
            // Jeśli wykryto konflikt, logujemy szczegóły i rzucamy błąd walidacji
            console.error("BookingService - createEvent - Konflikt terminu dla wykładowcy", {
              lecturerId: newSessionData.lecturerId,
            });
            throw new ConflictError("Wykładowca jest już zajęty w podanym terminie");
          })()
        : undefined;
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
