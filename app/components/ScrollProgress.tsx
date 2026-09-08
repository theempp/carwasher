type ScrollProgressProps = {
  progress: number;
};

export function ScrollProgress({ progress }: ScrollProgressProps) {
  const height = Math.min(1, Math.max(0, progress)) * 100;

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 z-50 h-full w-px bg-bone/12"
      role="progressbar"
      aria-valuenow={Math.round(height)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Scroll progress"
    >
      <div className="w-full bg-amber" style={{ height: `${height}%` }} />
    </div>
  );
}
