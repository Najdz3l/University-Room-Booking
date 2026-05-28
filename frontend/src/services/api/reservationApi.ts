/**
 * Reservation API Service
 * Handles reservation creation
 */

import { APIEndpoints } from "./endpoints";
import type { ReservationRequest, ReservationResponse, CreateEventRequest } from "@lib/types/api.types";

/**
 * Create a new event/reservation
 * POST /api/v1/oop/events
 */
export const createEvent = async (data: CreateEventRequest): Promise<void> => {
  try {
    const response = await fetch(APIEndpoints.CALENDAR_EVENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * Delete an event
 * DELETE /api/v1/oop/events/:id
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${APIEndpoints.CALENDAR_EVENTS}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Create a reservation
 * POST /api/v1/reservations

 *
 * TODO: Implement this endpoint once backend is ready
 */
export const createReservation = async (data: ReservationRequest): Promise<ReservationResponse> => {
  try {
    const response = await fetch(APIEndpoints.RESERVATIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ReservationResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};
