/**
 * ConfirmationPage Component
 * Displays session confirmation after successful creation
 * Receives session data from navigation state
 */

import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmationCard } from "@components/atoms/confirmation/ConfirmationCard/ConfirmationCard";
import type { SessionConfirmationData } from "@lib/types/session.types";

export const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get session data from navigation state
  const sessionData = location.state as SessionConfirmationData | null;

  if (!sessionData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>Błąd: Brak danych do wyświetlenia.</p>
        <button onClick={() => navigate("/")} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Powrót do kalendarza
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingTop: "1rem" }}>
      <ConfirmationCard data={sessionData} onDone={() => {}} />
    </div>
  );
};
