"use client";

import { useState } from "react";
import { VoiceSettings } from "../hooks/use-tts";

interface VoiceSettingsProps {
  settings: VoiceSettings;
  onChange: (settings: VoiceSettings) => void;
}

interface SliderConfig {
  key: keyof VoiceSettings;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  lowLabel: string;
  highLabel: string;
}

const SLIDERS: SliderConfig[] = [
  {
    key: "stability",
    label: "Stability",
    tooltip:
      "Controls voice consistency. Lower = more expressive and variable. Higher = more stable and monotone.",
    min: 0,
    max: 1,
    step: 0.01,
    lowLabel: "Variable",
    highLabel: "Stable",
  },
  {
    key: "similarity_boost",
    label: "Clarity + Similarity",
    tooltip:
      "How closely the AI matches the original voice. Higher values sound clearer but may introduce artifacts.",
    min: 0,
    max: 1,
    step: 0.01,
    lowLabel: "Low",
    highLabel: "High",
  },
  {
    key: "style",
    label: "Style Exaggeration",
    tooltip:
      "Amplifies the speaking style of the voice. Higher values are more expressive but can reduce stability.",
    min: 0,
    max: 1,
    step: 0.01,
    lowLabel: "None",
    highLabel: "Exaggerated",
  },
];

export default function VoiceSettingsPanel({
  settings,
  onChange,
}: VoiceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (key: keyof VoiceSettings, value: number) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-medium cursor-pointer group"
        style={{ color: "var(--vf-text-secondary)" }}
        onClick={() => setIsOpen(!isOpen)}
        id="settings-toggle"
      >
        <span className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Voice Settings
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="space-y-5 pt-2 animate-fade-in-up">
          {SLIDERS.map((slider) => (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium vf-tooltip"
                  style={{ color: "var(--vf-text-secondary)" }}
                  data-tooltip={slider.tooltip}
                >
                  {slider.label}
                </span>
                <span
                  className="text-xs font-mono tabular-nums"
                  style={{ color: "var(--vf-text-muted)" }}
                >
                  {settings[slider.key].toFixed(2)}
                </span>
              </div>

              <input
                type="range"
                className="vf-slider"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={settings[slider.key]}
                onChange={(e) =>
                  handleSliderChange(slider.key, parseFloat(e.target.value))
                }
                id={`slider-${slider.key}`}
              />

              <div
                className="flex items-center justify-between text-[10px]"
                style={{ color: "var(--vf-text-muted)" }}
              >
                <span>{slider.lowLabel}</span>
                <span>{slider.highLabel}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
