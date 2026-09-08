"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FILM } from "@/lib/scene/sceneTimeline";

type FrameScrubberProps = {
  progress: number;
  onReady?: () => void;
  onFail?: () => void;
};

function loadStill(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

export function FrameScrubber({
  progress,
  onReady,
  onFail,
}: FrameScrubberProps) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([loadStill(FILM.first), loadStill(FILM.last)]).then(
      ([first, last]) => {
        if (cancelled) return;
        if (first && last) {
          setOk(true);
          onReady?.();
        } else {
          setOk(false);
          onFail?.();
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [onReady, onFail]);

  if (ok !== true) return null;

  const coverage = Math.min(1, Math.max(0, progress));

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src={FILM.first}
        alt=""
        fill
        sizes="100vw"
        className="film-fit"
      />
      <Image
        src={FILM.last}
        alt=""
        fill
        sizes="100vw"
        className="film-fit"
        style={{ opacity: coverage }}
      />
    </div>
  );
}
