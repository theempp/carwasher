import { stations } from "@/lib/scene/sceneTimeline";

export function HouseSequence() {
  return (
    <section id="sequence">
      <header className="bg-[var(--house-ink)] px-[5vw] py-16 text-[var(--house-paper)] md:py-20">
        <p className="text-[0.8rem] text-[var(--house-paper)]/65">The sequence</p>
        <h2 className="house-display mt-6 max-w-[12ch] text-[clamp(2.6rem,6vw,5rem)]">
          What the film already showed.
        </h2>
        <p className="mt-8 max-w-[26rem] text-[0.9rem] leading-relaxed text-[var(--house-paper)]/70">
          Same beats as the playhead. Nothing added that the camera did not
          hold.
        </p>
      </header>
      {stations.map((station, index) => {
        const ink = index % 2 === 0;
        return (
          <article
            key={station.id}
            className={`flex min-h-[72dvh] flex-col justify-between px-[5vw] py-16 md:py-20 ${
              ink
                ? "bg-[var(--house-stone)] text-[var(--house-ink)]"
                : "bg-[var(--house-paper)] text-[var(--house-ink)]"
            }`}
          >
            <p
              className={
                ink
                  ? "text-[0.8rem] text-[var(--house-muted)]"
                  : "text-[0.8rem] text-[var(--house-muted)]"
              }
            >
              {station.eyebrow}
            </p>
            <div>
              <h3 className="house-display max-w-[12ch] text-[clamp(2.4rem,6vw,4.75rem)]">
                {station.headline[0]} {station.headline[1]}
              </h3>
              <p className="mt-6 max-w-[26rem] text-[0.95rem] leading-relaxed text-[var(--house-muted)]">
                {station.sub}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
