"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Kept as a line array so re-signing the words stays a one-line edit and the
 * per-line reveal has something to key off. Copy is placeholder.
 */
const headline = ["THE STANDARD", "ON YOUR STREET."] as const;

export function TrustPanel() {
  return (
    <section data-tone="dark" className="bg-panel text-panel-fg">
      <div className="mx-auto flex min-h-[85dvh] max-w-[92rem] flex-col justify-center px-[6vw] py-24 md:py-32">
        <h2 className="type-display max-w-[12ch] text-[length:var(--display-size)]">
          {headline.map((line, index) => (
            <motion.span
              key={line}
              className="block overflow-hidden"
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.35 }}
              variants={{ hidden: {}, shown: {} }}
              transition={{ duration: 0.9, ease, delay: index * 0.09 }}
            >
              <motion.span
                className="block"
                variants={{ hidden: { y: "108%" }, shown: { y: "0%" } }}
              >
                {line}
              </motion.span>
            </motion.span>
          ))}
        </h2>

        <motion.div
          className="mt-10 h-px w-full max-w-[26rem] origin-left bg-rule-inv"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease, delay: 0.22 }}
        />

        <motion.p
          className="mt-8 max-w-[26rem] text-[0.82rem] leading-relaxed tracking-[0.04em] text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease, delay: 0.32 }}
        >
          Private-drive work, observed rather than staged. Placeholder line until
          the owner signs off on the words.
        </motion.p>
      </div>
    </section>
  );
}
