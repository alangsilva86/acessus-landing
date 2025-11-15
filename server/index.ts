import fs from "node:fs";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveStaticPath = () =>
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath = resolveStaticPath();

  if (!fs.existsSync(staticPath)) {
    console.warn(
      `Static assets directory "${staticPath}" was not found. Did you run \"pnpm build\"?`
    );
  }

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const host = process.env.HOST ?? "0.0.0.0";

  server.listen(port, host, () => {
    const displayHost = host === "0.0.0.0" ? "localhost" : host;
    console.log(`Server running on http://${displayHost}:${port}/`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exitCode = 1;
});
