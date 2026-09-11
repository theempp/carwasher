export function HouseStatement() {
  return (
    <section
      id="house"
      data-house-slab
      className="grid min-h-[100dvh] md:grid-cols-2"
    >
      <article className="flex min-h-[80dvh] flex-col justify-between bg-[var(--house-ink)] px-[5vw] py-16 text-[var(--house-paper)] md:min-h-[100dvh] md:py-20">
        <p className="max-w-[22rem] text-[0.9rem] leading-relaxed text-[var(--house-paper)]/70">
          Private-drive work. Observed rather than staged. Placeholder line until
          the owner signs the words.
        </p>
        <h2 className="house-display max-w-[10ch] text-[clamp(3rem,8vw,6.5rem)]">
          The standard on your street.
        </h2>
      </article>
      <article className="flex min-h-[50dvh] flex-col justify-end bg-[var(--house-stone)] px-[5vw] py-16 text-[var(--house-ink)] md:min-h-[100dvh] md:py-20">
        <p className="max-w-[22rem] text-[0.95rem] leading-relaxed">
          One car. One driveway. The film above is the work — not a brochure
          around it.
        </p>
      </article>
    </section>
  );
}
