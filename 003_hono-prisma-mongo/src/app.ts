import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { logger as honologger } from "hono/logger";
import { cors } from "hono/cors";
import { userRoutes } from "./routes";

const app = new Hono();

/**
 * Global Middleware Pipeline (Order matters mere munna! 🥸)
 */
app.use(requestId()); // now each request will have it's own unique id for tracing
app.use(honologger()); // logs all the requests
app.use(
  cors({ origin: "*", allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE"] })
); // handle CORS

/**
 * Routes Registration
 */
app.get("/", (c) => c.json({ message: "Raam Raam Laadle" }));

app.route("/api/users", userRoutes);

// Global Error Handler - catches all uncaught errors
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Custom Error Message", 500);
});

app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Munna you are lost. This endpoint does not exists",
      requestId: c.get("requestId"),
    },
    404
  );
});

export default app;
