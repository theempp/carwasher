"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/*
 * ▼ PLACEHOLDER — the owner has not supplied a channel yet.
 * Replace with the real destination: sms: / tel: / an Instagram DM URL /
 * a Calendly prefill / Square. This is the only place it lives.
 */
const BOOKING_HREF = "#book";

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

const windows = [
  { id: "this-week", label: "This week" },
  { id: "next-week", label: "Next week" },
  { id: "flexible", label: "I'm flexible" },
] as const;

function compose(service: string, vehicle: string, when: string) {
  const car = vehicle.trim() || "[vehicle]";
  return `Hi — I'd like to book ${service} for my ${car}. Preferred window: ${when}.`;
}

export function BookingComposer() {
  const [service, setService] = useState<string>(services[0].label);
  const [vehicle, setVehicle] = useState("");
  const [when, setWhen] = useState<string>(windows[0].label);
  const vehicleId = useId();

  const message = compose(service, vehicle, when);

  return (
    <section id="book" data-tone="light" className="bg-paper text-paper-fg">
      <motion.div
        className="mx-auto flex min-h-[100dvh] max-w-[92rem] flex-col justify-end px-[6vw] pt-24 pb-16 md:pb-20"
        style={{ paddingBottom: "max(4rem, env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <p className="type-label text-muted">Booking</p>
        <h2 className="type-display mt-6 max-w-[12ch] text-[length:var(--display-size)]">
          Request a time.
        </h2>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-12">
            <Choice
              name="service"
              legend="Service"
              options={services}
              value={service}
              onChange={setService}
            />

            <div>
              <label htmlFor={vehicleId} className="type-label text-muted">
                Vehicle
              </label>
              <input
                id={vehicleId}
                type="text"
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
                placeholder="Year, make, model"
                autoComplete="off"
                className="mt-4 block w-full border-0 border-b border-rule bg-transparent pb-3 text-[0.95rem] tracking-[0.02em] text-ink outline-none placeholder:text-muted focus:border-ink"
              />
            </div>

            <Choice
              name="window"
              legend="Preferred window"
              options={windows}
              value={when}
              onChange={setWhen}
            />
          </div>

          <div className="flex flex-col justify-end">
            <p className="type-label text-muted">What gets sent</p>
            <output
              aria-live="polite"
              className="mt-4 block border-t border-rule pt-4 text-[0.9rem] leading-relaxed tracking-[0.02em] text-ink"
            >
              {message}
            </output>

            {/* Present from the first render, so the section still works if the
                interactive layer never comes up. */}
            <a
              href={BOOKING_HREF}
              className="type-label mt-10 inline-flex min-h-[44px] w-fit items-center border-b border-rule pb-2 text-ink transition-opacity duration-300 hover:opacity-60"
            >
              Send this request
            </a>
            <p className="mt-4 text-[0.7rem] leading-relaxed tracking-[0.04em] text-muted">
              Placeholder destination — the booking channel has not been wired
              yet. Nothing is stored or sent from this page.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Native radios, visually hidden behind styled labels: arrow keys, Home/End,
 * group semantics and focus all come for free, where a hand-rolled
 * role="radiogroup" would be more code and more ways to get keyboard nav wrong.
 * Tracked-label list on hairline rules — not a card grid, not a pricing table.
 */
function Choice({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="type-label p-0 text-muted">{legend}</legend>
      <div className="mt-4 border-t border-rule">
        {options.map((option) => {
          const selected = option.label === value;
          return (
            <label
              key={option.id}
              className={`type-label flex min-h-[52px] cursor-pointer items-center border-b border-rule transition-colors duration-200 ${
                selected ? "text-ink" : "text-muted"
              } has-[:focus-visible]:text-ink`}
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
                  selected ? "bg-ink" : "bg-rule"
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
