/**
 * ReservationSidebar Component
 * Form for creating a new event/reservation
 * Displays selected date and allows filling in lecturer, class, room and time.
 */

import { useState, useEffect } from "react";
import { useFormData } from "@lib/hooks/useFormData";
import { createEvent } from "@services/api/reservationApi";
import { Button } from "@components/atoms/Button/Button";
import type { ReservationSidebarProps } from "./ReservationSidebar.types";
import type { Room } from "@lib/types/api.types";

export const ReservationSidebar = ({ selectedDate, dailyEvents, onCancel, onSuccess }: ReservationSidebarProps) => {
  const { data: formData } = useFormData();

  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("09:30");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Automatically update end time when start time changes (add 1.5 hours)
  useEffect(() => {
    if (!startTime) return;
    const [hours, minutes] = startTime.split(":").map(Number);
    if (hours !== undefined && minutes !== undefined && !isNaN(hours) && !isNaN(minutes)) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      date.setMinutes(date.getMinutes() + 90); // add 1.5 hours

      const endHours = String(date.getHours()).padStart(2, "0");
      const endMinutes = String(date.getMinutes()).padStart(2, "0");
      setEndTime(`${endHours}:${endMinutes}`);
    }
  }, [startTime]);

  // Flatten the rooms data structure for the dropdown
  const getFlatRoomsList = () => {
    if (!formData?.rooms) return [];

    let flatRooms: { id: string; name: string; building: string; floor: string }[] = [];

    Object.entries(formData.rooms).forEach(([building, floors]) => {
      Object.entries(floors).forEach(([floor, roomsArr]) => {
        if (Array.isArray(roomsArr)) {
          roomsArr.forEach((room: Room) => {
            flatRooms.push({
              id: room.id,
              name: room.name,
              building,
              floor,
            });
          });
        }
      });
    });

    return flatRooms;
  };

  const roomsList = getFlatRoomsList();
  const lecturersList = formData?.lecturers || [];
  const classesList = formData?.classes || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedRoomId) return setError("Proszę wybrać salę");
    if (!selectedLecturerId) return setError("Proszę wybrać wykładowcę");
    if (!selectedClassId) return setError("Proszę wybrać przedmiot");
    if (!startTime) return setError("Proszę podać godzinę rozpoczęcia");
    if (!endTime) return setError("Proszę podać godzinę zakończenia");

    // Since selectedDate is already YYYY-MM-DD from Calendar, we don't need complex parsing
    const isoDate = `${selectedDate}T`;

    // Construct full ISO strings with +00:00 offset and +2 hours
    const startTimeIso = `${isoDate}${startTime}:00+00:00`;
    const endTimeIso = `${isoDate}${endTime}:00+00:00`;

    try {
      setIsLoading(true);
      await createEvent({
        classId: selectedClassId,
        roomId: selectedRoomId,
        lecturerId: selectedLecturerId,
        startTime: startTimeIso,
        endTime: endTimeIso,
      });

      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Błąd podczas tworzenia rezerwacji";
      setError(message);
      console.error("Error creating reservation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reservation-sidebar">
        <h3>Sukces!</h3>
        <p style={{ color: "green", marginBottom: "2rem" }}>Rezerwacja została pomyślnie dodana.</p>

        {onCancel && (
          <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
            ← Powrót
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="reservation-sidebar">
      <h3>Nowa rezerwacja</h3>
      {error && <div style={{ color: "red", marginBottom: "1rem", fontSize: "0.875rem" }}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
            Wybrana data (RRRR-MM-DD):
          </label>
          <input
            type="text"
            value={selectedDate}
            readOnly
            disabled
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-sidebar-border)",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Godzina od:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-sidebar-border)",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Godzina do:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-sidebar-border)",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Przedmiot:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-sidebar-border)",
              backgroundColor: "var(--color-surface)",
            }}
            disabled={isLoading}
            required
          >
            <option value="">-- Wybierz przedmiot --</option>
            {classesList.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Wykładowca:</label>
          <select
            value={selectedLecturerId}
            onChange={(e) => setSelectedLecturerId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-sidebar-border)",
              backgroundColor: "var(--color-surface)",
            }}
            disabled={isLoading}
            required
          >
            <option value="">-- Wybierz wykładowcę --</option>
            {lecturersList.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}>Sala:</label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-sidebar-border)",
              backgroundColor: "var(--color-surface)",
            }}
            disabled={isLoading}
            required
          >
            <option value="">-- Wybierz salę --</option>
            {roomsList.map((room) => (
              <option key={room.id} value={room.id}>
                {room.building} - {room.floor} - {room.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isLoading} style={{ marginTop: "0.5rem" }}>
          {isLoading ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </form>

      {dailyEvents.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h4 style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>Wydarzenia w tym dniu:</h4>
          <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.875rem" }}>
            {dailyEvents.map((event) => (
              <li key={event.id}>
                {event.title}
                {event.allDay && " (Cały dzień)"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onCancel && (
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} style={{ marginTop: "2rem" }}>
          ← Powrót
        </Button>
      )}
    </div>
  );
};
