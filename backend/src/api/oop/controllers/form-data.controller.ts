import type { Context } from "hono";
import { FormDataService } from "@oop/services/form-data.service";
import type { FormattedFormData } from "@oop/types/form-data.types";

export class FormDataController {
  constructor(private readonly formDataService: FormDataService = new FormDataService()) {}

  async getFormData(c: Context) {
    const formData: FormattedFormData = await this.formDataService.getFormData();
    return c.json(formData, 200);
  }
}
