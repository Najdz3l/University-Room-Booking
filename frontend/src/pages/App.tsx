import { useFormData } from "@lib/hooks/useFormData";
import { CalendarPage } from "./CalendarPage/CalendarPage";
import { ConfirmationPage } from "./ConfirmationPage/ConfirmationPage";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
  // Pobranie danych do formularza
  const { data, loading, error } = useFormData();

  useEffect(() => {
    document.title = "Kalendarz zajęć";
    // console.log("Form data:", { data, loading, error });
  }, [data, loading, error]);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Ładowanie...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "red" }}>Błąd: {error}</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<CalendarPage mode="month" />} />
      <Route path="/reservation/:reservationId" element={<CalendarPage mode="day" />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
    </Routes>
  );
};

export default App;
