import { createRequestHandler } from "@remix-run/express";
import express from "express";
import connectDb from "./app/config/db.js";
import dotenv from "dotenv";

dotenv.config();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Vite middleware
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(express.static("build/client"));
}

connectDb()
  .then(() => {
    console.log("✅ Database connection established on server startup");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database on startup:", err.message);
    console.error("💡 Make sure your .env file has the correct MONGODB_URI");
  });

const build = viteDevServer
  ? () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      )
  : await import("./build/server/index.js");

app.get("/.well-known/*", (req, res) => {
  res.status(404).end();
});

app.all("*", createRequestHandler({ build }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});

