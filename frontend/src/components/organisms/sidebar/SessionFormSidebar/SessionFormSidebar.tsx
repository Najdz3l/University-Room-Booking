/**
 * SessionFormSidebar Component
 * Form for creating a session (zajęcia) with start/end time, lecturer, and subject
 * Date and room are readonly from ReservationDataContext
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservationData } from "@lib/hooks/useReservationData";
import { createSession } from "@services/api/sessionApi";
import type { SessionFormSidebarProps } from "./SessionFormSidebar.types";
import type { SessionRequest } from "@lib/types/api.types";

export const SessionFormSidebar = ({ date, room }: SessionFormSidebarProps) => {
  const navigate = useNavigate();
  const { reservation, clearReservation } = useReservationData();

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    lecturer: "",
    subject: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reservation) {
    return (
      <div className="session-form-sidebar">
        <p style={{ color: "red" }}>Błąd: Brak danych rezerwacji</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.startTime || !formData.endTime || !formData.lecturer || !formData.subject) {
      setError("Wszystkie pola są wymagane");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("Godzina zakończenia musi być później niż godzina rozpoczęcia");
      return;
    }

    try {
      setIsLoading(true);

      const sessionRequest: SessionRequest = {
        reservationId: reservation.reservationId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        lecturer: formData.lecturer,
        subject: formData.subject,
      };

      const response = await createSession(sessionRequest);

      // Clear reservation context after successful submission
      clearReservation();

      // Navigate to confirmation page with session data
      navigate("/confirmation", { state: response });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Błąd podczas tworzenia zajęć";
      setError(message);
      console.error("Error creating session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="session-form-sidebar">
      <h3>Uzupełnij dane zajęć</h3>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Date - readonly */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Data:</label>
          <input type="text" value={date} readOnly disabled style={{ width: "100%" }} />
        </div>

        {/* Room - readonly */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Sala:</label>
          <input type="text" value={room.name} readOnly disabled style={{ width: "100%" }} />
        </div>

        {/* Start Time */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Godzina rozpoczęcia (HH:MM):</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            disabled={isLoading}
            style={{ width: "100%" }}
            required
          />
        </div>

        {/* End Time */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Godzina zakończenia (HH:MM):</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            disabled={isLoading}
            style={{ width: "100%" }}
            required
          />
        </div>

        {/* Lecturer */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Wykładowca:</label>
          <input
            type="text"
            name="lecturer"
            value={formData.lecturer}
            onChange={handleInputChange}
            placeholder="Imię i nazwisko"
            disabled={isLoading}
            style={{ width: "100%" }}
            required
          />
        </div>

        {/* Subject */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Przedmiot:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Nazwa przedmiotu"
            disabled={isLoading}
            style={{ width: "100%" }}
            required
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "0.5rem", marginBottom: "2rem" }} disabled={isLoading}>
          {isLoading ? "Dodawanie..." : "Dodaj zajęcia"}
        </button>
      </form>
    </div>
  );
};
