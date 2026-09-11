export function HouseDrive() {
  return (
    <section
      id="drive"
      data-house-slab
      className="grid min-h-[100dvh] md:grid-cols-2"
    >
      <article className="flex min-h-[70dvh] flex-col justify-end bg-[var(--house-stone)] px-[5vw] py-16 text-[var(--house-ink)] md:min-h-[100dvh] md:py-20">
        <p className="text-[0.8rem] text-[var(--house-muted)]">The drive</p>
        <h2 className="house-display mt-6 max-w-[9ch] text-[clamp(2.8rem,7vw,5.5rem)]">
          We come to the house.
        </h2>
      </article>
      <article className="flex min-h-[70dvh] flex-col justify-between bg-[var(--house-paper)] px-[5vw] py-16 text-[var(--house-ink)] md:min-h-[100dvh] md:py-20">
        <p className="max-w-[24rem] text-[0.95rem] leading-relaxed">
          The wash happens on your driveway — the same kind of private estate
          the film shows. No bay. No waiting room.
        </p>
        <p className="max-w-[24rem] text-[0.85rem] leading-relaxed text-[var(--house-muted)]">
          Connecticut is in the name. Towns are collected when you request a
          time. No invented coverage map.
        </p>
      </article>
    </section>
  );
}
