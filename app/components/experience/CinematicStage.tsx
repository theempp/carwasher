"use client";

import { useCallback, useRef, useState } from "react";
import { useScrollProgress } from "@/lib/utils/useScrollProgress";
import { CtaSection } from "@/app/components/CtaSection";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { FrameScrubber } from "@/app/components/experience/FrameScrubber";
import { LoadingScreen } from "@/app/components/experience/LoadingScreen";
import { SceneOverlay } from "@/app/components/experience/SceneOverlay";

export function CinematicStage() {
  const stageRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(stageRef);
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <>
      <LoadingScreen visible={!ready} />
      <ScrollProgress progress={progress} />
      <section
        ref={stageRef}
        className="relative h-dvh w-full overflow-hidden bg-ink"
      >
        {/* Film source is isolated here. Swap FrameScrubber for video or R3F later. */}
        <FrameScrubber progress={progress} onReady={handleReady} />
        <SceneOverlay progress={progress} />
        <CtaSection progress={progress} />
      </section>
    </>
  );
}
