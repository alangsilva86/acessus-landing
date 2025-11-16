export const MIN_WHATSAPP_DIGITS = 10;

export const sanitizeWhatsapp = (value) => value.replace(/\D/g, "").slice(0, 11);

export const hasValidWhatsapp = (value) => sanitizeWhatsapp(value).length >= MIN_WHATSAPP_DIGITS;

export const normalizeLeadSubmission = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  const payloadRecord = payload;
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
    simulation,
  };
};

export const normalizeSimulationPayload = (simulation) => {
  if (!simulation || typeof simulation !== "object") return null;
  const record = simulation;

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
    marginValue,
  };
};
