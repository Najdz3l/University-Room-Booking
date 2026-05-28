/**
 * Calendar API Service
 * Handles fetching calendar events
 */

import { APIEndpoints } from "./endpoints";
import type { CalendarEventsResponse } from "@lib/types/api.types";

/**
 * Fetch calendar events
 * GET /api/v1/oop/events
 */
export const fetchCalendarEvents = async (
  startStr: string,
  endStr: string,
  format: string,
): Promise<CalendarEventsResponse> => {
  try {
    const startParam = startStr.replace(/\+/g, "%2B");
    const endParam = endStr.replace(/\+/g, "%2B");
    const url = `${APIEndpoints.CALENDAR_EVENTS}?start=${startParam}&end=${endParam}&format=${format.toUpperCase()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CalendarEventsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};
