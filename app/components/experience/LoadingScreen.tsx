type LoadingScreenProps = {
  visible: boolean;
};

export function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center bg-ink px-5 md:px-10"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 500ms ease",
      }}
      aria-hidden={!visible}
      aria-busy={visible}
    >
      <div>
        <p className="font-mono text-[10px] tracking-[0.36em] text-steel uppercase">
          Andrew
        </p>
        <p className="mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-bone">
          DETAIL
        </p>
        <p className="mt-5 font-mono text-[10px] tracking-[0.4em] text-amber uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
