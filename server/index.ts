import fs from "node:fs";
import { randomUUID } from "node:crypto";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeLeadSubmission, StoredLead } from "../shared/lead";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveStaticPath = () =>
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

const readLeadsFile = async (filepath: string): Promise<StoredLead[]> => {
  try {
    const content = await fs.promises.readFile(filepath, "utf-8");
    return JSON.parse(content) as StoredLead[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeLeadsFile = async (filepath: string, leads: StoredLead[]): Promise<void> => {
  await fs.promises.writeFile(filepath, JSON.stringify(leads, null, 2));
};

async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath = resolveStaticPath();
  const leadsFilepath = path.resolve(__dirname, "leads.json");
  let leads = await readLeadsFile(leadsFilepath);

  if (!fs.existsSync(staticPath)) {
    console.warn(
      `Static assets directory "${staticPath}" was not found. Did you run \"pnpm build\"?`
    );
  }

  app.use(express.json());
  app.use(express.static(staticPath));

  app.post("/api/leads", async (req, res) => {
    const normalizedLead = normalizeLeadSubmission(req.body);

    if (!normalizedLead) {
      return res.status(400).json({ message: "Nome, WhatsApp e dados da simulação são obrigatórios." });
    }

    const newLead: StoredLead = {
      id: randomUUID(),
      ...normalizedLead,
      createdAt: new Date().toISOString()
    };

    leads.push(newLead);

    try {
      await writeLeadsFile(leadsFilepath, leads);
      return res.status(201).json({ leadId: newLead.id });
    } catch (error) {
      console.error("Failed to persist lead", error);
      leads = leads.filter((lead) => lead.id !== newLead.id);
      return res.status(500).json({ message: "Não foi possível salvar suas informações agora." });
    }
  });

  app.get("/api/crm/leads", (_req, res) => {
    res.json({ leads });
  });

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
