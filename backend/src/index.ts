import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { trailingSlashMiddleware } from "./middleware/trailing-slash";
import { ENV } from "@lib/constants/env";
import { errorHandler } from "@middleware/error-handler";

// Route handlers
import router from "./api/api";

const app = new Hono();

app.onError(errorHandler);
app.use(corsMiddleware);
app.use(trailingSlashMiddleware);

app.get("/health", (c) => {
  return c.json({ status: "OK" });
});
app.route("/api/v1", router);

export default {
  port: ENV.PORT,
  fetch: app.fetch,
};
