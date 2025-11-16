import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { normalizeLeadSubmission, StoredLead } from "../shared/lead";

const LOCAL_LEADS_FILE = path.resolve(process.cwd(), "server", "leads.json");
const TMP_LEADS_FILE = path.resolve("/tmp", "leads.json");

const readLeadsFile = async (filepath: string): Promise<StoredLead[]> => {
  try {
    const content = await fs.readFile(filepath, "utf-8");
    return JSON.parse(content) as StoredLead[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
};

const writeLeadsFile = async (filepath: string, leads: StoredLead[]) => {
  await fs.mkdir(path.dirname(filepath), { recursive: true }).catch(() => {});
  await fs.writeFile(filepath, JSON.stringify(leads, null, 2), "utf-8");
};

const persistLocally = async (lead: StoredLead) => {
  const filepath = process.env.VERCEL ? TMP_LEADS_FILE : LOCAL_LEADS_FILE;
  const leads = await readLeadsFile(filepath);
  leads.push(lead);
  await writeLeadsFile(filepath, leads);
};

const persistLead = async (lead: StoredLead) => {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(`leads/${lead.id}.json`, JSON.stringify(lead, null, 2), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
    });
    return;
  }

  await persistLocally(lead);
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Método não suportado." });
  }

  const normalizedLead = normalizeLeadSubmission(request.body);

  if (!normalizedLead) {
    return response.status(400).json({ message: "Nome, WhatsApp e dados da simulação são obrigatórios." });
  }

  const lead: StoredLead = {
    id: randomUUID(),
    ...normalizedLead,
    createdAt: new Date().toISOString(),
  };

  try {
    await persistLead(lead);
    return response.status(201).json({ leadId: lead.id });
  } catch (error) {
    console.error("Failed to persist lead via serverless function", error);
    return response.status(500).json({ message: "Não foi possível salvar suas informações agora." });
  }
}
