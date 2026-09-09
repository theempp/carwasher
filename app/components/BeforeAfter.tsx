"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { FILM } from "@/lib/scene/sceneTimeline";

const ease = [0.22, 1, 0.36, 1] as const;

/** Natural width of the 4K loupe sources. */
const LOUPE_SOURCE_WIDTH = 3840;

/**
 * Honest pair, not a before/after wipe. The two frames are the film's first
 * and last, shot from different distances — a wipe would imply one locked
 * camera and invite a "finished clean" reading the footage does not support.
 */
const frames = [
  {
    src: FILM.first,
    loupe: FILM.firstLoupe,
    label: "Arrival",
    alt: "Lamborghini Huracán on the estate driveway on arrival, gloss black",
  },
  {
    src: FILM.last,
    loupe: FILM.lastLoupe,
    label: "Rinsed, door closed",
    alt: "Lamborghini Huracán rinsed to wet gloss black, near door flush",
  },
] as const;

type Spot = { x: number; y: number } | null;

/**
 * Press and hold to inspect at 1:1 device pixels. The magnified layer reads the
 * 4K still pulled from the signed archive, not the displayed 720/1024 frame —
 * otherwise the loupe would only magnify the browser's own upscale and imply
 * an inspection it does not deliver.
 */
function Loupe({
  src,
  active,
  spot,
}: {
  src: string;
  active: boolean;
  spot: Spot;
}) {
  if (!active || !spot) return null;

  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  // 1 image pixel per device pixel.
  const backgroundWidth = LOUPE_SOURCE_WIDTH / dpr;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${backgroundWidth}px auto`,
        backgroundPosition: `${spot.x * 100}% ${spot.y * 100}%`,
        backgroundRepeat: "no-repeat",
        clipPath: `circle(clamp(4.5rem, 16vw, 7.5rem) at ${spot.x * 100}% ${spot.y * 100}%)`,
      }}
    />
  );
}

export function BeforeAfter() {
  return (
    <section data-tone="dark" className="bg-panel text-panel-fg">
      <motion.div
        className="mx-auto max-w-[92rem] px-[6vw] pt-6 pb-28 md:pb-36"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease }}
      >
        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          {frames.map((frame) => (
            <InspectableFrame key={frame.label} frame={frame} />
          ))}
        </div>

        <p className="mt-10 max-w-[26rem] text-[0.78rem] leading-relaxed tracking-[0.04em] text-muted">
          Both frames come from the film above — its first and its last. The
          right-hand car is rinsed and still wet, seconds after the door closed.
          It is not a finished, dried reveal. Press and hold either frame to
          inspect it at full resolution.
        </p>
      </motion.div>
    </section>
  );
}

function InspectableFrame({ frame }: { frame: (typeof frames)[number] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<Spot>(null);

  const track = useCallback((clientX: number, clientY: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    setSpot({
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    });
  }, []);

  const release = useCallback(() => setSpot(null), []);

  return (
    <figure className="m-0">
      <div
        ref={boxRef}
        className="relative aspect-[16/9] w-full touch-none overflow-hidden bg-ink outline-none focus-visible:ring-1 focus-visible:ring-panel-fg"
        tabIndex={0}
        role="button"
        aria-label={`Press and hold to inspect: ${frame.label}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          track(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (spot) track(event.clientX, event.clientY);
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onBlur={release}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          setSpot((held) => (held ? null : { x: 0.5, y: 0.5 }));
        }}
      >
        <Image
          src={frame.src}
          alt={frame.alt}
          fill
          sizes="(min-width: 768px) 44vw, 88vw"
          className="object-cover"
          draggable={false}
        />
        <Loupe src={frame.loupe} active={Boolean(spot)} spot={spot} />
      </div>
      <figcaption className="mt-4 border-t border-rule-inv pt-3">
        <p className="type-label text-muted">{frame.label}</p>
      </figcaption>
    </figure>
  );
}
