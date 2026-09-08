export const FRAME_COUNT = 12;

export const sceneTimeline = [
  { start: 0.00, end: 0.15, scene: "hero",            label: "THE ARRIVAL" },
  { start: 0.15, end: 0.35, scene: "wheel-clean",     label: "THE WHEELS" },
  { start: 0.35, end: 0.55, scene: "exterior-wash",   label: "THE WASH" },
  { start: 0.55, end: 0.65, scene: "interior-reveal", label: "OPEN UP" },
  { start: 0.65, end: 0.85, scene: "interior-detail", label: "THE INTERIOR" },
  { start: 0.85, end: 0.90, scene: "clean-reveal",    label: "THE REVEAL" },
  { start: 0.90, end: 0.97, scene: "departure",       label: "DRIVE AWAY" },
  { start: 0.97, end: 1.00, scene: "sky-transition",  label: "BOOK YOUR DETAIL" },
] as const;

export type SceneBeat = (typeof sceneTimeline)[number];

export function getSceneAtProgress(progress: number): SceneBeat {
  const p = Math.min(1, Math.max(0, progress));
  for (const beat of sceneTimeline) {
    if (p >= beat.start && p < beat.end) return beat;
  }
  return sceneTimeline[sceneTimeline.length - 1];
}

export function getSceneIndex(progress: number): number {
  const scene = getSceneAtProgress(progress);
  return sceneTimeline.findIndex((beat) => beat.scene === scene.scene);
}
