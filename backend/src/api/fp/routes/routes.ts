import { Hono } from "hono";
import formDataRouter from "@fp/routes/form-data.routes";
import eventsRouter from "@fp/routes/events.routes";

// /api/v1/fp
const router = new Hono();

router.route("/form-data", formDataRouter);
router.route("/events", eventsRouter);

export default router;
