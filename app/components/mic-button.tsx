"use client";

interface MicButtonProps {
  isListening: boolean;
  isSupported: boolean;
  isDisabled: boolean;
  interimTranscript: string;
  onPress: () => void;
}

export default function MicButton({
  isListening,
  isSupported,
  isDisabled,
  interimTranscript,
  onPress,
}: MicButtonProps) {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="text-xs text-center px-4"
          style={{ color: "var(--au-text-muted)" }}
        >
          Voice input not supported in this browser. Use text instead.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Interim transcript */}
      {isListening && interimTranscript && (
        <div
          className="text-sm text-center px-4 py-2 rounded-full max-w-xs animate-fade-in-up"
          style={{
            background: "rgba(167, 139, 250, 0.08)",
            border: "1px solid rgba(167, 139, 250, 0.1)",
            color: "var(--au-text-secondary)",
          }}
        >
          {interimTranscript}
        </div>
      )}

      {/* Mic button */}
      <div className="relative">
        <div className={`mic-btn-ring ${isListening ? "active" : ""}`} />
        <div className={`mic-btn-ring-2 ${isListening ? "active" : ""}`} />

        <button
          type="button"
          className={`mic-btn ${isListening ? "listening" : ""}`}
          onClick={onPress}
          disabled={isDisabled}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
          id="mic-btn"
        >
          {isListening ? (
            /* Waveform icon while listening */
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="8" x2="4" y2="16" />
              <line x1="8" y1="4" x2="8" y2="20" />
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="16" y1="4" x2="16" y2="20" />
              <line x1="20" y1="8" x2="20" y2="16" />
            </svg>
          ) : (
            /* Microphone icon */
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>
      </div>

      {/* Label */}
      <span
        className="text-xs"
        style={{ color: "var(--au-text-muted)" }}
      >
        {isListening ? "Listening..." : "Tap to speak"}
      </span>
    </div>
  );
}
