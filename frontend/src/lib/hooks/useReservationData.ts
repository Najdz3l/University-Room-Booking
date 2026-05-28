/**
 * useReservationData Hook
 * Custom hook to access ReservationDataContext
 */

import { useContext } from "react";
import { ReservationDataContext } from "@lib/store/ReservationDataContext";
import type { ReservationDataContextType } from "@lib/types/reservation.types";

export const useReservationData = (): ReservationDataContextType => {
  const context = useContext(ReservationDataContext);

  if (context === undefined) {
    throw new Error("useReservationData must be used within ReservationDataProvider");
  }

  return context;
};
