"use client";

import { motion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type Ref,
} from "react";
import {
  parseAvailability,
  type AvailabilitySlot,
} from "@/lib/booking/availability";

const ease = [0.22, 1, 0.36, 1] as const;
const TIMEZONE = "America/New_York";

type Step = "service" | "vehicle" | "town" | "time";

/*
 * Close is the calendar. SMS is the ping on the phone they already watch.
 * Empty SMS = the link stays on #book so the section never pretends to send.
 */
const BOOKING_SMS = "+14752898400";

/*
 * Friend's public Calendly page. Empty = time step stays a labeled placeholder.
 * Hairline live slots also need CALENDLY_TOKEN on the server — never invent times.
 */
const BOOKING_CALENDLY_PAGE = "";
const BOOKING_CALENDLY_URL =
  BOOKING_CALENDLY_PAGE ||
  process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ||
  "";

/**
 * Placeholder words. No prices, no turnaround, no guarantees, and nothing that
 * calls the car finished, spotless or detailed — the film shows a wet car and
 * the site never says otherwise. These must read as placeholders until signed.
 */
const services = [
  { id: "tier-a", label: "[Service tier A]" },
  { id: "tier-b", label: "[Service tier B]" },
  { id: "tier-c", label: "[Service tier C]" },
] as const;

function compose(
  service: string,
  vehicle: string,
  town: string,
  when: string,
) {
  const job = service || "[service]";
  const car = vehicle.trim() || "[vehicle]";
  const place = town.trim() || "[town]";
  const window = when || "[time]";
  return `Hi — I'd like to book ${job} for my ${car} in ${place}. Time: ${window}.`;
}

function smsHref(message: string) {
  if (!BOOKING_SMS) return "#book";
  return `sms:${BOOKING_SMS}?body=${encodeURIComponent(message)}`;
}

function decorateCalendlyUrl(base: string, vehicle: string, town: string) {
  try {
    const url = new URL(base);
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "dad0c1");
    url.searchParams.set("text_color", "1c2329");
    url.searchParams.set("primary_color", "1c2329");
    if (town.trim()) url.searchParams.set("location", town.trim());
    if (vehicle.trim()) url.searchParams.set("a1", vehicle.trim());
    if (town.trim()) url.searchParams.set("a2", town.trim());
    return url.toString();
  } catch {
    return base;
  }
}

let calendlyLoader: Promise<void> | null = null;

function loadCalendly() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (calendlyLoader) return calendlyLoader;
  calendlyLoader = new Promise((resolve, reject) => {
    const cssId = "calendly-widget-css";
    if (!document.getElementById(cssId)) {
      const css = document.createElement("link");
      css.id = cssId;
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(css);
    }
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      calendlyLoader = null;
      reject(new Error("calendly"));
    };
    document.body.appendChild(script);
  });
  return calendlyLoader;
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatDay(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function formatSlot(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function groupSlots(slots: AvailabilitySlot[]) {
  const groups: { day: string; slots: AvailabilitySlot[] }[] = [];
  for (const slot of slots) {
    const day = formatDay(slot.start);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.slots.push(slot);
    else groups.push({ day, slots: [slot] });
  }
  return groups;
}

export function BookingComposer() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [town, setTown] = useState("");
  const [when, setWhen] = useState("");
  const [slotUrl, setSlotUrl] = useState("");
  const [held, setHeld] = useState(false);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [calendarConfigured, setCalendarConfigured] = useState(false);
  const [slotsStatus, setSlotsStatus] = useState<"idle" | "loading" | "ready">(
    "idle",
  );
  const [calendlyError, setCalendlyError] = useState(false);
  const vehicleId = useId();
  const townId = useId();
  const vehicleRef = useRef<HTMLInputElement>(null);
  const townRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLFieldSetElement>(null);
  const timeRef = useRef<HTMLFieldSetElement>(null);

  const message = compose(service, vehicle, town, when);
  const formReady = Boolean(service && vehicle.trim() && town.trim());
  const calendarLinked = calendarConfigured || Boolean(BOOKING_CALENDLY_URL);
  const canHold = formReady && calendarLinked && (Boolean(slotUrl) || Boolean(BOOKING_CALENDLY_URL));
  const canText = held && Boolean(BOOKING_SMS) && formReady && Boolean(when);
  const href = canText ? smsHref(message) : "#book";

  function resetHold() {
    setWhen("");
    setSlotUrl("");
    setHeld(false);
  }

  function go(next: Step) {
    setStep(next);
  }

  function chooseService(label: string) {
    setService(label);
    resetHold();
    go("vehicle");
  }

  function submitVehicle(event?: FormEvent) {
    event?.preventDefault();
    if (!vehicle.trim()) {
      vehicleRef.current?.focus();
      return;
    }
    go("town");
  }

  function submitTown(event?: FormEvent) {
    event?.preventDefault();
    if (!town.trim()) {
      townRef.current?.focus();
      return;
    }
    go("time");
  }

  function chooseSlot(slot: AvailabilitySlot) {
    setSlotUrl(slot.schedulingUrl);
    setWhen(formatSlot(slot.start));
    setHeld(false);
  }

  function focusGap() {
    if (!service) {
      go("service");
      serviceRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    if (!vehicle.trim()) {
      go("vehicle");
      vehicleRef.current?.focus();
      return;
    }
    if (!town.trim()) {
      go("town");
      townRef.current?.focus();
      return;
    }
    go("time");
    timeRef.current?.querySelector<HTMLInputElement>("input")?.focus();
  }

  async function holdSlot() {
    const target = slotUrl || BOOKING_CALENDLY_URL;
    if (!target) {
      focusGap();
      return;
    }
    setCalendlyError(false);
    try {
      await loadCalendly();
      window.Calendly?.initPopupWidget({
        url: decorateCalendlyUrl(target, vehicle, town),
      });
    } catch {
      setCalendlyError(true);
    }
  }

  function helper() {
    if (!service) return "Choose a service to start.";
    if (!vehicle.trim()) return "Add the car.";
    if (!town.trim()) return "Add the town.";
    if (!calendarLinked) {
      return "Live times appear when the calendar is linked. Nothing is stored on this page.";
    }
    if (!when) return "Pick a live time. That holds the calendar.";
    if (calendlyError) return "The calendar could not be opened.";
    if (!held) {
      return "Hold this time on the calendar. You will get a reminder from it.";
    }
    if (!BOOKING_SMS) {
      return "This time is on the calendar. The text channel is not connected yet. Nothing is stored on this page.";
    }
    return "Time is on the calendar. Opens a text so the team sees it. Nothing is stored on this page.";
  }

  useEffect(() => {
    if (step === "vehicle") vehicleRef.current?.focus();
    if (step === "town") townRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (step !== "time") return;
    const controller = new AbortController();
    setSlotsStatus("loading");
    fetch("/api/booking/availability", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data: unknown) => {
        const parsed = parseAvailability(data);
        setCalendarConfigured(parsed.configured);
        setSlots(parsed.slots);
        setSlotsStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setCalendarConfigured(false);
        setSlots([]);
        setSlotsStatus("ready");
      });
    return () => controller.abort();
  }, [step]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://calendly.com") return;
      const data = event.data as { event?: string } | null;
      if (!data || data.event !== "calendly.event_scheduled") return;
      if (!when) setWhen("Held on the calendar");
      setHeld(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [when]);

  return (
    <section id="book" className="bg-[var(--house-stone)] text-[var(--house-ink)]">
      <div
        className="mx-auto flex min-h-[100dvh] max-w-[92rem] flex-col justify-end px-[5vw] pt-24 pb-16 md:pb-20"
        style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-[0.8rem] text-[var(--house-muted)]">Booking</p>
        <h2 className="house-display mt-6 max-w-[12ch] text-[clamp(2.8rem,7vw,5.5rem)]">
          Request a time.
        </h2>
        <p className="mt-6 max-w-[26rem] text-[0.9rem] leading-relaxed text-[var(--house-muted)]">
          One question at a time. A live slot holds the calendar, then a text
          goes to the team.
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col">
            {service && step !== "service" ? (
              <Summary
                label="Service"
                value={service}
                onEdit={() => go("service")}
              />
            ) : null}
            {vehicle.trim() && step !== "vehicle" ? (
              <Summary
                label="Vehicle"
                value={vehicle.trim()}
                onEdit={() => go("vehicle")}
              />
            ) : null}
            {town.trim() && step !== "town" ? (
              <Summary
                label="Town"
                value={town.trim()}
                onEdit={() => go("town")}
              />
            ) : null}
            {when && step !== "time" ? (
              <Summary label="Time" value={when} onEdit={() => go("time")} />
            ) : null}

            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease }}
              className="mt-8 first:mt-0"
            >
              {step === "service" ? (
                <>
                  <Choice
                    ref={serviceRef}
                    name="service"
                    legend="Service"
                    options={services}
                    value={service}
                    onChange={chooseService}
                  />
                  {service ? (
                    <button
                      type="button"
                      onClick={() => go("vehicle")}
                      className="house-cta mt-8"
                    >
                      Continue
                    </button>
                  ) : null}
                </>
              ) : null}

              {step === "vehicle" ? (
                <form onSubmit={submitVehicle}>
                  <label htmlFor={vehicleId} className="text-[0.8rem] text-[var(--house-muted)]">
                    Vehicle
                  </label>
                  <input
                    ref={vehicleRef}
                    id={vehicleId}
                    type="text"
                    value={vehicle}
                    onChange={(event) => {
                      setVehicle(event.target.value);
                      resetHold();
                    }}
                    placeholder="Year, make, model"
                    autoComplete="off"
                    enterKeyHint="next"
                    className="mt-4 block min-h-[52px] w-full border-0 border-b border-[var(--house-rule)] bg-transparent pb-3 text-[0.95rem] text-[var(--house-ink)] outline-none placeholder:text-[var(--house-muted)] focus:border-[var(--house-ink)]"
                  />
                  <Continue />
                </form>
              ) : null}

              {step === "town" ? (
                <form onSubmit={submitTown}>
                  <label htmlFor={townId} className="text-[0.8rem] text-[var(--house-muted)]">
                    Town
                  </label>
                  <input
                    ref={townRef}
                    id={townId}
                    type="text"
                    value={town}
                    onChange={(event) => {
                      setTown(event.target.value);
                      resetHold();
                    }}
                    placeholder="Where should we come"
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    className="mt-4 block min-h-[52px] w-full border-0 border-b border-[var(--house-rule)] bg-transparent pb-3 text-[0.95rem] text-[var(--house-ink)] outline-none placeholder:text-[var(--house-muted)] focus:border-[var(--house-ink)]"
                  />
                  <Continue />
                </form>
              ) : null}

              {step === "time" ? (
                <TimeStep
                  ref={timeRef}
                  slots={slots}
                  status={slotsStatus}
                  configured={calendarConfigured}
                  pageUrl={BOOKING_CALENDLY_URL}
                  value={slotUrl}
                  onChoose={chooseSlot}
                />
              ) : null}
            </motion.div>
          </div>

          <div className="flex flex-col justify-end">
            <p className="text-[0.8rem] text-[var(--house-muted)]">Your request</p>
            <output
              aria-live="polite"
              className="mt-4 block border-t border-[var(--house-rule)] pt-4 text-[0.9rem] leading-relaxed text-[var(--house-ink)]"
            >
              {message}
            </output>

            {/* Present from the first render, so the section still works if the
                interactive layer never comes up. */}
            <a
              href={href}
              aria-disabled={!canText && !canHold}
              onClick={(event) => {
                if (canText) return;
                event.preventDefault();
                if (!formReady || !calendarLinked) {
                  focusGap();
                  return;
                }
                if (canHold && !held) {
                  void holdSlot();
                  return;
                }
                focusGap();
              }}
              className="house-cta mt-10"
            >
              {held ? "Text this time" : "Hold this time"}
            </a>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-[var(--house-muted)]">
              {helper()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Continue() {
  return (
    <button
      type="submit"
      className="house-cta mt-8"
    >
      Continue
    </button>
  );
}

function Summary({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex min-h-[52px] w-full items-center justify-between gap-6 border-b border-[var(--house-rule)] text-left"
    >
      <span className="text-[0.8rem] text-[var(--house-muted)]">{label}</span>
      <span className="truncate text-[0.9rem] text-[var(--house-ink)]">
        {value}
      </span>
    </button>
  );
}

function TimeStep({
  ref,
  slots,
  status,
  configured,
  pageUrl,
  value,
  onChoose,
}: {
  ref?: Ref<HTMLFieldSetElement>;
  slots: AvailabilitySlot[];
  status: "idle" | "loading" | "ready";
  configured: boolean;
  pageUrl: string;
  value: string;
  onChoose: (slot: AvailabilitySlot) => void;
}) {
  const groups = groupSlots(slots);
  const linked = configured || Boolean(pageUrl);

  return (
    <fieldset ref={ref} className="m-0 border-0 p-0">
      <legend className="p-0 text-[0.8rem] text-[var(--house-muted)]">Time</legend>
      {!linked && status !== "loading" ? (
        <p className="mt-4 border-t border-[var(--house-rule)] pt-4 text-[0.9rem] leading-relaxed text-[var(--house-muted)]">
          Calendar not linked. Live times will appear here — nothing is held
          yet.
        </p>
      ) : null}
      {status === "loading" ? (
        <p className="mt-4 border-t border-[var(--house-rule)] pt-4 text-[0.9rem] leading-relaxed text-[var(--house-muted)]">
          Looking up live times.
        </p>
      ) : null}
      {status === "ready" && configured && slots.length === 0 ? (
        <p className="mt-4 border-t border-[var(--house-rule)] pt-4 text-[0.9rem] leading-relaxed text-[var(--house-muted)]">
          No live times in the next seven days.
        </p>
      ) : null}
      {status === "ready" && !configured && pageUrl ? (
        <p className="mt-4 border-t border-[var(--house-rule)] pt-4 text-[0.9rem] leading-relaxed text-[var(--house-muted)]">
          Open the calendar to pick a free time. That holds the slot.
        </p>
      ) : null}
      {groups.length > 0 ? (
        <div className="mt-4">
          {groups.map((group) => (
            <div key={group.day}>
              <p className="mt-8 text-[0.8rem] text-[var(--house-muted)] first:mt-0">{group.day}</p>
              <div className="mt-4 border-t border-[var(--house-rule)]">
                {group.slots.map((slot) => {
                  const selected = slot.schedulingUrl === value;
                  return (
                    <label
                      key={slot.schedulingUrl}
                      className={`flex min-h-[52px] cursor-pointer items-center border-b border-[var(--house-rule)] text-[0.9rem] transition-colors duration-200 ${
                        selected ? "text-[var(--house-ink)]" : "text-[var(--house-muted)]"
                      } has-[:focus-visible]:text-[var(--house-ink)]`}
                    >
                      <input
                        type="radio"
                        name="time"
                        value={slot.schedulingUrl}
                        checked={selected}
                        onChange={() => onChoose(slot)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`mr-4 h-px w-6 transition-colors duration-200 ${
                          selected ? "bg-[var(--house-ink)]" : "bg-[var(--house-rule)]"
                        }`}
                      />
                      {formatTime(slot.start)}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}

/**
 * Native radios, visually hidden behind styled labels: arrow keys, Home/End,
 * group semantics and focus all come for free, where a hand-rolled
 * role="radiogroup" would be more code and more ways to get keyboard nav wrong.
 * Tracked-label list on hairline rules — not a card grid, not a pricing table.
 */
function Choice({
  ref,
  name,
  legend,
  options,
  value,
  onChange,
}: {
  ref?: Ref<HTMLFieldSetElement>;
  name: string;
  legend: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset ref={ref} className="m-0 border-0 p-0">
      <legend className="p-0 text-[0.8rem] text-[var(--house-muted)]">{legend}</legend>
      <div className="mt-4 border-t border-[var(--house-rule)]">
        {options.map((option) => {
          const selected = option.label === value;
          return (
            <label
              key={option.id}
              className={`flex min-h-[52px] cursor-pointer items-center border-b border-[var(--house-rule)] text-[0.95rem] transition-colors duration-200 ${
                selected ? "text-[var(--house-ink)]" : "text-[var(--house-muted)]"
              } has-[:focus-visible]:text-[var(--house-ink)]`}
            >
              <input
                type="radio"
                name={name}
                value={option.label}
                checked={selected}
                onChange={() => onChange(option.label)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`mr-4 h-px w-6 transition-colors duration-200 ${
                  selected ? "bg-[var(--house-ink)]" : "bg-[var(--house-rule)]"
                }`}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}
