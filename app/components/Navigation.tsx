"use client";

import { useEffect, useState } from "react";

type Tone = "dark" | "light";

/**
 * Persistent hairline header. It used to be absolute inside CinematicStage, so
 * it vanished the moment the pin released. Now it is fixed and inverts as it
 * crosses sections: the film and the panels are dark grounds, the booking
 * section is paper.
 *
 * Tone comes from an IntersectionObserver on a sentinel at the header's own
 * y-position reading each section's data-tone — no extra ScrollTriggers on the
 * hot path and no coupling to ScrollTrigger refresh.
 */
export function Navigation() {
  const [tone, setTone] = useState<Tone>("dark");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tone]"),
    );
    if (sections.length === 0) return;

    const read = () => {
      // The section sitting under the header line owns the tone.
      const line = 34;
      let next: Tone = "dark";
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          next = (section.dataset.tone as Tone) ?? "dark";
        }
      }
      setTone(next);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const fg = tone === "light" ? "text-paper-fg" : "text-panel-fg";
  const rule = tone === "light" ? "border-rule" : "border-rule-inv";

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-40 border-b ${rule} ${fg}`}
      style={{ transition: "color 420ms ease, border-color 420ms ease" }}
    >
      <div className="flex items-center justify-between px-[6vw] py-5 md:py-6">
        <a
          href="#top"
          className="type-display pointer-events-auto text-[clamp(1.05rem,1.8vw,1.35rem)]"
        >
          CtLuxuryDetails
        </a>
        <nav>
          <a
            href="#book"
            className="type-label pointer-events-auto transition-opacity duration-300 hover:opacity-60"
          >
            Book
          </a>
        </nav>
      </div>
    </header>
  );
}
