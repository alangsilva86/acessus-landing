export interface SimulationPayload {
  userType: string;
  organ: string;
  marginType: string;
  marginValue: string;
}

export interface LeadSubmission {
  name: string;
  whatsapp: string;
  simulation: SimulationPayload;
}

export interface StoredLead extends LeadSubmission {
  id: string;
  createdAt: string;
}

export const MIN_WHATSAPP_DIGITS = 10;

export const sanitizeWhatsapp = (value: string) => value.replace(/\D/g, "").slice(0, 11);

export const hasValidWhatsapp = (value: string) => sanitizeWhatsapp(value).length >= MIN_WHATSAPP_DIGITS;

export const normalizeLeadSubmission = (payload: unknown): LeadSubmission | null => {
  if (!payload || typeof payload !== "object") return null;

  const payloadRecord = payload as Record<string, unknown>;
  const rawName = typeof payloadRecord.name === "string" ? payloadRecord.name : "";
  const name = rawName.trim();
  const whatsapp = typeof payloadRecord.whatsapp === "string" ? payloadRecord.whatsapp : "";
  const simulation = normalizeSimulationPayload(payloadRecord.simulation);

  if (!name || !hasValidWhatsapp(whatsapp) || !simulation) {
    return null;
  }

  return {
    name,
    whatsapp: sanitizeWhatsapp(whatsapp),
    simulation
  };
};

export const normalizeSimulationPayload = (simulation: unknown): SimulationPayload | null => {
  if (!simulation || typeof simulation !== "object") return null;
  const record = simulation as Record<string, unknown>;

  const userType = typeof record.userType === "string" ? record.userType : "";
  const organ = typeof record.organ === "string" ? record.organ : "";
  const marginType = typeof record.marginType === "string" ? record.marginType : "";
  const marginValue = typeof record.marginValue === "string" ? record.marginValue : "";

  if (!userType || !organ || !marginType || !marginValue) {
    return null;
  }

  return {
    userType,
    organ,
    marginType,
    marginValue
  };
};
