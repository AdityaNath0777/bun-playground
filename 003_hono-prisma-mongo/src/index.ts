import { Hono } from "hono";
import { userRoutes } from "./routes";

const app = new Hono();
const PORT = parseInt(String(process.env.PORT)) || 3030;

app.get("/", (c) => {
  return c.json({ message: "Raam Raam Laadle" });
});

app.route("/users", userRoutes);

export default {
  port: PORT,

  // app.fetch will be entry point of our application.
  fetch: app.fetch,
};
