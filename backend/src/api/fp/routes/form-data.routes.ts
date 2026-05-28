import { Hono } from "hono";
import { getFormData } from "@fp/controllers/form-data.controller";

// /api/v1/fp/form-data
export const router = new Hono();

router.get("/", getFormData);

export default router;
