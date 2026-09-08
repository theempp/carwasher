type LoadingScreenProps = {
  visible: boolean;
};

export function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <p
      className="type-label pointer-events-none absolute top-7 left-1/2 z-30 -translate-x-1/2 text-panel-fg/70"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 400ms ease",
      }}
      aria-hidden={!visible}
      aria-busy={visible}
    >
      Loading
    </p>
  );
}
