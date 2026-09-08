"use client";

export function Navigation() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-5 pt-6 md:px-10 md:pt-8">
      <div className="pointer-events-auto">
        <p className="font-mono text-[10px] tracking-[0.36em] text-bone uppercase">
          Andrew
        </p>
        <p className="mt-1.5 font-mono text-[9px] tracking-[0.4em] text-steel uppercase">
          Detail
        </p>
      </div>
      <button
        type="button"
        className="pointer-events-auto font-mono text-[10px] tracking-[0.36em] text-amber uppercase transition-colors duration-300 hover:text-bone"
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
