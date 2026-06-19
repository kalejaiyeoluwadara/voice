"use client";

import { useRef, useEffect, useCallback } from "react";

interface AudioVisualizerProps {
  getAnalyserNode: () => AnalyserNode | null;
  isPlaying: boolean;
  isPaused: boolean;
}

const BAR_COUNT = 48;

export default function AudioVisualizer({
  getAnalyserNode,
  isPlaying,
  isPaused,
}: AudioVisualizerProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const analyser = getAnalyserNode();

    if (analyser && isPlaying && !isPaused) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Map frequency data to bars
      const step = Math.floor(dataArray.length / BAR_COUNT);
      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = barsRef.current[i];
        if (!bar) continue;

        // Sample from the frequency data
        const index = Math.min(i * step, dataArray.length - 1);
        const value = dataArray[index];
        const normalizedHeight = (value / 255) * 100;
        const height = Math.max(4, normalizedHeight);

        bar.style.height = `${height}%`;
        bar.style.opacity = `${0.4 + (normalizedHeight / 100) * 0.6}`;
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [getAnalyserNode, isPlaying, isPaused]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, isPaused, animate]);

  // Reset bars when not playing
  useEffect(() => {
    if (!isPlaying) {
      barsRef.current.forEach((bar) => {
        if (bar) {
          bar.style.height = "";
          bar.style.opacity = "";
        }
      });
    }
  }, [isPlaying]);

  return (
    <div
      className="flex items-end justify-center gap-[3px] h-[120px] w-full px-4"
      id="audio-visualizer"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const isActive = isPlaying && !isPaused;
        // Create a wave-like delay for idle animation
        const delay = `${(i / BAR_COUNT) * 1.5}s`;

        return (
          <div
            key={i}
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className={`viz-bar ${!isActive ? "viz-bar-idle" : ""}`}
            style={{
              height: isActive ? "4%" : undefined,
              animationDelay: !isActive ? delay : undefined,
              background: `linear-gradient(to top, 
                hsl(${175 + (i / BAR_COUNT) * 90}, 80%, 55%), 
                hsl(${220 + (i / BAR_COUNT) * 60}, 70%, 65%))`,
            }}
          />
        );
      })}
    </div>
  );
}
