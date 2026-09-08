"use client";

export function Navigation() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-6 pt-7 md:px-12">
      <div className="pointer-events-auto">
        <p className="font-display text-xl font-light tracking-[0.28em] text-foam uppercase">
          Andrew
        </p>
        <p className="mt-1 font-mono text-[9px] tracking-[0.36em] text-mist uppercase">
          Detail
        </p>
      </div>
      <button
        type="button"
        className="pointer-events-auto font-mono text-[10px] tracking-[0.36em] text-foam uppercase transition-colors duration-300 hover:text-accent"
        onClick={() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }}
      >
        Book
      </button>
    </header>
  );
}
