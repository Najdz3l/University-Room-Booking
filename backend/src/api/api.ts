import { Hono } from "hono";
import oopRouter from "@oop/routes/routes";
import fpRouter from "@fp/routes/routes";
import declarativeRouter from "@declarative/routes/routes";

// /api/v1
export const router = new Hono();

router.get("/", (c) => {
  return c.json({ message: "Hello API!" });
});

router.route("/oop", oopRouter);
router.route("/fp", fpRouter);
router.route("/declarative", declarativeRouter);

export default router;
