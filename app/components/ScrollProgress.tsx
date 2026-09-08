type ScrollProgressProps = {
  progress: number;
};

export function ScrollProgress({ progress }: ScrollProgressProps) {
  const value = Math.min(1, Math.max(0, progress));
  const percent = Math.round(value * 100);

  return (
    <div
      className="pointer-events-none absolute inset-x-[6vw] bottom-[4.2vh] z-30"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Film progress"
    >
      <p className="type-label absolute right-0 bottom-[0.7rem] text-panel-fg/65">
        {String(percent).padStart(2, "0")}
      </p>
      <div className="relative h-px w-full bg-rule-inv">
        <div
          className="absolute inset-y-0 left-0 bg-panel-fg"
          style={{ width: `${(value * 100).toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}
