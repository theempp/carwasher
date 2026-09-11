"use client";

import { useEffect, useState } from "react";

/**
 * Whole-document rail. It used to live inside the pinned stage and read film
 * progress only, so it stopped meaning anything the moment the pin released.
 * It now reads document position for the entire page and is fixed alongside the
 * header.
 *
 * Consequence worth knowing: during the pin the numeral tracks scroll position
 * rather than the eased playhead, so it advances linearly where it used to
 * follow cineEase. One meaning for the whole page, and no scene percentages
 * outside sceneTimeline.
 */
export function ScrollProgress() {
  const [value, setValue] = useState(0);
  const [onFilm, setOnFilm] = useState(true);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      setValue(Math.min(1, Math.max(0, next)));

      const pin = document.querySelector<HTMLElement>(".after-pin");
      if (!pin) {
        setOnFilm(true);
        return;
      }
      setOnFilm(pin.getBoundingClientRect().top > window.innerHeight - 64);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const percent = Math.round(value * 100);

  return (
    <div
      className="pointer-events-none fixed inset-x-[6vw] bottom-[4.2vh] z-40"
      style={{ opacity: onFilm ? 1 : 0 }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page progress"
    >
      <p className="type-label absolute right-0 bottom-[0.7rem] text-panel-fg/65 mix-blend-difference">
        {String(percent).padStart(2, "0")}
      </p>
      <div className="relative h-px w-full bg-rule-inv mix-blend-difference">
        <div
          className="absolute inset-y-0 left-0 bg-panel-fg"
          style={{ width: `${(value * 100).toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}
