"use client";

import { useRef, useEffect, useCallback } from "react";

interface AudioVisualizerProps {
  getAnalyserNode: () => AnalyserNode | null;
  isActive: boolean;
}

const BAR_COUNT = 32;

export default function AudioVisualizer({
  getAnalyserNode,
  isActive,
}: AudioVisualizerProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const analyser = getAnalyserNode();

    if (analyser && isActive) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      const step = Math.floor(dataArray.length / BAR_COUNT);
      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = barsRef.current[i];
        if (!bar) continue;

        const index = Math.min(i * step, dataArray.length - 1);
        const value = dataArray[index];
        const normalizedHeight = (value / 255) * 100;
        const height = Math.max(6, normalizedHeight);

        bar.style.height = `${height}%`;
        bar.style.opacity = `${0.4 + (normalizedHeight / 100) * 0.6}`;
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [getAnalyserNode, isActive]);

  useEffect(() => {
    if (isActive) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive, animate]);

  // Reset bars when not active
  useEffect(() => {
    if (!isActive) {
      barsRef.current.forEach((bar) => {
        if (bar) {
          bar.style.height = "";
          bar.style.opacity = "";
        }
      });
    }
  }, [isActive]);

  return (
    <div
      className="flex items-end justify-center gap-[3px] h-[40px] w-full"
      id="audio-visualizer"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const delay = `${(i / BAR_COUNT) * 1.5}s`;

        return (
          <div
            key={i}
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className={`viz-bar ${!isActive ? "viz-bar-idle" : ""}`}
            style={{
              height: isActive ? "6%" : undefined,
              animationDelay: !isActive ? delay : undefined,
              background: `linear-gradient(to top,
                hsl(${50 + (i / BAR_COUNT) * 15}, 100%, 50%),
                hsl(${320 + (i / BAR_COUNT) * 45}, 90%, 60%))`,

            }}
          />
        );
      })}
    </div>
  );
}
