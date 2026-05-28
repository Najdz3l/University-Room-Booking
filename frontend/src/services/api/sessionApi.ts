/**
 * Session API Service
 * Handles session (zajęcia) creation
 */

import { APIEndpoints } from "./endpoints";
import type { SessionRequest, SessionResponse } from "@lib/types/api.types";

/**
 * Create a session
 * POST /api/v1/sessions
 *
 * TODO: Implement this endpoint once backend is ready
 */
export const createSession = async (data: SessionRequest): Promise<SessionResponse> => {
  try {
    const response = await fetch(APIEndpoints.SESSIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SessionResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};
