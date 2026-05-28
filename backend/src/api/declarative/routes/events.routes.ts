import { Hono } from "hono";
import { getEvents, createEvent, deleteEvent, exportEvents } from "@declarative/controllers/events.controller";

// /api/v1/declarative/events
export const router = new Hono();

router.get("/", getEvents);
router.get("/export", exportEvents);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);

export default router;
