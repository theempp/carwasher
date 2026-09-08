"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FILM } from "@/lib/scene/sceneTimeline";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Honest pair, not a before/after wipe. The two frames are the film's first
 * and last, shot from different distances — a wipe would imply one locked
 * camera and invite a "finished clean" reading the footage does not support.
 */
const frames = [
  {
    src: FILM.first,
    label: "Arrival",
    alt: "Lamborghini Huracán on the estate driveway on arrival, gloss black",
  },
  {
    src: FILM.last,
    label: "Rinsed, door closed",
    alt: "Lamborghini Huracán rinsed to wet gloss black, near door flush",
  },
] as const;

export function BeforeAfter() {
  return (
    <section className="bg-panel text-panel-fg">
      <motion.div
        className="mx-auto max-w-[92rem] px-[6vw] pt-6 pb-28 md:pb-36"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          {frames.map((frame) => (
            <figure key={frame.label} className="m-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  sizes="(min-width: 768px) 44vw, 88vw"
                  className="object-cover"
                  draggable={false}
                />
              </div>
              <figcaption className="mt-4 border-t border-rule-inv pt-3">
                <p className="type-label text-muted">{frame.label}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 max-w-[26rem] text-[0.78rem] leading-relaxed tracking-[0.04em] text-muted">
          Both frames come from the film above — its first and its last. The
          right-hand car is rinsed and still wet, seconds after the door closed.
          It is not a finished, dried reveal.
        </p>
      </motion.div>
    </section>
  );
}
