/**
 * FormData API Service
 * Handles fetching form data including rooms and configuration
 */

import { APIEndpoints } from "./endpoints";
import type { FormDataResponse } from "@lib/types/api.types";

/**
 * Fetch form data containing rooms and form field configuration
 * GET /api/v1/form-data
 */
export const fetchFormData = async (): Promise<FormDataResponse> => {
  try {
    const response = await fetch(APIEndpoints.FORM_DATA);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FormDataResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw error;
  }
};
