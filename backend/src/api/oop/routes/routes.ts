import { Hono } from "hono";
import formDataRouter from "./form-data.routes";
import eventsRouter from "./events.routes";

// /api/v1/oop
const router = new Hono();

router.route("/form-data", formDataRouter);
router.route("/events", eventsRouter);

export default router;
