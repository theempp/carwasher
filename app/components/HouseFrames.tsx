"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FILM } from "@/lib/scene/sceneTimeline";

const LOUPE_SOURCE_WIDTH = 3840;

const frames = [
  {
    src: FILM.first,
    loupe: FILM.firstLoupe,
    label: "Arrival",
    line: "It shows up exactly as it is.",
    alt: "Lamborghini Huracán on the estate driveway on arrival, gloss black",
  },
  {
    src: FILM.last,
    loupe: FILM.lastLoupe,
    label: "Rinsed, door closed",
    line: "Wet gloss black. The near door flush. Not a dried reveal.",
    alt: "Lamborghini Huracán rinsed to wet gloss black, near door flush",
  },
] as const;

type Spot = { x: number; y: number } | null;

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

export function HouseFrames() {
  return (
    <section id="frames" className="bg-[var(--house-ink)] text-[var(--house-paper)]">
      <div className="px-[5vw] pt-16 md:pt-20">
        <p className="text-[0.8rem] text-[var(--house-paper)]/65">Frames</p>
        <h2 className="house-display mt-6 max-w-[12ch] text-[clamp(2.6rem,6vw,5rem)]">
          First and last. Nothing in between is a still.
        </h2>
      </div>
      {frames.map((frame) => (
        <InspectableFrame key={frame.label} frame={frame} />
      ))}
      <p className="max-w-[28rem] px-[5vw] pt-4 pb-20 text-[0.85rem] leading-relaxed text-[var(--house-paper)]/65">
        Both frames come from the film above. Press and hold to inspect at full
        resolution. The right-hand car is still wet.
      </p>
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
    <figure className="m-0 grid md:grid-cols-2">
      <div
        ref={boxRef}
        className="relative aspect-[16/9] w-full touch-none overflow-hidden bg-ink outline-none focus-visible:ring-1 focus-visible:ring-[var(--house-paper)]"
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
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          draggable={false}
        />
        <Loupe src={frame.loupe} active={Boolean(spot)} spot={spot} />
      </div>
      <figcaption className="flex flex-col justify-end px-[5vw] py-10 md:px-12 md:py-16">
        <p className="text-[0.8rem] text-[var(--house-paper)]/65">{frame.label}</p>
        <p className="house-display mt-5 max-w-[14ch] text-[clamp(1.8rem,4vw,3.25rem)]">
          {frame.line}
        </p>
      </figcaption>
    </figure>
  );
}
