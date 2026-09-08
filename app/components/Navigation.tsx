"use client";

export function Navigation() {
  return (
    <header className="pointer-events-none absolute inset-0 z-30">
      <nav className="absolute top-7 right-[6vw] flex items-center gap-8 md:top-8">
        <a
          href="#book"
          className="type-label pointer-events-auto text-panel-fg transition-colors duration-300 hover:text-muted"
        >
          Book
        </a>
      </nav>

      <p className="type-display pointer-events-none absolute bottom-[7.5vh] left-[6vw] text-[clamp(1.15rem,2vw,1.45rem)] text-panel-fg">
        [BRAND]
      </p>
    </header>
  );
}
