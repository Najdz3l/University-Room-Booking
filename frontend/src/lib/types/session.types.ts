/**
 * Session Form & Data Types
 * Types for session creation form and submission
 */

import type { Room } from "./api.types";

export interface SessionFormData {
  date: string; // yyyy-mm-dd (readonly from reservation)
  roomId: string; // readonly from reservation
  roomName: string; // readonly from reservation
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  lecturer: string;
  subject: string;
}

export interface SessionConfirmationData {
  sessionId: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  room: Room;
  lecturer: string;
  subject: string;
  createdAt?: string;
}

export interface SessionFormProps {
  date: string;
  room: Room;
  onSubmit: (data: SessionFormData) => Promise<void>;
  isLoading?: boolean;
}
