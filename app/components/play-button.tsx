"use client";

interface PlayButtonProps {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  disabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export default function PlayButton({
  isLoading,
  isPlaying,
  isPaused,
  disabled,
  onPlay,
  onPause,
  onResume,
  onStop,
}: PlayButtonProps) {
  const handleMainAction = () => {
    if (isLoading) return;
    if (isPaused) {
      onResume();
    } else if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="flex items-center gap-5">
      {/* Main Play/Pause Button */}
      <div className="relative">
        {/* Pulse ring when playing */}
        <div
          className={`play-btn-ring ${isPlaying && !isPaused ? "active" : ""}`}
        />

        <button
          type="button"
          className="play-btn"
          onClick={handleMainAction}
          disabled={disabled || isLoading}
          id="play-btn"
          aria-label={
            isLoading
              ? "Generating speech..."
              : isPaused
              ? "Resume"
              : isPlaying
              ? "Pause"
              : "Play"
          }
        >
          {isLoading ? (
            <div className="vf-spinner" style={{ borderTopColor: "#0a0a0f" }} />
          ) : isPaused ? (
            /* Resume icon */
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : isPlaying ? (
            /* Pause icon */
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      {/* Stop Button — only visible during playback */}
      {(isPlaying || isPaused) && (
        <button
          type="button"
          className="vf-btn !rounded-full !w-12 !h-12 !p-0"
          onClick={onStop}
          id="stop-btn"
          aria-label="Stop"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
        </button>
      )}

      {/* Status text */}
      <span
        className="text-sm"
        style={{ color: "var(--vf-text-muted)" }}
      >
        {isLoading
          ? "Generating..."
          : isPaused
          ? "Paused"
          : isPlaying
          ? "Playing"
          : "Ready"}
      </span>
    </div>
  );
}
