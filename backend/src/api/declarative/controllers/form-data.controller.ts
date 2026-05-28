import type { Context } from "hono";
import { getFormData as serviceGetFormData } from "@declarative/services/form-data.service";
import type { FormattedFormData } from "@declarative/types/form-data.types";

export const getFormData = async (c: Context) => {
  const formData: FormattedFormData = await serviceGetFormData();
  return c.json(formData, 200);
};
