"use client";

import { useEffect, useRef } from "react";
import { getSceneAtProgress, FRAME_COUNT } from "@/lib/scene/sceneTimeline";

type Fit = "cover" | "contain";

type FrameScrubberProps = {
  progress: number;
  frameCount?: number;
  fit?: Fit;
  onReady?: () => void;
};

function frameSrc(index1: number): string {
  return `/frames/frame-${String(index1).padStart(4, "0")}.jpg`;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawFitted(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  fit: Fit,
) {
  const imageRatio = img.width / img.height;
  const canvasRatio = width / height;
  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;

  const cover = fit === "cover";
  if (imageRatio > canvasRatio === cover) {
    dh = height;
    dw = height * imageRatio;
    dx = (width - dw) / 2;
    dy = 0;
  } else {
    dw = width;
    dh = width / imageRatio;
    dx = 0;
    dy = (height - dh) / 2;
  }

  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  const scene = getSceneAtProgress(progress);
  ctx.fillStyle = "#08090B";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#8E8A82";
  ctx.font = "400 11px 'DM Mono', ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("FRAME UNAVAILABLE", width / 2, height * 0.22);

  ctx.fillStyle = "#EDE6D6";
  ctx.font = "800 22px Syne, ui-sans-serif, sans-serif";
  ctx.fillText(scene.label, width / 2, height * 0.26);
}

function paintCanvas(
  canvas: HTMLCanvasElement,
  frames: (HTMLImageElement | null)[],
  progress: number,
  fit: Fit,
) {
  const parent = canvas.parentElement;
  if (!parent) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = parent.clientWidth;
  const height = parent.clientHeight;
  if (width === 0 || height === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelW = Math.round(width * dpr);
  const pixelH = Math.round(height * dpr);
  if (canvas.width !== pixelW || canvas.height !== pixelH) {
    canvas.width = pixelW;
    canvas.height = pixelH;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const count = frames.length;
  const index = count > 1 ? Math.round(progress * (count - 1)) : 0;
  const frame = frames[index] ?? null;

  if (frame) {
    drawFitted(ctx, frame, width, height, fit);
  } else {
    drawPlaceholder(ctx, width, height, progress);
  }
}

export function FrameScrubber({
  progress,
  frameCount = FRAME_COUNT,
  fit = "cover",
  onReady,
}: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const progressRef = useRef(progress);
  const fitRef = useRef(fit);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    progressRef.current = progress;
    fitRef.current = fit;
    onReadyRef.current = onReady;
  }, [progress, fit, onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const paint = () => {
      if (cancelled) return;
      paintCanvas(
        canvas,
        framesRef.current,
        progressRef.current,
        fitRef.current,
      );
    };

    const sources = Array.from({ length: frameCount }, (_, i) =>
      frameSrc(i + 1),
    );

    Promise.all(sources.map(loadImage)).then((loaded) => {
      if (cancelled) return;
      framesRef.current = loaded;
      paint();
      onReadyRef.current?.();
    });

    const parent = canvas.parentElement ?? canvas;
    const observer = new ResizeObserver(paint);
    observer.observe(parent);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [frameCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintCanvas(canvas, framesRef.current, progress, fit);
  }, [progress, fit]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
