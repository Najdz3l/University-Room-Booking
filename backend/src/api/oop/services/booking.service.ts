import { ClassRepository } from "@oop/repositories/class.repository";
import { LecturerRepository } from "@oop/repositories/lecturer.repository";
import { RoomRepository } from "@oop/repositories/room.repository";
import { SessionRepository } from "@oop/repositories/session.repository";
import type { FormattedCalendarEvent, RawCalendarEvent } from "@oop/types/events.types";
import { ConflictError, ValidationError } from "@lib/errors/app-errors";
import type { CreateEventDto } from "@oop/validators/events.validator";

export class BookingService {
  constructor(
    private readonly classRepo: ClassRepository = new ClassRepository(),
    private readonly lecturerRepo: LecturerRepository = new LecturerRepository(),
    private readonly roomRepo: RoomRepository = new RoomRepository(),
    private readonly sessionRepo: SessionRepository = new SessionRepository(),
  ) {}

  async createEvent(newSessionData: CreateEventDto): Promise<FormattedCalendarEvent> {
    // Sprawdzamy, czy podane ID istnieją
    await this.#validateEntityExists({
      classId: newSessionData.classId,
      lecturerId: newSessionData.lecturerId,
      roomId: newSessionData.roomId,
    });

    // Sprawdzenie konfliktów terminów dla sali, wykładowcy i klasy
    await this.#checkForSchedulingConflicts(newSessionData);

    // Jeśli wszystkie walidacje przeszły pomyślnie, tworzymy nowe zajęcia
    const createdSession = await this.sessionRepo.createSession(newSessionData);

    // Formatowanie danych nowo utworzonego zajęcia
    const formattedEvent: FormattedCalendarEvent = this.#formatEventData(createdSession);

    return formattedEvent;
  }

  // Helper do walidacji istnienia klasy, wykładowcy i sali na podstawie podanych ID
  async #validateEntityExists({
    classId,
    lecturerId,
    roomId,
  }: {
    classId: string;
    lecturerId: string;
    roomId: string;
  }): Promise<void> {
    type ValidationResult = [boolean, boolean, boolean];

    // Sprawdzamy równocześnie istnienie klasy, wykładowcy i sali, aby zminimalizować czas oczekiwania
    const [classExists, lecturerExists, roomExists]: ValidationResult = await Promise.all([
      this.classRepo.getAll().then((classes) => classes.some((c) => c.id === classId)),
      this.lecturerRepo.getAll().then((lecturers) => lecturers.some((l) => l.id === lecturerId)),
      this.roomRepo.getAll().then((rooms) => rooms.some((r) => r.id === roomId)),
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

      // Rzucamy błąd walidacji z informacją o brakujących zasobach, ale bez ujawniania konkretnych ID
      throw new ValidationError(missingEntities.join(", "));
    }
  }

  // Helper do sprawdzania konfliktów terminów dla sali, wykładowcy i klasy
  async #checkForSchedulingConflicts(newSessionData: CreateEventDto): Promise<void> {
    // Zakres czasowy do sprawdzenia konfliktów - cały dzień, w którym odbywają się zajęcia
    const startDay = new Date(newSessionData.startTime);
    startDay.setHours(0, 0, 0, 0); // Ustawiamy czas na początek dnia
    const endDay = new Date(newSessionData.endTime);
    endDay.setHours(23, 59, 59, 999); // Ustawiamy czas na koniec dnia

    // Pobieramy wszystkie zajęcia z podanego dnia (nie zakresu czasowego)
    const sessionsOnSameDay = await this.sessionRepo.findByDateRange(startDay.toISOString(), endDay.toISOString());
    if (sessionsOnSameDay.length === 0) {
      console.log("BookingService - createEvent - Brak zajęć w tym dniu, brak konfliktów do sprawdzenia");
      return; // Brak zajęć w tym dniu, więc nie ma konfliktów
    }

    // Dane zakresu czasowego nowej sesji, które chcemy utworzyć
    const newStart = new Date(newSessionData.startTime);
    const newEnd = new Date(newSessionData.endTime);

    // Sprawdzamy konflikty dla sali - każda sesja tej sali która nakłada się czasowo
    const hasRoomConflict = sessionsOnSameDay.some(
      (session) =>
        session.room.id === newSessionData.roomId &&
        this.#hasTimeOverlap(new Date(session.startTime), new Date(session.endTime), newStart, newEnd),
    );
    // Jeśli wykryto konflikt, logujemy szczegóły i rzucamy błąd walidacji
    if (hasRoomConflict) {
      console.error("BookingService - createEvent - Konflikt terminu dla sali", {
        roomId: newSessionData.roomId,
      });
      throw new ConflictError("Sala jest już zajęta w podanym terminie");
    }

    // Sprawdzamy konflikty dla wykładowcy - każda sesja wykładowcy która nakłada się czasowo
    const hasLecturerConflict = sessionsOnSameDay.some(
      (session) =>
        session.lecturer.id === newSessionData.lecturerId &&
        this.#hasTimeOverlap(new Date(session.startTime), new Date(session.endTime), newStart, newEnd),
    );
    // Jeśli wykryto konflikt, logujemy szczegóły i rzucamy błąd walidacji
    if (hasLecturerConflict) {
      console.error("BookingService - createEvent - Konflikt terminu dla wykładowcy", {
        lecturerId: newSessionData.lecturerId,
      });
      throw new ConflictError("Wykładowca jest już zajęty w podanym terminie");
    }
  }

  // Helper do sprawdzania nakładania się dwóch przedziałów czasowych
  #hasTimeOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && start2 < end1;
  }

  #formatEventData(rawEventData: RawCalendarEvent): FormattedCalendarEvent {
    const lecturerFullData = `${rawEventData.lecturer.titles ? rawEventData.lecturer.titles + " " : ""}${rawEventData.lecturer.firstName} ${rawEventData.lecturer.lastName}`;

    const formattedEvent: FormattedCalendarEvent = {
      id: rawEventData.id,
      startDate: rawEventData.startTime,
      endDate: rawEventData.endTime,
      title: `${rawEventData.class.name} - ${lecturerFullData} - ${rawEventData.room.name}`,
    };
    return formattedEvent;
  }
}
