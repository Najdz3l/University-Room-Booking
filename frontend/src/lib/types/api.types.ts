/**
 * API Request/Response Types
 * All types for API calls and data structures
 */

// ============================================================================
// FORM DATA & CONFIGURATION
// ============================================================================

export interface Room {
  id: string;
  name: string;
  capacity?: number;
  availability?: string[];
}

export interface Lecturer {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
}

export type RoomsData = Record<string, Record<string, Room[]>>;

export interface FormField {
  name: string;
  type: "text" | "email" | "select" | "date" | "time" | "number";
  label: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface FormData {
  rooms: RoomsData;
  lecturers: Lecturer[];
  classes: Class[];
  formFields?: FormField[];
  instructions?: string;
}

export type FormDataResponse = FormData;

// ============================================================================
// CALENDAR & EVENTS
// ============================================================================

export interface CreateEventRequest {
  classId: string;
  roomId: string;
  lecturerId: string;
  startTime: string; // ISO String with Timezone
  endTime: string; // ISO String with Timezone
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  extendedProps?: {
    room?: string;
    roomId?: string;
    lecturer?: string;
    subject?: string;
    [key: string]: unknown;
  };
}

export type CalendarEventsResponse = CalendarEvent[];

// ============================================================================
// RESERVATION
// ============================================================================

export interface ReservationRequest {
  date: string; // yyyy-mm-dd
  roomId: string;
}

export interface ReservationResponse {
  reservationId: string;
  date: string; // yyyy-mm-dd
  room: Room;
  reservationEndTime: string; // HH:MM
}

// ============================================================================
// SESSION (ZAJĘCIA)
// ============================================================================

export interface SessionRequest {
  reservationId: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  lecturer: string;
  subject: string;
}

export interface SessionResponse {
  sessionId: string;
  reservationId: string;
  date: string; // yyyy-mm-dd
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  room: Room;
  lecturer: string;
  subject: string;
  createdAt?: string;
}

// ============================================================================
// CONTEXT & UI TYPES
// ============================================================================

export interface FormDataContextType {
  data: FormData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface FormDataProviderProps {
  children: React.ReactNode;
}
