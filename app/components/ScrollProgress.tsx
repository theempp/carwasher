type ScrollProgressProps = {
  progress: number;
};

export function ScrollProgress({ progress }: ScrollProgressProps) {
  const width = Math.min(1, Math.max(0, progress)) * 100;

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] bg-foam/10"
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Scroll progress"
    >
      <div
        className="h-full bg-accent"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
