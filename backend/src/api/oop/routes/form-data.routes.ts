import { Hono } from "hono";
import { FormDataController } from "@oop/controllers/form-data.controller";

const formDataController = new FormDataController();

// /api/v1/oop/form-data
export const router = new Hono();

router.get("/", (c) => formDataController.getFormData(c));

export default router;
