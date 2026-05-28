import { Hono } from "hono";
import formDataRouter from "@declarative/routes/form-data.routes";
import eventsRouter from "@declarative/routes/events.routes";

// /api/v1/declarative
const router = new Hono();

router.route("/form-data", formDataRouter);
router.route("/events", eventsRouter);

export default router;
