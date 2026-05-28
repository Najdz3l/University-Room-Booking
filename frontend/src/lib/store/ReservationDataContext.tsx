/**
 * Reservation Data Context
 * Stores temporary reservation data between routes
 * Data is cleared after session is confirmed
 */

import { createContext, useState } from "react";
import type { ReservationData, ReservationDataContextType, ReservationDataProviderProps } from "@lib/types/reservation.types";

export const ReservationDataContext = createContext<ReservationDataContextType | undefined>(undefined);

export const ReservationDataProvider = ({ children }: ReservationDataProviderProps) => {
  const [reservation, setReservationState] = useState<ReservationData | null>(null);

  const setReservation = (data: ReservationData) => {
    console.log("Setting reservation data:", data);
    setReservationState(data);
  };

  const clearReservation = () => {
    console.log("Clearing reservation data");
    setReservationState(null);
  };

  return (
    <ReservationDataContext.Provider value={{ reservation, setReservation, clearReservation }}>
      {children}
    </ReservationDataContext.Provider>
  );
};
