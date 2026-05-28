/**
 * Form Data Context
 * Provides form configuration and room data to the entire application
 * Fetches data on mount from /api/v1/form-data
 */

import { createContext, useState, useEffect } from "react";
import type { FormDataContextType, FormDataProviderProps, FormData } from "@lib/types/api.types";
import { fetchFormData } from "@services/api/formDataApi";

export const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const FormDataProvider = ({ children }: FormDataProviderProps) => {
  const [data, setData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = await fetchFormData();
      setData(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nieznany błąd podczas pobierania danych";
      setError(message);
      console.error("Failed to fetch form data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FormDataContext.Provider value={{ data, loading, error, refetch: fetchData }}>{children}</FormDataContext.Provider>
  );
};
