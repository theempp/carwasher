"use client";

import { useCallback, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { FILM } from "@/lib/scene/sceneTimeline";

const ease = [0.22, 1, 0.36, 1] as const;

export function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(0.46);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const next = (clientX - rect.left) / rect.width;
    setAmount(Math.min(0.97, Math.max(0.03, next)));
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setFromClientX(event.clientX);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setFromClientX(event.clientX);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const clipRight = `${((1 - amount) * 100).toFixed(2)}%`;

  return (
    <section className="bg-panel text-panel-fg">
      <motion.div
        className="mx-auto max-w-[92rem] px-[6vw] pt-6 pb-28 md:pb-36"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <div className="mb-6 flex items-end justify-between gap-6">
          <p className="type-label text-muted">Arrival</p>
          <p className="type-label text-right text-muted">Full coverage</p>
        </div>

        <div
          ref={frameRef}
          className="relative aspect-[16/9] w-full cursor-ew-resize overflow-hidden bg-ink select-none"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="slider"
          aria-label="Compare arrival and full coverage"
          aria-valuemin={3}
          aria-valuemax={97}
          aria-valuenow={Math.round(amount * 100)}
          tabIndex={0}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setAmount((value) => Math.max(0.03, value - 0.04));
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              setAmount((value) => Math.min(0.97, value + 0.04));
            }
          }}
        >
          <Image
            src={FILM.last}
            alt="Lamborghini Huracán at full foam coverage"
            fill
            sizes="100vw"
            className="object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${clipRight} 0 0)` }}
          >
            <Image
              src={FILM.first}
              alt="Lamborghini Huracán on arrival, gloss black"
              fill
              sizes="100vw"
              className="object-cover"
              draggable={false}
            />
          </div>
          <div
            className="absolute inset-y-0 z-10 w-px bg-panel-fg"
            style={{ left: `${(amount * 100).toFixed(2)}%` }}
          >
            <span className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-panel-fg" />
          </div>
        </div>

        <p className="mt-5 max-w-[26rem] text-[0.78rem] leading-relaxed tracking-[0.04em] text-muted">
          Honest pair from the same locked shot — arrival against full coverage.
          A rinsed reveal is not in this film yet.
        </p>
      </motion.div>
    </section>
  );
}
