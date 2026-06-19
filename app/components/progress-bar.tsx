"use client";

interface ProgressBarProps {
  progress: number;
  currentTime: number;
  duration: number;
  onSeek: (percent: number) => void;
  isActive: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ProgressBar({
  progress,
  currentTime,
  duration,
  onSeek,
  isActive,
}: ProgressBarProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percent)));
  };

  if (!isActive) return null;

  return (
    <div className="space-y-2 w-full">
      <div
        className="progress-track"
        onClick={handleClick}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        tabIndex={0}
        id="progress-bar"
      >
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="flex items-center justify-between text-xs font-mono tabular-nums"
        style={{ color: "var(--vf-text-muted)" }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
