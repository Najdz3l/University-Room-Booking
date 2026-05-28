/**
 * ConfirmationCard Component
 * Displays confirmation of successfully created session/zajęcia
 */

import { useNavigate } from "react-router-dom";
import type { ConfirmationCardProps } from "./ConfirmationCard.types";

export const ConfirmationCard = ({ data, onDone }: ConfirmationCardProps) => {
  const navigate = useNavigate();

  const handleBackToCalendar = () => {
    if (onDone) {
      onDone();
    }
    navigate("/");
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        border: "2px solid #4caf50",
        borderRadius: "8px",
        backgroundColor: "#f1f8f4",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#4caf50", margin: "0 0 0.5rem 0" }}>✓ Zajęcia zostały dodane!</h2>
        <p style={{ color: "#666", margin: "0" }}>Podsumowanie Twojej rezerwacji</p>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "6px", marginBottom: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", color: "#333" }}>Data:</label>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>{data.date}</p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", color: "#333" }}>Sala:</label>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>{data.room.name}</p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", color: "#333" }}>Godzina:</label>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            {data.startTime} - {data.endTime}
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", color: "#333" }}>Przedmiot:</label>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>{data.subject}</p>
        </div>

        <div style={{ marginBottom: "0" }}>
          <label style={{ fontWeight: "bold", color: "#333" }}>Wykładowca:</label>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>{data.lecturer}</p>
        </div>

        {data.sessionId && (
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
            <label style={{ fontWeight: "bold", color: "#999", fontSize: "0.85rem" }}>ID sesji:</label>
            <p style={{ margin: "0.25rem 0 0 0", color: "#bbb", fontSize: "0.85rem" }}>{data.sessionId}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleBackToCalendar}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = "#45a049";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = "#4caf50";
        }}
      >
        Powrót do kalendarza
      </button>
    </div>
  );
};
