import { useContext } from "react";
import { FormDataContext } from "@lib/store/FormDataContext";

export const useFormData = () => {
  const context = useContext(FormDataContext);

  if (context === undefined) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }

  return context;
};
