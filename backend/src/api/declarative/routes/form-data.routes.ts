import { Hono } from "hono";
import { getFormData } from "@declarative/controllers/form-data.controller";

// /api/v1/declarative/form-data
export const router = new Hono();

router.get("/", getFormData);

export default router;
