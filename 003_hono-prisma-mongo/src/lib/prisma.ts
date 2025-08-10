import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const prisma: PrismaClient = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "error", "warn"]
      : ["error"],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info(`Database🛢️ connected successfully!`);
  } catch (err) {
    logger.error(`Database❌ connection failed!`)
    throw err;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info(`Database disconnected!`);
  } catch (err) {
    logger.error('Error disconnecting from database:', err);
    throw err;
  }
}

// to add mock data to the DB

// async function main() {
//   await prisma.user.create({
//     data: {
//       name: 'Jaadu',
//       email: 'jaadu@prisma.com',
//       posts: {
//         create: {
//           title: 'Mera jaadu',
//           body: 'Yahoooooooooo',
//           slug: 'mera-jaadu',
//         },
//       },
//     },
//   })

//   const allUsers = await prisma.user.findMany({
//     include: {
//       posts: true
//     }
//   });
//   console.log("all users: ", allUsers);

//   console.dir(allUsers, { depth: null });
// }

// main()
//   .catch(async (e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

export default prisma;
