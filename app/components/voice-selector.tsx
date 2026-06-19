"use client";

import { Voice, VoiceGroup } from "../hooks/use-voices";

interface VoiceSelectorProps {
  voices: Voice[];
  groupedVoices: VoiceGroup[];
  selectedVoice: Voice | null;
  onSelect: (voice: Voice) => void;
  onPreview: (voice: Voice) => void;
  previewingId: string | null;
  isLoading: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  premade: "Premium Voices",
  cloned: "Cloned Voices",
  generated: "Generated Voices",
  professional: "Professional Voices",
  default: "Default Voices",
  other: "Other Voices",
};

function getLabelBadges(labels: Record<string, string>): string[] {
  const display: string[] = [];
  if (labels.accent) display.push(labels.accent);
  if (labels.age) display.push(labels.age);
  if (labels.gender) display.push(labels.gender);
  if (labels.use_case) display.push(labels.use_case);
  return display.slice(0, 3);
}

export default function VoiceSelector({
  groupedVoices,
  selectedVoice,
  onSelect,
  onPreview,
  previewingId,
  isLoading,
}: VoiceSelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--vf-text-secondary)" }}
        >
          Voice
        </label>
        <div className="flex items-center gap-3 py-6 justify-center">
          <div className="vf-spinner" />
          <span className="text-sm" style={{ color: "var(--vf-text-muted)" }}>
            Loading voices...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label
        className="text-sm font-medium"
        style={{ color: "var(--vf-text-secondary)" }}
      >
        Voice
      </label>

      <div
        className="max-h-[320px] overflow-y-auto space-y-4 pr-1"
        id="voice-list"
      >
        {groupedVoices.map((group) => (
          <div key={group.category}>
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-2 px-2"
              style={{ color: "var(--vf-text-muted)" }}
            >
              {CATEGORY_LABELS[group.category] || group.category}
            </div>

            <div className="space-y-1">
              {group.voices.map((voice) => {
                const isSelected =
                  selectedVoice?.voice_id === voice.voice_id;
                const isPreviewing = previewingId === voice.voice_id;
                const badges = getLabelBadges(voice.labels);

                return (
                  <div
                    key={voice.voice_id}
                    className={`voice-card flex items-center justify-between ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => onSelect(voice)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(voice);
                      }
                    }}
                    id={`voice-${voice.voice_id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {voice.name}
                        </span>
                        {isSelected && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--vf-accent)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {badges.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {badges.map((badge) => (
                            <span key={badge} className="vf-badge">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preview button */}
                    <button
                      type="button"
                      className="vf-btn !py-1.5 !px-2 !rounded-full ml-2 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(voice);
                      }}
                      aria-label={`Preview ${voice.name}`}
                    >
                      {isPreviewing ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
