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
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Interim transcript in a Snapchat-style notification banner */}
      {isListening && interimTranscript && (
        <div
          className="text-sm text-center px-5 py-2.5 rounded-full max-w-xs animate-fade-in-up shadow-md font-semibold tracking-wide border"
          style={{
            background: "rgba(255, 252, 0, 0.12)",
            borderColor: "rgba(255, 252, 0, 0.25)",
            color: "var(--au-amber)",
          }}
        >
          {interimTranscript}
        </div>
      )}

      {/* Snapchat camera-shutter styled button */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Pulsing ring for capture state */}
        <div
          className={`absolute inset-0 rounded-full border-[3px] transition-all duration-500 ${
            isListening
              ? "border-yellow-400 animate-ping opacity-75 scale-110"
              : "border-white/20 scale-95"
          }`}
        />
        
        {/* Outer Shutter Ring */}
        <div
          className={`absolute inset-2 rounded-full border-[5px] transition-all duration-300 ${
            isListening ? "border-yellow-400 scale-105" : "border-white"
          }`}
          style={{
            boxShadow: isListening
              ? "0 0 20px rgba(255, 252, 0, 0.4)"
              : "0 0 15px rgba(255, 255, 255, 0.15)",
          }}
        />

        {/* Inner Solid Shutter Trigger */}
        <button
          type="button"
          className={`absolute w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 select-none cursor-pointer focus:outline-none ${
            isListening
              ? "bg-yellow-400 text-zinc-950 scale-95"
              : "bg-white text-zinc-900 hover:scale-105 active:scale-90"
          }`}
          onClick={onPress}
          disabled={isDisabled}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
          id="mic-btn"
        >
          {isListening ? (
            /* Waveform icon while recording */
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
            /* Standard Mic Icon */
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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

      {/* Bottom Hint */}
      <span
        className="text-[10px] uppercase tracking-widest font-black"
        style={{ color: isListening ? "var(--au-amber)" : "var(--au-text-muted)" }}
      >
        {isListening ? "Listening..." : "Tap to Speak"}
      </span>
    </div>
  );
}
