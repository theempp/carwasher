export type AvailabilitySlot = {
  start: string;
  schedulingUrl: string;
};

export type AvailabilityResponse = {
  configured: boolean;
  slots: AvailabilitySlot[];
};

export function parseAvailability(data: unknown): AvailabilityResponse {
  if (!data || typeof data !== "object") {
    return { configured: false, slots: [] };
  }
  const record = data as Record<string, unknown>;
  const configured = record.configured === true;
  const raw = Array.isArray(record.slots) ? record.slots : [];
  const slots: AvailabilitySlot[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const slot = item as Record<string, unknown>;
    if (typeof slot.start !== "string" || typeof slot.schedulingUrl !== "string") {
      continue;
    }
    if (!slot.start || !slot.schedulingUrl) continue;
    slots.push({ start: slot.start, schedulingUrl: slot.schedulingUrl });
  }
  return { configured, slots };
}
