import { serve } from "bun";
import app from "./app";
import { config } from "./config/env.config";

const startServer = async () => {
  try {
    serve({
      port: config.PORT,

      // app.fetch will be entry point of our application.
      fetch: app.fetch,
    });

    console.log(`Server running on Port: ${config.PORT}`);

    process.on("SIGTERM", async () => {
      console.info("SIGTERM received, shutting down gracefully");
      process.exit(0);
    });

    return app;
  } catch (err) {
    console.error(`Failed to start server: `, err);
    process.exit(1);
  }
};

startServer();
