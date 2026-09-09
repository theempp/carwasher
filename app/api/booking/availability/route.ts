import type { AvailabilityResponse, AvailabilitySlot } from "@/lib/booking/availability";

export const dynamic = "force-dynamic";

const CALENDLY = "https://api.calendly.com";
const RANGE_MS = 6 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000;

type CalendlyUser = {
  resource?: { uri?: string };
};

type CalendlyEventType = {
  uri?: string;
  active?: boolean;
  scheduling_url?: string;
};

type CalendlyEventTypes = {
  collection?: CalendlyEventType[];
};

type CalendlyAvailableTime = {
  status?: string;
  start_time?: string;
  scheduling_url?: string;
};

type CalendlyAvailableTimes = {
  collection?: CalendlyAvailableTime[];
};

function empty(): AvailabilityResponse {
  return { configured: false, slots: [] };
}

function json(body: AvailabilityResponse, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function pageKey(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}`.toLowerCase();
  } catch {
    return "";
  }
}

async function calendly<T>(path: string, token: string): Promise<T | null> {
  const response = await fetch(`${CALENDLY}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function resolveEventType(
  token: string,
  pageUrl: string,
  explicitUri: string,
): Promise<string> {
  if (explicitUri) return explicitUri;

  const me = await calendly<CalendlyUser>("/users/me", token);
  const userUri = me?.resource?.uri;
  if (!userUri) return "";

  const types = await calendly<CalendlyEventTypes>(
    `/event_types?user=${encodeURIComponent(userUri)}&active=true`,
    token,
  );
  const collection = types?.collection ?? [];
  const want = pageKey(pageUrl);
  if (want) {
    const matched = collection.find((eventType) => {
      const scheduling = eventType.scheduling_url
        ? pageKey(eventType.scheduling_url)
        : "";
      return scheduling === want || (scheduling && want.startsWith(scheduling));
    });
    if (matched?.uri) return matched.uri;
  }
  return collection.find((eventType) => eventType.active !== false)?.uri ?? "";
}

export async function GET() {
  const token = process.env.CALENDLY_TOKEN?.trim() ?? "";
  if (!token) return json(empty());

  const pageUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ??
    process.env.CALENDLY_SCHEDULING_URL?.trim() ??
    "";
  const explicitUri = process.env.CALENDLY_EVENT_TYPE_URI?.trim() ?? "";

  try {
    const eventType = await resolveEventType(token, pageUrl, explicitUri);
    if (!eventType) return json(empty());

    const start = new Date();
    const end = new Date(start.getTime() + RANGE_MS);
    const query = new URLSearchParams({
      event_type: eventType,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    });
    const times = await calendly<CalendlyAvailableTimes>(
      `/event_type_available_times?${query.toString()}`,
      token,
    );
    if (!times) return json({ configured: true, slots: [] });

    const slots: AvailabilitySlot[] = [];
    for (const item of times.collection ?? []) {
      if (item.status && item.status !== "available") continue;
      if (!item.start_time || !item.scheduling_url) continue;
      slots.push({
        start: item.start_time,
        schedulingUrl: item.scheduling_url,
      });
    }
    return json({ configured: true, slots });
  } catch {
    return json({ configured: true, slots: [] });
  }
}
