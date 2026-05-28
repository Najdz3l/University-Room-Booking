import { Hono } from "hono";
import { EventsController } from "@oop/controllers/events.controller";

const eventsController = new EventsController();

// /api/v1/oop/events
export const router = new Hono();

router.get("/", (c) => eventsController.getEvents(c));
router.get("/export", (c) => eventsController.exportEvents(c));
router.post("/", (c) => eventsController.createEvent(c));
router.delete("/:id", (c) => eventsController.deleteEvent(c));

export default router;
