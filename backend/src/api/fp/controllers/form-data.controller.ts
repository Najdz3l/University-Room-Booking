import type { Context } from "hono";
import { getFormData as serviceGetFormData } from "@fp/services/form-data.service";
import type { FormattedFormData } from "@fp/types/form-data.types";

export const getFormData = async (c: Context) => {
  const formData: FormattedFormData = await serviceGetFormData();
  return c.json(formData, 200);
};
