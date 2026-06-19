"use client";

import { useRef, useEffect } from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TextInput({ value, onChange, disabled }: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(180, Math.min(textarea.scrollHeight, 400))}px`;
    }
  }, [value]);

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onChange(clipboardText);
    } catch {
      // Clipboard access denied
    }
  };

  const handleClear = () => {
    onChange("");
    textareaRef.current?.focus();
  };

  const charCount = value.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="text-input"
          className="text-sm font-medium"
          style={{ color: "var(--vf-text-secondary)" }}
        >
          Enter your text
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePaste}
            disabled={disabled}
            className="vf-btn text-xs !py-1.5 !px-3"
            id="paste-btn"
          >
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Paste
          </button>
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="vf-btn text-xs !py-1.5 !px-3"
              id="clear-btn"
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        id="text-input"
        className="vf-textarea"
        placeholder="Type or paste the text you want to hear spoken with a natural, human-like voice..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={6}
      />

      <div
        className="flex items-center justify-between text-xs"
        style={{ color: "var(--vf-text-muted)" }}
      >
        <span>{charCount.toLocaleString()} characters</span>
        {charCount > 5000 && (
          <span style={{ color: "#f59e0b" }}>
            Long text may take longer to generate
          </span>
        )}
      </div>
    </div>
  );
}
