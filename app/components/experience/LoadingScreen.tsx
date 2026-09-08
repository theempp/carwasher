type LoadingScreenProps = {
  visible: boolean;
};

export function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-ink px-6 py-8 md:px-12"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 500ms ease",
      }}
      aria-hidden={!visible}
      aria-busy={visible}
    >
      <p className="font-mono text-[10px] tracking-[0.42em] text-mist uppercase">
        Andrew
      </p>
      <div>
        <p className="font-mono text-[10px] tracking-[0.38em] text-accent uppercase">
          Loading
        </p>
        <p className="mt-3 font-display text-5xl font-light tracking-[0.08em] text-foam md:text-7xl">
          The Detail
        </p>
      </div>
      <p className="font-mono text-[10px] tracking-[0.32em] text-mist uppercase">
        Mineral Grey  ·  F80
      </p>
    </div>
  );
}
