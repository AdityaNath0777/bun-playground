import { Hono } from "hono";
import prisma from "./lib/prisma";

const app = new Hono();
const PORT = parseInt(String(process.env.PORT)) || 3030;

app.get("/", (c) => {
  return c.json({ message: "Raam Raam Laadle" });
});

app.get("/users", async (c) => {
  const limit = parseInt(String(c.req.query("limit"))) || 1;
  const skip = parseInt(String(c.req.query("skip"))) || 1;

  const users = await prisma.user.findMany({
    take: limit,
    skip: skip,
    select: { name: true, id: true },
  });
  return c.json({ users });
});

app.post("/user", async (c) => {
  try {
    const body = await c.req.json();

    console.log("body: ", body);

    if (!body.email || !body.password) {
      throw new Error(
        "VALIDATION_ERROR: please provide all the necessary fields"
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name || null,
      },
    });

    return c.json({
      user,
      message: "Congratulations! You are now a member of our gang 😈",
    });
  } catch (err) {
    console.error(err);
    c.status(400); // Bad Request -> used for client error such as validation error
    return c.json({ message: "Failed to create new user" });
  }
});

app.delete("/user/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const deletedUser = await prisma.user.delete({ where: { id } });

    c.status(200);
    return c.json({ deletedUser });
  } catch (err) {
    console.error(err);
    c.status(400); // Bad Request -> used for client error such as validation error
    return c.json({ message: `Failed to delete user with id: ${id}` });
  }
});

export default {
  port: PORT,

  // app.fetch will be entry point of our application.
  fetch: app.fetch,
};
