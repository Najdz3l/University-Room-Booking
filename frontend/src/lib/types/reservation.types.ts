/**
 * Reservation Data Context Types
 * Types for ReservationDataContext that stores temporary reservation state
 */

import type { Room } from "./api.types";

export interface ReservationData {
  reservationId: string;
  date: string; // yyyy-mm-dd
  room: Room;
  reservationEndTime: string; // HH:MM
}

export interface ReservationDataContextType {
  reservation: ReservationData | null;
  setReservation: (data: ReservationData) => void;
  clearReservation: () => void;
}

export interface ReservationDataProviderProps {
  children: React.ReactNode;
}
