import { Hono } from "hono";

const app = new Hono();
const PORT = parseInt(String(process.env.PORT)) || 3030;

app.get("/", (c) => {
  return c.json({message: "Raam Raam Laadle"});
});

export default {
  port: PORT,

  // app.fetch will be entry point of our application.
  fetch: app.fetch
}
