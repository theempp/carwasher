const LINKS = [
  { href: "#house", label: "House" },
  { href: "#drive", label: "Drive" },
  { href: "#sequence", label: "Sequence" },
  { href: "#frames", label: "Frames" },
] as const;

export function HouseRail({ bookHref }: { bookHref: string }) {
  return (
    <nav className="house-rail sticky top-0 z-20" aria-label="House">
      <a href="#house" className="house-display text-[1.45rem] leading-none">
        CtLuxuryDetails
      </a>
      <ul className="house-rail-links">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <a href={bookHref} className="house-cta">
        Request a time
      </a>
    </nav>
  );
}
