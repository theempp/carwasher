const LINKS = [
  { href: "#house", label: "House" },
  { href: "#sequence", label: "Sequence" },
  { href: "#book", label: "Request a time" },
] as const;

export function HouseClose() {
  return (
    <section className="bg-[var(--house-ink)] px-[5vw] py-16 text-[var(--house-paper)] md:py-20">
      <p className="house-display text-[clamp(2.2rem,6vw,4.5rem)]">
        CtLuxuryDetails
      </p>
      <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[0.9rem]">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="transition-opacity hover:opacity-50">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-[22rem] text-[0.8rem] leading-relaxed text-[var(--house-paper)]/65">
        One film. Then the house. Words and service names stay placeholders until
        the owner signs them.
      </p>
    </section>
  );
}
