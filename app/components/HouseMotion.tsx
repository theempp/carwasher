"use client";

import { useRef, type ReactNode } from "react";
import {
  HOUSE_CLIP,
  HOUSE_HANDOFF,
  HOUSE_STATION,
} from "@/lib/animation/houseMotion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";

/**
 * Clip handoffs + sequence ticking below the pin.
 * Never pins. Never touches the film, cineEase, or scene percents.
 */
export function HouseMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll("[data-house-slab]"), {
          clipPath: HOUSE_CLIP.to,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        el.classList.add("is-house-motion");

        const slabs = Array.from(
          el.querySelectorAll<HTMLElement>("[data-house-slab]"),
        );

        for (const slab of slabs) {
          gsap.fromTo(
            slab,
            { clipPath: HOUSE_CLIP.from },
            {
              clipPath: HOUSE_CLIP.to,
              ease: "none",
              immediateRender: true,
              scrollTrigger: {
                trigger: slab,
                start: HOUSE_HANDOFF.start,
                end: HOUSE_HANDOFF.end,
                scrub: true,
              },
            },
          );
        }

        const stations = Array.from(
          el.querySelectorAll<HTMLElement>("[data-house-station]"),
        );

        for (const station of stations) {
          ScrollTrigger.create({
            trigger: station,
            start: HOUSE_STATION.start,
            end: HOUSE_STATION.end,
            onToggle: (self) => {
              if (!self.isActive) return;
              for (const node of stations) {
                node.classList.toggle("is-active", node === station);
              }
            },
          });
        }

        const sequence = el.querySelector("#sequence");
        if (sequence) {
          ScrollTrigger.create({
            trigger: sequence,
            start: HOUSE_STATION.start,
            end: "bottom top",
            onLeaveBack: () => {
              for (const node of stations) node.classList.remove("is-active");
            },
          });
        }

        return () => {
          el.classList.remove("is-house-motion");
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="after-pin relative z-10">
      {children}
    </div>
  );
}
