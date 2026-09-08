"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function TrustPanel() {
  return (
    <section className="bg-panel text-panel-fg">
      <motion.div
        className="mx-auto flex min-h-[85dvh] max-w-[92rem] flex-col justify-center px-[6vw] py-24 md:py-32"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease }}
      >
        <h2 className="type-display max-w-[12ch] text-[length:var(--display-size)]">
          THE STANDARD ON YOUR STREET.
        </h2>
        <p className="mt-8 max-w-[26rem] text-[0.82rem] leading-relaxed tracking-[0.04em] text-muted">
          Private-drive work, observed rather than staged. Placeholder line until
          the owner signs off on the words.
        </p>
      </motion.div>
    </section>
  );
}
