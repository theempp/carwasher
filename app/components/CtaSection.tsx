"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// ▼ PASTE YOUR BOOKING LINK HERE — phone / Instagram DM / Calendly / Square
const BOOKING_HREF = "#book";

export function CtaSection() {
  return (
    <section id="book" className="bg-paper text-paper-fg">
      <motion.div
        className="mx-auto flex min-h-[78dvh] max-w-[92rem] flex-col justify-end px-[6vw] pt-24 pb-16 md:pb-20"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <p className="type-label text-muted">Booking</p>
        <h2 className="type-display mt-6 max-w-[12ch] text-[length:var(--display-size)]">
          Request a time.
        </h2>
        <a
          href={BOOKING_HREF}
          className="type-label mt-10 inline-flex w-fit border-b border-rule pb-2 text-ink transition-colors duration-300 hover:text-muted"
        >
          Book a time
        </a>
      </motion.div>
    </section>
  );
}
