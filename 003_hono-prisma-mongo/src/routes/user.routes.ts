import { Hono } from "hono";
import prisma from "../lib/prisma";

const userRoutes = new Hono()
  .get("/", async (c) => {
    try {
      const limit = parseInt(String(c.req.query("limit"))) || 1;
      const skip = parseInt(String(c.req.query("skip"))) || 1;

      const users = await prisma.user.findMany({
        take: limit,
        skip: skip,
        select: { name: true, id: true },
      });
      return c.json({ users });
    } catch (err) {
      console.error(`Failed to fetch all users: `, err);
      c.status(500);
      return c.json({
        message: `Failed to fetch all users: ${
          err instanceof Error ? err.message : "Something went wrong"
        }`,
      });
    }
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    try {
      const user = await prisma.user.findFirst({ where: { id } });

      return c.json({ user });
    } catch (err) {
      console.error(`Failed to fetch user with id: ${id} `, err);
      c.status(500);
      return c.json({
        message: `Failed to fetch user with id ${id} : ${
          err instanceof Error ? err.message : "Something went wrong"
        }`,
      });
    }
  })
  .post("/user", async (c) => {
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
      console.error(`Failed to create a new user: `, err);
      c.status(400); // Bad Request -> used for client error such as validation error
      return c.json({ message: "Failed to create new user" });
    }
  })
  .delete("/user/:id", async (c) => {
    const id = c.req.param("id");

    try {
      const deletedUser = await prisma.user.delete({ where: { id } });

      c.status(200);
      return c.json({ deletedUser });
    } catch (err) {
      console.error(`Failed to delete user with id: ${id}`, err);
      c.status(400); // Bad Request -> used for client error such as validation error
      return c.json({ message: `Failed to delete user with id: ${id}` });
    }
  });

export default userRoutes;
