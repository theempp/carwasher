type LoadingScreenProps = {
  visible: boolean;
  /** 0–1 from `video.buffered`. Null when the coverage is unknown. */
  progress?: number | null;
};

export function LoadingScreen({ visible, progress }: LoadingScreenProps) {
  const known =
    typeof progress === "number" && Number.isFinite(progress) && progress >= 0;
  const clamped = known ? Math.min(1, Math.max(0, progress)) : null;
  const pct = clamped == null ? null : Math.round(clamped * 100);
  const label =
    pct == null ? "Loading" : `Loading ${String(pct).padStart(2, "0")}`;

  return (
    <div
      className="pointer-events-none absolute top-[calc(var(--house-rail-h)+0.7rem)] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
      }}
      aria-hidden={!visible}
      aria-busy={visible}
      role="status"
    >
      <p className="type-label text-panel-fg/70">{label}</p>
      {clamped == null ? null : (
        <div
          className="relative mt-3 h-px w-[12rem] max-w-[40vw] bg-rule-inv"
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0 bg-panel-fg/70"
            style={{ width: `${(clamped * 100).toFixed(2)}%` }}
          />
        </div>
      )}
    </div>
  );
}
